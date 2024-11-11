const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            const eleveurId = req.user.id.toString();
            if (!req.uploadFolder) {
                req.uploadFolder = uuidv4();
            }
            const dir = path.join(__dirname, '..', 'uploads', eleveurId, req.uploadFolder);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            cb(null, dir);
        } catch (error) {
            cb(new Error('Failed to create upload directory'), false);
        }
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        req.filePath = `/uploads/${req.user.id}/${req.uploadFolder}/${uniqueName}`; 
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf'];
        allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type.'));
    },
    limits: { fileSize: 10 * 1024 * 1024 } 
}).fields([{ name: 'image', maxCount: 1 }, { name: 'fichier_sexage', maxCount: 1 }]);

const uploadFiles = (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: `Multer error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ error: `Upload error: ${err.message}` });
        }
        next();
    });
};

module.exports = uploadFiles;
