const express = require('express');
const router = express.Router();
const authRoute = require('./authRoute');
const profileRoute = require('./profileRoute');
const boardRoute = require('./boardRoute');
const teamRoute = require('./teamRoute');
const cardRoute = require('./cardRoute');

router.use("/auth", authRoute);
router.use("/profile", profileRoute);
router.use("/board", boardRoute);
router.use("/team", teamRoute);
router.use("/card", cardRoute);

module.exports = router
