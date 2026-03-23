const express = require('express');
const router = express.Router();
const { getMe, updateMe, getAllUsers } = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.get('/', protect, getMe);
router.patch('/', protect, updateMe);
router.get('/all', protect, restrictTo('HR', 'ADMIN'), getAllUsers);

module.exports = router;