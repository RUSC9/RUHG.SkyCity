// districts/cityCenter/routes/cityCenter.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/cityCenterControllers');

// Homepage
router.get('/', controller.index);

// Announcements
router.get('/announcements', controller.getAnnouncements);
router.post('/announcements', controller.addAnnouncement);

module.exports = router;

