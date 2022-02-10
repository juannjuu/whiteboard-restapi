const express = require("express");
const router = express.Router();
const TeamController = require('../controllers/teamController')

router.get('/:userId', TeamController.getTeam)
router.post('/:userId', TeamController.createTeam)
router.get('/detail/:teamId', TeamController.getDetailTeam)

module.exports = router