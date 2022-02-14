const express = require("express");
const router = express.Router();
const { register, login, forgotPassword, resetPassword} = require("../controllers/authController");
const passport = require("../config/passport");
const { googleCallback, facebookCallback} = require("../controllers/authController");
const {registerValidation, loginValidation} = require("../middlewares/authValidation")

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/api/v1/auth/google" }),
    googleCallback
);

router.get(
    "/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
        failureRedirect: "/api/v1/auth/facebook",
    }),
    facebookCallback
);

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;