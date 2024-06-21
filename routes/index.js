// routes/index.js
const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const mqttClient = require('../api/services/MqttService');

router.get('/tanks', eventsController.viewTanks);

router.get('/dados', (req, res) => {
    res.json(mqttClient.getCollectedData()); // Retorna os dados coletados como JSON
});

module.exports = router;
