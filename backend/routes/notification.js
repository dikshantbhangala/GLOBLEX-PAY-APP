const express = require('express');
const { auth, adminAuth } = require('../middleware/Auth');
const notificationController = require('../controllers/notificationcontroller');

const router = express.Router();

router.post('/send', auth, notificationController.sendNotification);
router.post('/bulk', adminAuth, notificationController.sendBulkNotification);

module.exports = router;