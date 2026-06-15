const prisma = require('../utils/prisma');

// GET /api/notifications — current user's notifications, newest first
const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications.' });
  }
};

// PATCH /api/notifications/:id/read — mark one as read
const markOneRead = async (req, res) => {
  try {
    const notification = await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.user.id },
      data: { read: true }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark notification as read.' });
  }
};

// PATCH /api/notifications/read-all — mark all as read
const markAllRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.userId, read: false },
      data: { read: true }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark all as read.' });
  }
};

module.exports = {
  getNotifications,
  markOneRead,
  markAllRead
};
