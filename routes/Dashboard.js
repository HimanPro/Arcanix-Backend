const express = require('express');
const { getDashboardData } = require('../controller/Dashboard');
const router = express.Router()

router.get('/dashboard', getDashboardData)

module.exports = router;
