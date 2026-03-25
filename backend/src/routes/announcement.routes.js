const express = require('express');
const router = express.Router();
const {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement
} = require('../controllers/announcement.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getAnnouncements);
router.post('/', restrictTo('HR', 'ADMIN'), createAnnouncement);
router.delete('/:id', restrictTo('HR', 'ADMIN'), deleteAnnouncement);

module.exports = router;
