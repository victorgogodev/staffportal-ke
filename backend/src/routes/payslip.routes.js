const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  uploadPayslip,
  getMyPayslips,
  downloadPayslip,
  getAllPayslips
} = require('../controllers/payslip.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Multer config - PDF only, stored in uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `payslip-${unique}.pdf`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed.'), false);
  }
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

router.use(protect);

router.post('/upload', restrictTo('HR', 'ADMIN'), upload.single('payslip'), uploadPayslip);
router.get('/me', getMyPayslips);
router.get('/', restrictTo('HR', 'ADMIN'), getAllPayslips);
router.get('/:id/download', downloadPayslip);

module.exports = router;