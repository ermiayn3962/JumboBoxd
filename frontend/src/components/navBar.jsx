import React from 'react';
import { SignOutButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title - Left side */}
          <div className="flex-shrink-0">
            <button
              onClick={handleHomeClick}
              className="text-2xl font-bold text-white hover:text-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg px-2 py-1"
            >
              Jumboboxd
            </button>
          </div>

          {/* Sign Out Button - Right side */}
          <div className="flex-shrink-0">
            <SignOutButton>
              <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;