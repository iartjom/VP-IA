const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: './public/gallery/orig/'});

//kontrollerid
const{
	galleryPhotoUpload,
	galleryPhotoUploadPost} = require('../controllers/galleryPhotoUploadControllers');

router.route('/').get(galleryPhotoUpload);

router.route('/').post(upload.single('photoInput'), galleryPhotoUploadPost);

module.exports = router;