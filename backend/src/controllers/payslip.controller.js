const prisma = require('../utils/prisma');
const path = require('path');
const fs = require('fs');

// POST /api/payslips/upload - HR/Admin uploads a payslip for a user
const uploadPayslip = async (req, res) => {
  const { userId, month, year } = req.body;

  if (!userId || !month || !year) {
    return res.status(400).json({ message: 'userId, month and year are required.' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'A PDF file is required.' });
  }

  try {
    const payslip = await prisma.payslip.create({
      data: {
        userId,
        month: parseInt(month),
        year: parseInt(year),
        fileUrl: req.file.filename,
        uploadedBy: req.user.id
      }
    });
    res.status(201).json(payslip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
}

// GET /api/payslips/me - get current user's payslips
const getMyPayslips = async (req, res) => {

  try {
    const payslips = await prisma.payslip.findMany({
      where: { userId: req.user.id },
      orderBy: [{ year: 'desc' }, { month: 'desc' }]
    });
    res.json(payslips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
}

// GET /api/payslips/:id/download - secure file download
const downloadPayslip = async (req, res) => {
  const { id } = req.params;

  try {
    const payslip = await prisma.payslip.findUnique({ where: { id } });

    if (!payslip) {
      return res.status(404).json({ message: 'Payslip not found.' });
    }

    // Only owner or HR/Admin can download
    const isOwner = payslip.userId === req.user.id;
    const isPrivileged = ['HR', 'ADMIN'].includes(req.user.role);

    if (!isOwner && !isPrivileged) {
      return res.status(403).json({ message: 'You do not have permission to download this payslip.' });
    }

    const filePath = path.join(__dirname, '../../uploads', payslip.fileUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server.' });
    }

    res.download(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' })
  }
}

// GET /api/payslips - all payslips (HR/Admin only)
const getAllPayslips = async (req, res) => {
  try {
    const payslips = await prisma.payslip.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
    res.json(payslips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' })
  }
}

module.exports = { uploadPayslip, getMyPayslips, downloadPayslip, getAllPayslips }