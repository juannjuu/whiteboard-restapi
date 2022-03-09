const express = require("express");
const router = express.Router();
const {
    register,
    login,
    forgotPassword,
    resetPassword,
} = require("../controllers/authController");
const passport = require("../config/passport");
const { googleCallback } = require("../controllers/authController");
const {
    registerValidation,
    loginValidation,
} = require("../middlewares/authValidation");

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/api/v1/auth/google", session: false }),
    googleCallback
);

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;