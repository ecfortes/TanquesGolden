// routes/index.js
const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

router.get('/germana/graph', eventsController.viewGraph);
router.get('/germana', eventsController.viewGermana);
router.get('/:id_machine?', eventsController.getEvents);
router.post('/create', eventsController.createEvent);
router.get('/update/:id', eventsController.getUpdatePage);
router.post('/update/:id', eventsController.updateEvent);
router.get('/delete/:id', eventsController.deleteEvent);

module.exports = router;
