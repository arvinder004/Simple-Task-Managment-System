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
  
  // The original component's logic for calculating isMobile/isTablet and getEnhancedStyles
  // has been removed as styling is now handled directly by Tailwind CSS classes.

  return (
    // Nav Container: Sticky top, white background, shadow, and indigo accent border (matches original style intention)
    <nav className="sticky top-0 z-40 flex justify-center items-center py-3 px-4 bg-white shadow-lg border-b-2 border-indigo-600">
      
      {/* Content Wrapper: Max width, responsive layout (stack on small screens) */}
      <div className="w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
        
        {/* Left Section: Logo and Navigation Links */}
        {/* Responsive gap and stacking on mobile */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-8">
          
          {/* Logo */}
          <Link 
            to="/" 
            onClick={handleLogout} 
            className="text-2xl font-black text-indigo-700 tracking-wide transition duration-200 hover:text-indigo-900"
          >
            TaskFlow
          </Link>
          
          {/* Dynamic Link based on Role */}
          {user.role === 'admin' ? (
              <Link 
                to="/admin" 
                className="text-gray-600 font-semibold px-2 py-1 rounded-md transition duration-200 hover:text-indigo-600 hover:bg-gray-100"
              >
                Admin Dashboard
              </Link>
          ) : (
            <Link 
              to="/dashboard" 
              className="text-gray-600 font-semibold px-2 py-1 rounded-md transition duration-200 hover:text-indigo-600 hover:bg-gray-100" 
            >
              My Tasks
            </Link>
          )}
        </div>
        
        {/* Right Section: User Info and Logout Button */}
        {/* Responsive stacking on mobile */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* User Info Tag (userInfo style) */}
          <span className="text-sm font-semibold px-3 py-1 rounded-md bg-indigo-50 text-indigo-700">
            Welcome, {user.username} ({user.role})
          </span>
          
          {/* Logout Button (baseLogoutButton style) */}
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-pink-600 text-white border-none rounded-full cursor-pointer font-bold text-sm
                       shadow-md shadow-pink-300 transition duration-200 hover:bg-pink-700 hover:scale-[1.03] hover:shadow-lg active:scale-100"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
