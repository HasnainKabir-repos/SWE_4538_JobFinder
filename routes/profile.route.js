const router = require('express').Router();
const {
    uploadProfile,
    uploadVideo
} = require('../controller/profile.controller');

const uploadProfileImage = require('../middleware/image.middleware');
const uploadVideoFile = require('../middleware/video.middleware');

const isAuthenticated = require('../middleware/auth.middleware');

router.post('/', isAuthenticated, uploadProfileImage.single('image'), uploadProfile);
router.put('/video', isAuthenticated, uploadVideoFile.single('video'), uploadVideo);

module.exports = router;