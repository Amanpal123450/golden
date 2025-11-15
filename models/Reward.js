const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  reward_number: { 
    type: String, 
    required: true, 
    unique: true  // same number dubara create nahi hoga
  },

  media: {
    type: String,
    required: true, // Cloudinary image URL
  },

  is_claimed: {
    type: Boolean,
    default: false, // pehli baar false hoga
  },

  claimed_at: {
    type: Date,
    default: null,
  },

  created_at: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("Reward", rewardSchema);
