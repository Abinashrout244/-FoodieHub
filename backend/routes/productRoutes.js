const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, upload.single('image'), addProduct);
router.put('/:id', protect, admin, upload.single('image'), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
