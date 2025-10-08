import React from 'react';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <p>Loading user data or not logged in...</p>;
  }

  return user.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;