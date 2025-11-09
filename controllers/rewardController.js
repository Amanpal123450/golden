const Reward = require("../models/Reward");
const { uploadToCloudinary } = require("../utils/imageUploader");

exports.createReward = async (req, res) => {
  try {
    const { reward_number } = req.body;

    // Check if file aya hai
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const imageFile = req.files.image;

    // Upload image to Cloudinary
    const uploadedImage = await uploadToCloudinary(imageFile, "rewards");

    // Create reward with image URL
    const reward = new Reward({
      reward_number,
      media: uploadedImage.secure_url, // yahan image URL aayega
    });

    await reward.save();
    res.status(201).json({
      success: true,
      message: "Reward created successfully",
      reward,
    });
  } catch (err) {
    console.error("Error creating reward:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create reward",
      error: err.message,
    });
  }
};


// ========== Get All Rewards ==========
exports.getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.find().populate("media").sort({ createdAt: -1 });
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch rewards", error: err.message });
  }
};

// ========== Get Single Reward ==========
exports.getRewardById = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id).populate("media");
    if (!reward) return res.status(404).json({ message: "Reward not found" });
    res.json(reward);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reward", error: err.message });
  }
};

// ========== Update Reward ==========
exports.updateReward = async (req, res) => {
  try {
    const { reward_number, media_id } = req.body;
    const reward = await Reward.findByIdAndUpdate(
      req.params.id,
      { reward_number, media: media_id },
      { new: true }
    ).populate("media");

    if (!reward) return res.status(404).json({ message: "Reward not found" });
    res.json(reward);
  } catch (err) {
    res.status(500).json({ message: "Failed to update reward", error: err.message });
  }
};

// ========== Delete Reward ==========
exports.deleteReward = async (req, res) => {
  try {
    const reward = await Reward.findByIdAndDelete(req.params.id);
    if (!reward) return res.status(404).json({ message: "Reward not found" });
    res.json({ message: "Reward deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete reward", error: err.message });
  }
};
