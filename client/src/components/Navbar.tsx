import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import DarkModeToggle from './DarkModeToggle';
import NotificationsIcon from './NotificationsIcon';
import { darkModeService } from '../services/darkModeService';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = async () => {
    // Reset dark mode to light mode
    document.body.classList.remove('dark-mode');
    await darkModeService.saveDarkModePreference(false);
    
    // Perform logout
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-red-600 shadow-lg w-full">
      <div className="max-w-7xl mx-auto px-3">
        <div className="flex flex-col py-1">
          {/* Top row with logo and welcome message */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <span className="text-black text-xl sm:text-2xl font-bold">F1</span>
              <span className="text-black text-sm sm:text-base whitespace-nowrap">
                Welcome, {user?.username?.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <DarkModeToggle />
              <NotificationsIcon />
            </div>
          </div>
          
          {/* Bottom row with navigation buttons */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => navigate('/profile')}
              className="text-black hover:text-gray-700 px-2 py-1 text-sm whitespace-nowrap"
            >
              My Profile
            </button>
            <button
              onClick={() => navigate('/teams-and-drivers')}
              className="text-black hover:text-gray-700 px-2 py-1 text-sm whitespace-nowrap"
            >
              Teams & Drivers
            </button>
            <button
              onClick={() => navigate('/events')}
              className="text-black hover:text-gray-700 px-2 py-1 text-sm whitespace-nowrap"
            >
              Events
            </button>
            <button
              onClick={() => navigate('/racing-spots')}
              className="text-black hover:text-gray-700 px-2 py-1 text-sm whitespace-nowrap"
            >
              Racing Spots
            </button>
            <button
              onClick={() => navigate('/race-weather')}
              className="text-black hover:text-gray-700 px-2 py-1 text-sm whitespace-nowrap"
            >
              Race Weather
            </button>
            <button
              onClick={() => navigate('/standings')}
              className="text-black hover:text-gray-700 px-2 py-1 text-sm whitespace-nowrap"
            >
              Standings
            </button>
            <div className="flex items-center ml-auto space-x-4">
              <button
                onClick={() => navigate('/home')}
                className="text-black hover:text-gray-700 px-2 py-1 text-sm whitespace-nowrap"
              >
                Home
              </button>
              <button
                onClick={handleLogout}
                className="bg-white text-red-600 px-2 py-1 rounded-md hover:bg-gray-100 text-sm whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 