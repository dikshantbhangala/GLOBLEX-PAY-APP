const express = require('express');
const {auth} = require('../middleware/Auth');
const upload = require('../middleware/upload');
const userController = require('../controllers/usercontroller');

const router = express.Router;

router.get('/profile', auth , userController.getProfile);
router.get('/profile', auth , userController.updateProfile);
router.get('/avatar', auth , upload.single('avatar'),userController.uploadAvatar);
router.put('/fcm-token', auth, userController.updateFCMToken);

module.exports = router;

