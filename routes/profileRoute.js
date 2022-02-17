const express = require("express");
const router = express.Router();
const {editProfile, getProfile, changePassword, changeEmail} = require("../controllers/profileController")
const {isLogin} = require("../middlewares/auth")
const {uploadCloud} = require("../middlewares/cloudUpload")
const {editProfileValidation, changeEmailValidation} = require("../middlewares/profileValidation")

router.get("/", isLogin, getProfile)
router.put("/", isLogin, editProfileValidation ,uploadCloud("image"), editProfile)
router.put("/changepassword", isLogin, changePassword)
router.put("/changemail", isLogin, changeEmailValidation, changeEmail)

module.exports = router