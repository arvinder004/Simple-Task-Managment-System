import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginForm from './pages/Auth/LoginForm';
import RegisterForm from './pages/Auth/RegisterForm';

const DashboardPage = () => <div className="p-8 text-center text-xl">User Dashboard Page (Tasks will go here)</div>;
const AdminDashboard = () => <div className="p-8 text-center text-xl text-red-500">Admin Management Page (Users will go here)</div>;

const AppRouter = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main className="container mx-auto p-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />

            {/* User Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<div className="text-center text-2xl mt-10">404 - Page Not Found</div>} />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;