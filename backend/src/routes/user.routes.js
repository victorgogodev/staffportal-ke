const express = require('express');
const router = express.Router();
const { getMe, updateMe } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getMe);
router.patch('/', protect, updateMe);

module.exports = router;