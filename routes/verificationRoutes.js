const express = require("express");
const router = express.Router();
const {
  submitVerification,
  getAllVerifications,
  deleteVerification,
} = require("../controllers/verificationController");
const { auth, authorizeRole } = require("../middlewares/auth");

// 🧾 User submits form (no need for admin)
router.post("/submit", submitVerification);

// 📋 Admin: Get all submissions
router.get("/", auth, authorizeRole("ADMIN"), getAllVerifications);

// ❌ Admin: Delete a submission
router.delete("/:id", auth, authorizeRole("ADMIN"), deleteVerification);

module.exports = router;
