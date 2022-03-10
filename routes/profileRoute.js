const express = require("express");
const router = express.Router();
const ProfileController = require("../controllers/profileController")
const {isLogin} = require("../middlewares/auth")
const {uploadCloud} = require("../middlewares/cloudUpload")
const {editProfileValidation} = require("../middlewares/profileValidation")

router.get("/", isLogin, ProfileController.getProfile)
router.put("/", isLogin, editProfileValidation ,uploadCloud("image"), ProfileController.editProfile)
router.put("/changepassword", isLogin, ProfileController.changePassword)

module.exports = router