const express = require("express");
const router = express.Router();
const {register, editProfile, getProfile} = require("../controllers/profileController")
const {isLogin} = require("../middlewares/auth")
const {registerValidation} = require("../middlewares/authValidation")

router.post("/register", registerValidation, register)
router.post("/", isLogin, editProfile)
router.post("/", isLogin, getProfile)

module.exports = router