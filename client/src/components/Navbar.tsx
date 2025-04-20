import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import DarkModeToggle from './DarkModeToggle';
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
    <nav className=" bg-red-600 shadow-lg w-full">
      <div className="max-w-7xl mx-auto px-3">
        <div className="flex flex-col py-1">
          {/* Top row with logo and welcome message */}
          <div className="pl-1 pt-2 flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <span className="text-black text-2xl sm:text-3xl font-black tracking-tighter transform bg-white px-3 py-1 rounded-md shadow-sm">
                F1
              </span>
              <span className="text-white text-sm sm:text-base font-medium tracking-wide">
                Welcome,{' '}
                <span className="font-bold">
                  {user?.username?.toUpperCase()}
                </span>
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <DarkModeToggle />
            </div>
          </div>
          
          {/* Bottom row with navigation buttons */}
          <div className="flex items-center space-x-2 pl-1 overflow-x-auto pb-2 pt-2">
          <button
                onClick={() => navigate('/home')}
                className="text-black hover:text-gray-700 px-2 py-1 text-sm whitespace-nowrap"
              >
                Home
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
              onClick={() => navigate('/profile')}
              className="text-black hover:text-gray-700 px-2 py-1 text-sm whitespace-nowrap"
            >
              My Profile
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