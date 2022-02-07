const express = require('express');
const router = express.Router();
const cardRoute = require('./cardRoute')

router.use('/cards', cardRoute)

module.exports = router