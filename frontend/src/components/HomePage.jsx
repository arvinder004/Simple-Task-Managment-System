import React from "react";
import { Link } from 'react-router-dom';

export default function HomePage() {
  
  return (
    // Main Container: Full screen, centered content, background gradient
    <div className="text-center min-h-screen h-screen overflow-hidden flex flex-col justify-center items-center p-5 
                    bg-gradient-to-br from-blue-100 to-emerald-50">
      
      {/* Main Heading (Responsive Font Size) */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-indigo-700 mb-2 sm:mb-4">
        Welcome to the Task Management System
      </h1>
      
      {/* Body Text/Introduction */}
      <div className="text-base text-gray-700 max-w-xl mx-auto my-5 sm:my-8 leading-relaxed">
        <p>
          <strong className="font-bold text-indigo-600">TaskFlow</strong> is a powerful and intuitive platform designed to help teams and individuals manage their projects and daily tasks efficiently. 
          Organize your assignments by priority, track progress through status updates, and collaborate seamlessly to ensure every task is completed on time.
        </p>
      </div>
      
      {/* Call to Action */}
      <p className="text-lg text-gray-600 mb-8 sm:mb-10 font-medium">
        Please log in or register to begin managing your workflow.
      </p>
      
      {/* Button Container (Responsive Flex) */}
      <div className="flex gap-4 sm:gap-6 justify-center w-full max-w-sm">
        
        {/* Login Button */}
        <Link to="/login" className="flex-1">
          <button 
            className="w-full px-7 py-3 rounded-xl font-semibold text-lg transition duration-300 ease-in-out 
                       bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-300"
          >
            Login
          </button>
        </Link>
        
        {/* Register Button */}
        <Link to="/register" className="flex-1">
          <button 
            className="w-full px-7 py-3 rounded-xl font-semibold text-lg transition duration-300 ease-in-out 
                       bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-300"
          >
            Register
          </button>
        </Link>
      </div>
    </div>
  );
}