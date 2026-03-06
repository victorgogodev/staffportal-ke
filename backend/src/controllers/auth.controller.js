const bcrypt = require('bcryptjs');
const prisma = require('../utils/prisma');
const { generateToken } = require('../utils/token');

const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // 2. Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 3. Compare password with stored hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 4. Generate token
    const token = generateToken(user);

    // 5. Send back user info + token (never send passwordHash!)
    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
}

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
        createdAt: true
      }
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
}

module.exports = { login, getMe }