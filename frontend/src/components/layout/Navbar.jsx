import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={user ? "/dashboard" : "/"} className="text-white text-2xl font-bold">
          TaskFlow
        </Link>
        
        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm hidden sm:inline">
                Welcome, {user.username} ({user.role})
              </span>

              {isAdmin && (
                <Link to="/admin" className="text-white hover:text-indigo-200">
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded text-sm transition duration-150"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="text-white hover:text-indigo-200">
                Login
              </Link>
              <Link to="/register" className="text-white hover:text-indigo-200">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;