/**
 * Multer File Upload Middleware
 * Supports avatar uploads with image type filtering and file size limits.
 */

const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

let uploadMiddleware = null;

try {
  const multer = require('multer');

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `avatar-${uniqueSuffix}${ext}`);
    }
  });

  const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP image formats are allowed'), false);
    }
  };

  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter
  });

  uploadMiddleware = upload.single('avatar');
} catch (e) {
  // Graceful fallback if multer package is not installed
  uploadMiddleware = (req, res, next) => {
    req.file = {
      filename: 'default-avatar.png',
      path: '/uploads/default-avatar.png'
    };
    next();
  };
}

module.exports = uploadMiddleware;
