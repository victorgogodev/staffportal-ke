import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './routes/ProtectedRoute';

// Placeholder dashboards - replaced in Phase 3
const Dashboard = () => <div className="p-8 text-2xl font-bold text-blue-700">Employee Dashboard - Phase 3</div>
const Manager = () => <div className="p-8 text-2xl font-bold text-purple-700">Manager Dashboard - Phase 3</div>
const HR = () => <div className="p-8 text-2xl font-bold text-green-700">HR Dashboard - Phase 3</div>
const Admin = () => <div className="p-8 text-2xl font-bold text-red-700">Admin Dashboard - Phase 3</div>

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manager" element={<Manager />} />
          <Route path="/hr" element={<HR />} />
          <Route path="/admin" element={<Admin />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;