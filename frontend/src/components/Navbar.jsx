
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
    <nav style={navStyle}>
      <div style={leftSectionStyle}>
        <Link to="/" style={linkStyle}>Home</Link>
        {user.role === 'admin' ? (
          <>
            <Link to="/admin" style={linkStyle}>Admin Dashboard</Link>
          </>
        ) : (
          <Link to="/dashboard" style={linkStyle}>My Tasks</Link>
        )}
      </div>
      <div style={rightSectionStyle}>
        <span style={userInfoStyle}>Welcome, {user.username} ({user.role})</span>
        <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
      </div>
    </nav>
  );
}

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  background: '#f8f9fa',
  borderBottom: '1px solid #dee2e6',
};

const leftSectionStyle = {
  display: 'flex',
  gap: '20px',
};

const rightSectionStyle = {
  display: 'flex',
  alignItems: 'center',
};

const linkStyle = {
  textDecoration: 'none',
  color: '#007bff',
  fontWeight: 'bold',
};

const userInfoStyle = {
  marginRight: '15px',
};

const logoutButtonStyle = {
  padding: '5px 10px',
  background: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default Navbar;