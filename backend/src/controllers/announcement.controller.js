const prisma = require('../utils/prisma');

// POST /api/announcements - HR/Admin creates announcement
const createAnnouncement = async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: 'Title and body are required.' });
  }

  try {
    const announcement = await prisma.announcement.create({
      data: {
        title,
        body,
        createdBy: req.user.id
      },
      include: {
        author: {
          select: { firstName: true, lastName: true }
        }
      }
    });
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'ANNOUNCEMENT_CREATE',
        detail: `Created announcement: ${title}`
      }
    });
    res.status(201).json(announcement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/announcements - all roles
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { firstName: true, lastName: true }
        }
      }
    });
    res.json(announcements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /api/announcements/:id - HR/Admin only
const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    const announcement = await prisma.announcement.findUnique({
      where: { id }
    });

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found.' });
    }

    await prisma.announcement.delete({ where: { id } });
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'ANNOUNCEMENT_DELETE',
        detail: `Deleted announcement: ${announcement.title}`
      }
    });
    res.json({ message: 'Announcement deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement
};
