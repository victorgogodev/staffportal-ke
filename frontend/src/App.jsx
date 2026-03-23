import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './routes/ProtectedRoute';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import HRDashboard from './pages/HRDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import LeaveRequestForm from './pages/LeaveRequestForm';
import LeaveHistory from './pages/LeaveHistory';
import LeaveApprovals from './pages/LeaveApprovals';
import MyPayslips from './pages/MyPayslips';
import PayslipUpload from './pages/PayslipUpload';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected routes - all dashboard routes share DashboardLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<EmployeeDashboard />} />
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="/hr" element={<HRDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/leave" element={<LeaveRequestForm />} />
            <Route path="/leave/history" element={<LeaveHistory />} />
            <Route path="/leave/approvals" element={<LeaveApprovals />} />
            <Route path="/payslips" element={<MyPayslips />} />
            <Route path="/payslips/upload" element={<PayslipUpload />} />
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;