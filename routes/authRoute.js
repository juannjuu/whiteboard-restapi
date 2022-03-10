const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
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

router.post("/register", registerValidation, AuthController.register);
router.post("/login", loginValidation, AuthController.login);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

module.exports = router;