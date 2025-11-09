const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  reward_number: { type: String, required: true },
 media: {
      type: String, // URL of uploaded image
      required: true,
    },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reward", rewardSchema);
