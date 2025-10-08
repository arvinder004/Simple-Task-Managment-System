import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import ProtectedRoutes from './components/ProtectedRoutes';
import Layout from './components/Layout';
import UserTasksManagement from './components/UserTaskManagement';
import AdminDashboard from './components/AdminDashboard';
import './index.css'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoutes>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoutes>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoutes>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoutes>
          } 
        />
        <Route 
          path="/admin/user/:userId/tasks" 
          element={
            <ProtectedRoutes>
              <Layout>
                <UserTasksManagement />
              </Layout>
            </ProtectedRoutes>
          } 
        />
        
      </Routes>
    </Router>
  );
};

export default App;