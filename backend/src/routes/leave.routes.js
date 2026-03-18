const express = require('express');
const router = express.Router();
const {
  createLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave
} = require('../controllers/leave.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

router.post('/', createLeave);
router.get('/me', getMyLeaves);
router.get('/', restrictTo('MANAGER', 'HR', 'ADMIN'), getAllLeaves);
router.patch('/:id/approve', restrictTo('MANAGER', 'HR', 'ADMIN'), approveLeave);
router.patch('/:id/reject', restrictTo('MANAGER', 'HR', 'ADMIN'), rejectLeave);

module.exports = router;