import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', background: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
      <Link to="/dashboard" style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>Dashboard</Link>
      <div>
        <span>Welcome, {user.username} ({user.role})</span>
        <button onClick={handleLogout} style={{ marginLeft: '15px' }}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar