const express = require("express");
const router = express.Router();
const {isLogin} = require("../middlewares/auth")
const TeamController = require('../controllers/teamController')

router.get('/', isLogin, TeamController.getTeam)
router.get('/:teamId', isLogin, TeamController.getOneTeam)
router.post('/', isLogin, TeamController.createTeam)
router.get('/detail/team', isLogin, TeamController.getDetailTeam)

module.exports = router