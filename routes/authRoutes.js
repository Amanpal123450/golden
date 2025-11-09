const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/authControllers");
const {auth, authorizeRole} = require("../middlewares/auth"); // Make sure this file exists and exports a function

// Public routes
router.post("/register", ctrl.register);
router.post("/admin/register" , ctrl.adminRegister);
router.post("/login", ctrl.login);

module.exports = router;