import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(null);

  const latestNews = [
    {
      title: "2025 F1 Calendar Revealed",
      content: "Record-breaking 24-race calendar confirmed for 2025 season",
      date: "April 2024"
    },
    {
      title: "Teams Prepare for New Regulations",
      content: "Major aerodynamic changes coming in 2025",
      date: "March 2024"
    },
    {
      title: "Sustainable Fuel Implementation",
      content: "F1 moves closer to carbon neutrality goals",
      date: "March 2024"
    }
  ];

  const teamUpdates = [
    {
      team: "Mercedes",
      update: "Revolutionary sidepod design for 2025",
      status: "Development"
    },
    {
      team: "Red Bull Racing",
      update: "New power unit partnership announced",
      status: "Confirmed"
    },
    {
      team: "Ferrari",
      update: "Advanced hybrid system testing",
      status: "Testing"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % latestNews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-red-600 shadow-lg w-full">
        <div className="w-full px-2 sm:px-4">
          <div className="flex flex-wrap justify-between items-center h-auto py-2">
            <div className="flex items-center shrink-0">
              <span className="text-black text-base sm:text-lg md:text-xl lg:text-2xl font-bold whitespace-nowrap">F1 </span>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <span className="text-black text-sm sm:text-base whitespace-nowrap welcome-message">
                Welcome, {user?.username?.toUpperCase()}
              </span>
              <button
                onClick={() => navigate('/profile')}
                className="text-black hover:text-gray-700 px-2 sm:px-3 py-2 text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
              >
                My Profile
              </button>
              <button
                onClick={() => navigate('/teams-and-drivers')}
                className="text-black hover:text-gray-700 px-2 sm:px-3 py-2 text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
              >
                Teams & Drivers
              </button>
              <button
                onClick={() => navigate('/events')}
                className="text-black hover:text-gray-700 px-2 sm:px-3 py-2 text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
              >
                Events
              </button>
              <button
                onClick={() => navigate('/racing-spots')}
                className="text-black hover:text-gray-700 px-2 sm:px-3 py-2 text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
              >
                Racing Spots
              </button>
              <button
                onClick={() => navigate('/standings')}
                className="text-black hover:text-gray-700 px-2 sm:px-3 py-2 text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
              >
                Standings
              </button>
              <button
                onClick={handleLogout}
                className="bg-white text-red-600 px-2 sm:px-3 py-2 rounded-md hover:bg-gray-100 text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900 overflow-hidden mb-8">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Formula 1 Fan Hub
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
              Your ultimate destination for F1 news, stats, and community.
            </p>
            <div className="border-t dark:border-gray-700 pt-8">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">About F1 Fan Hub</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-center text-lg">
                    F1 Fan Hub is your comprehensive platform for everything Formula 1. 
                    <span className="block mt-4">
                      We provide detailed information about teams, drivers, upcoming events, and iconic racing spots around the world.
                    </span>
                    <span className="block mt-4 font-medium text-red-600 dark:text-red-400">
                      Create your profile, choose your favorite team and driver, and join our passionate community of racing fans.
                    </span>
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Key Features</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                      <svg className="h-6 w-6 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-lg">Complete Teams & Drivers information</span>
                    </li>
                    <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                      <svg className="h-6 w-6 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-lg">Up-to-date F1 Event Calendar</span>
                    </li>
                    <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                      <svg className="h-6 w-6 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-lg">Detailed Racing Circuit Guides</span>
                    </li>
                    <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                      <svg className="h-6 w-6 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-lg">Personalized User Profiles</span>
                    </li>
                    <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                      <svg className="h-6 w-6 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-lg">Community Interaction</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Latest News - with sliding animation */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 overflow-hidden dark:shadow-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg className="w-6 h-6 text-red-600 dark:text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
              </svg>
              Latest News
            </h2>
            <div className="space-y-4">
              <motion.div
                key={currentNewsIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="border-b dark:border-gray-700 pb-4"
              >
                <h3 className="font-semibold text-lg dark:text-white">{latestNews[currentNewsIndex].title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{latestNews[currentNewsIndex].content}</p>
                <span className="text-sm text-red-600 dark:text-red-400">{latestNews[currentNewsIndex].date}</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Race Calendar - with hover effects */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 dark:shadow-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg className="w-6 h-6 text-red-600 dark:text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Next Races
            </h2>
            <div className="space-y-4">
              {["Miami Grand Prix", "Emilia Romagna GP", "Monaco Grand Prix"].map((race, index) => (
                <motion.div
                  key={race}
                  className="border-b dark:border-gray-700 pb-2 cursor-pointer"
                  whileHover={{ scale: 1.02, x: 10 }}
                  onHoverStart={() => setIsHovered(index)}
                  onHoverEnd={() => setIsHovered(null)}
                >
                  <h3 className="font-semibold dark:text-white">{race}</h3>
                  <p className={`text-gray-600 dark:text-gray-300 transition-colors duration-200 ${isHovered === index ? 'text-red-600 dark:text-red-400' : ''}`}>
                    Coming up next...
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team Updates - with progress indicators */}
          <motion.div 
            className="bg-white dark:!bg-gray-800 rounded-lg shadow-md p-6 dark:shadow-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:!text-white mb-4 flex items-center">
              <svg className="w-6 h-6 text-red-600 dark:!text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              2025 Team Updates
            </h2>
            <div className="space-y-4">
              {teamUpdates.map((update, index) => (
                <motion.div
                  key={update.team}
                  className="border-b dark:!border-gray-700 pb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <h3 className="font-semibold dark:!text-white">{update.team}</h3>
                  <p className="text-gray-600 dark:!text-gray-300">{update.update}</p>
                  <div className="flex items-center mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      update.status === 'Confirmed' 
                        ? 'bg-green-100 text-green-800 status-badge-confirmed' 
                        : update.status === 'Testing' 
                        ? 'bg-yellow-100 text-yellow-800 status-badge-testing'
                        : 'bg-blue-100 text-blue-800 status-badge-development'
                    }`}>
                      {update.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 