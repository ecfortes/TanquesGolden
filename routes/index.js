// routes/index.js
const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

router.get('/', eventsController.viewTanks);

module.exports = router;
