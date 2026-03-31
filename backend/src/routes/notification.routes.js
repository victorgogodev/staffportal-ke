const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getNotifications,
  markOneRead,
  markAllRead
} = require('../controllers/notification.controller');

router.use(protect);

router.get('/', getNotifications);
router.patch('/read-all', markAllRead); // must be before /:id
router.patch('/:id/read', markOneRead);

module.exports = router;
