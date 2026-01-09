const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/', upload.single('image'), (req, res) => {
    // Return full URL
    const protocol = req.protocol;
    const host = req.get('host');
    // Note: Render/Netlify might need specific domain handling, but for now standard host is fine.
    // If backend is on https, protocol will be https.
    const fullUrl = `${protocol}://${host}/${req.file.path.replace(/\\/g, '/')}`;

    res.send({
        message: 'Image uploaded',
        image: fullUrl,
        filePath: `/${req.file.path.replace(/\\/g, '/')}`
    });
});

module.exports = router;
