const express = require("express");
const router = express.Router();
const {
    verifyGiftNumber

} = require("../controllers/userRewardControllers");
const { auth, authorizeRole } = require("../middlewares/auth");

// CRUD routes
router.post("/verify", verifyGiftNumber);

module.exports = router;
