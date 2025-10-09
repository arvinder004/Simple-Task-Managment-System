import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-5xl font-extrabold text-indigo-700 mb-4">404</h1>
      <p className="text-lg text-gray-700 mb-6">Page not found.</p>
      <Link to="/" className="px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;


