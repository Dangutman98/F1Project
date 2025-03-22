import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-red-600 shadow-lg w-full">
        <div className="w-full px-2 sm:px-4">
          <div className="flex flex-wrap justify-between items-center h-auto py-2">
            <div className="flex items-center shrink-0">
              <span className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold whitespace-nowrap">F1 Fan Hub</span>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <span className="text-black text-sm sm:text-base whitespace-nowrap">
                Welcome, {user?.username}
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
        <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-8">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Formula 1 Fan Hub
            </h1>
            <p className="text-gray-600 text-lg">
              Your ultimate destination for F1 news, stats, and community.
            </p>
          </div>
        </div>

        {/* Featured Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Latest News */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest News</h2>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-semibold">2024 Season Updates</h3>
                <p className="text-gray-600">Latest updates from the paddock...</p>
              </div>
              <div className="border-b pb-2">
                <h3 className="font-semibold">Driver Standings</h3>
                <p className="text-gray-600">Current championship rankings...</p>
              </div>
            </div>
          </div>

          {/* Race Calendar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Race Calendar</h2>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-semibold">Next Race</h3>
                <p className="text-gray-600">Upcoming Grand Prix details...</p>
              </div>
              <div className="border-b pb-2">
                <h3 className="font-semibold">Recent Results</h3>
                <p className="text-gray-600">Latest race outcomes...</p>
              </div>
            </div>
          </div>

          {/* Team Updates */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Updates</h2>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-semibold">Constructor Standings</h3>
                <p className="text-gray-600">Current team rankings...</p>
              </div>
              <div className="border-b pb-2">
                <h3 className="font-semibold">Technical Updates</h3>
                <p className="text-gray-600">Latest car developments...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 