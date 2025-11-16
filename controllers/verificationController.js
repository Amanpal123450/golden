const Verification = require("../models/Verification");
const Reward = require("../models/Reward");
const { uploadToCloudinary } = require("../utils/imageUploader"); // utility to upload image
// const User = require("../models/User");
// 🧾 User submits verification form
exports.submitVerification = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      country,
      state,
      district,
      pincode,
      address,
      reward_number, // ⬅ reward number frontend se bhejna zaroori
    } = req.body;

    // 🔍 Check all fields
    if (
      !name || !email || !phone || !country ||
      !state || !district || !pincode || !address || !reward_number
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // 🎁 Reward ko database me search karo
    const reward = await Reward.findOne({ reward_number });

    if (!reward) {
      return res.status(404).json({
        success: false,
        message: "Invalid gift number"
      });
    }

    // ❌ Check if reward already claimed
    if (reward.is_claimed) {
      return res.status(400).json({
        success: false,
        message: "This gift number has already been used",
        redirect: "/error"
      });
    }

    // 📸 Upload Image
    let photoUrl = null;
    if (req.files && req.files.photo) {
      const uploaded = await uploadToCloudinary(req.files.photo, "verification_photos");
      photoUrl = uploaded.secure_url;
    }

    // 📝 Save Verification Form
    const verification = await Verification.create({
      name,
      email,
      phone,
      country,
      state,
      district,
      pincode,
      address,
      photo: photoUrl,
      reward_number,               // ⬅ Added
      user: req.user ? req.user._id : null,
    });

    // 🟢 Reward ko claimed mark karo
    reward.is_claimed = true;
    reward.claimed_at = new Date();
    await reward.save();

    return res.status(201).json({
      success: true,
      message: "Verification submitted successfully",
      verification,
    });

  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// 📋 Admin gets all verifications
exports.getAllVerifications = async (req, res) => {
  try {
    const verifications = await Verification.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, verifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch verifications", error: error.message });
  }
};

// ❌ Admin deletes a verification
exports.deleteVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Verification.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Verification not found" });

    res.status(200).json({ success: true, message: "Verification deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
