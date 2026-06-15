require('dotenv/config');
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const leaveRoutes = require('./src/routes/leave.routes');
const payslipRoutes = require('./src/routes/payslip.routes');
const announcementRoutes = require('./src/routes/announcement.routes');
const auditRoutes = require('./src/routes/audit.routes');
const notificationRoutes = require('./src/routes/notification.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173/' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payslips', payslipRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'StaffPortal KE API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
