const express = require("express");
const router = express.Router();

const {
  login,
  signUp,
  sendOTP,
  changePassword,
} = require("../controllers/Auth");
const { auth } = require("../middlewares/auth");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");

// Authentication routes

router.post("/login", login);

router.post("/signup", signUp);

router.post("/sendOTP", sendOTP);

router.post("/changepassword", auth, changePassword);

// resetPassword Routes

router.post("/reset-password-token", resetPasswordToken);

router.post("/reset-password", resetPassword);

module.exports = router;
