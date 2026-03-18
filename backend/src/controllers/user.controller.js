const prisma = require('../utils/prisma');

// GET /api/users/me
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        department: true,
        jobTitle: true,
        phone: true,
        address: true,
        employeeId: true,
        joinedAt: true,
        createdAt: true
      }
    });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
}

// PATCH /api/users/me
const updateMe = async (req, res) => {
  const { firstName, lastName, email, phone, address } = req.body;

  try {
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(address && { address }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        department: true,
        jobTitle: true,
        phone: true,
        address: true,
        employeeId: true,
        joinedAt: true
      }
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
}

module.exports = { getMe, updateMe }