import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HomePage() {
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
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
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 