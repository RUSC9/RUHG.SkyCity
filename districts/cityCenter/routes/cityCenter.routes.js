const express = require('express');
const router = express.Router();
const cityCenterController = require('../controllers/cityCenterController');

// Homepage
router.get('/', cityCenterController.index);

// Announcements
router.get('/announcements', cityCenterController.getAnnouncements);
router.post('/announcements', cityCenterController.addAnnouncement);

module.exports = router;


