const express = require('express');
const { auth, adminAuth } = require('../middleware/Auth');
const { kycValidation } = require('../middleware/validation');
const upload = require('../middleware/upload');
const kycController = require('../controllers/kycController');

const router = express.Router();

router.post('/submit', auth, kycValidation, kycController.submitKYC);
router.post('/upload-document', auth, upload.single('document'), kycController.uploadDocument);
router.get('/status', auth, kycController.getKYCStatus);
router.put('/review/:kycId', adminAuth, kycController.reviewKYC);
router.get('/pending', adminAuth, kycController.getPendingKYCs);

module.exports = router;