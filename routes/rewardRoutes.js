const express = require("express");
const router = express.Router();
const {
  createReward,
  getAllRewards,
  deleteReward,
  updateReward,
} = require("../controllers/rewardController");
const { auth, authorizeRole } = require("../middlewares/auth");

// CRUD routes
router.post("/", auth, authorizeRole("ADMIN"), createReward);
router.get("/",getAllRewards);
router.delete("/:id", auth, authorizeRole("ADMIN"),deleteReward);
router.put("/:id", auth, authorizeRole("ADMIN"),updateReward);

module.exports = router;
