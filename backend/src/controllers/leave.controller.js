const prisma = require('../utils/prisma');

// POST /api/leaves - submit a leave request
const createLeave = async (req, res) => {
  const { type, startDate, endDate, days, reason } = req.body;

  if (!type || !startDate || !endDate || !days) {
    return res
      .status(400)
      .json({ message: 'Type, start date, end date and days required.' });
  }

  const existingPending = await prisma.leave.findFirst({
    where: {
      userId: req.user.id,
      status: 'PENDING'
    }
  });

  if (existingPending) {
    return res.status(400).json({
      message:
        'You already have a pending leave request. Wait for it to be reviewed before submitting another.'
    });
  }

  const TYPE_LABELS = {
    ANNUAL: 'Annual',
    SICK: 'Sick',
    COMPASSIONATE: 'Compassionate'
  };

  const MAX_DAYS = {
    ANNUAL: 21,
    SICK: 10,
    COMPASSIONATE: 3
  };

  const maxAllowed = MAX_DAYS[type];
  if (parseInt(days) > maxAllowed) {
    return res.status(400).json({
      message: `${type} leave cannot exceed ${maxAllowed} days.`
    });
  }

  try {
    const leave = await prisma.leave.create({
      data: {
        userId: req.user.id,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        days: parseInt(days),
        reason,
        status: 'PENDING'
      }
    });
    res.status(201).json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/leaves/me - employee's own leave history
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await prisma.leave.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/leaves - all leaves (Manager/HR/Admin)
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await prisma.leave.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            department: true
          }
        }
      }
    });
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// PATCH /api/leaves/:id/approve - approve a leave
const approveLeave = async (req, res) => {
  const { id } = req.params;

  try {
    const leave = await prisma.leave.update({
      where: { id },
      data: {
        status: 'APPROVED',
        reviewedBy: req.user.id
      }
    });
    res.json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// PATCH /api/leaves/:id/reject - reject a leave with reason
const rejectLeave = async (req, res) => {
  const { reviewNote } = req.body;

  if (!reviewNote) {
    return res
      .status(400)
      .json({ message: 'A reason is required when rejecting a leave.' });
  }

  const { id } = req.params;

  try {
    const leave = await prisma.leave.update({
      where: { id },
      data: {
        status: 'REJECTED',
        reviewedBy: req.user.id,
        reviewNote
      }
    });
    res.json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  createLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave
};
