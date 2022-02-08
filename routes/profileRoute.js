const express = require("express");
const router = express.Router();
const {register, editProfile, getProfile, changePassword} = require("../controllers/profileController")
const {isLogin} = require("../middlewares/auth")
const {registerValidation} = require("../middlewares/authValidation")

router.post("/register", registerValidation, register)
router.post("/", isLogin, getProfile)
router.put("/", isLogin, editProfile)
router.put("/changePassword", isLogin, changePassword)

module.exports = router