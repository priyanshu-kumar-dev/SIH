const express = require("express");

const {
  check,
  forgotPassword,
  googleLogin,
  login,
  logout,
  protect,
  resetPassword,
  signup,
  updateMe,
  updatePassword,
} = require("../controllers/auth.controller.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/logout", logout);

router.patch("/updateMe", protect, updateMe);
router.patch("/updateMyPassword", protect, updatePassword);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.get("/me", protect, check);

module.exports = router;