const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/audit.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', restrictTo('HR', 'ADMIN'), getAuditLogs);

module.exports = router;
