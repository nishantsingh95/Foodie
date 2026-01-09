const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinary');

const router = express.Router();

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
    res.send({
        message: 'Image uploaded',
        image: req.file.path,
    });
});

module.exports = router;
