// ========== rewardController.js (Updated) ==========
const Reward = require("../models/Reward");
const { uploadToCloudinary } = require("../utils/imageUploader")

// ========== NEW: Verify Gift Number ==========
exports.verifyGiftNumber = async (req, res) => {
  try {
    const { gift_number } = req.body;

    if (!gift_number || gift_number.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please enter a gift number",
      });
    }

    // Find reward by number
    const reward = await Reward.findOne({ reward_number: gift_number.trim() });

    if (!reward) {
      return res.status(404).json({
        success: false,
        message: "Invalid gift number",
        redirect: "/error"
      });
    }

    // Check if already claimed
    if (reward.is_claimed) {
      return res.status(400).json({
        success: false,
        message: "This gift number has already been used",
        redirect: "/error"
      });
    }

    // Mark as claimed
    reward.is_claimed = true;
    reward.claimed_at = new Date();
    await reward.save();

    // Return reward details
    res.status(200).json({
      success: true,
      message: "Gift number verified successfully",
      redirect: "/reward",
      reward: {
        id: reward._id,
        reward_number: reward.reward_number,
        media: reward.media,
      }
    });

  } catch (err) {
    console.error("Error verifying gift number:", err);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
      error: err.message,
    });
  }
};
