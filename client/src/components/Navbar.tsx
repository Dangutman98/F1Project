import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import DarkModeToggle from './DarkModeToggle';
import { darkModeService } from '../services/darkModeService';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    // Reset dark mode to light mode
    document.body.classList.remove('dark-mode');
    await darkModeService.saveDarkModePreference(false);
    
    // Perform logout
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', path: '/home' },
    { label: 'Teams & Drivers', path: '/teams-and-drivers' },
    { label: 'Events', path: '/events' },
    { label: 'Racing Spots', path: '/racing-spots' },
    { label: 'Race Weather', path: '/race-weather' },
    { label: 'Standings', path: '/standings' },
    { label: 'My Profile', path: '/profile' },
  ];

  return (
    <nav className="bg-red-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto relative">
        {/* Top row with logo, welcome message, and hamburger */}
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-black text-xl font-black bg-white px-2 py-1 rounded-md shadow-sm">
              F1
            </span>
            <span className="text-white text-sm font-medium hidden sm:inline">
              Welcome,{' '}
              <span className="font-bold">
                {user?.username?.toUpperCase()}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <DarkModeToggle />
            {/* Hamburger button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-black hover:text-gray-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation items */}
        <div 
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } lg:block lg:static fixed top-[56px] left-0 right-0 max-h-[calc(100vh-56px)] overflow-y-auto lg:bg-transparent lg:max-h-none lg:overflow-visible z-50`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-2 p-4 lg:justify-start max-w-[280px] mx-auto lg:max-w-none">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
                className="text-black hover:text-gray-700 px-3 py-2 text-sm whitespace-nowrap bg-white rounded-full hover:bg-gray-100 transition-colors w-full lg:w-auto text-center"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="text-red-600 hover:text-red-700 px-3 py-2 text-sm whitespace-nowrap bg-white rounded-full hover:bg-gray-100 transition-colors w-full lg:w-auto text-center mb-4 lg:mb-0"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 