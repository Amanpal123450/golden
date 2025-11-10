const Verification = require("../models/Verification");
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
    } = req.body;

    if (!name || !email || !phone || !country || !state || !district || !pincode || !address) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let photoUrl = null;

    // If user uploaded a file
    if (req.files && req.files.photo) {
      const uploaded = await uploadToCloudinary(req.files.photo, "verification_photos");
      photoUrl = uploaded.secure_url;
    }

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
      user: req.user ? req.user._id : null, // optional, if logged in
    });

    return res.status(201).json({
      success: true,
      message: "Verification submitted successfully",
      verification,
    });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
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
