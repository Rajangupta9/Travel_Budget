const express = require('express');
const {signup, login , forgotPassword, verifyOTP, resetPassword, profile } = require('../Controller/userController');
const  verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.get("/profile", verifyToken, profile);

module.exports = router;