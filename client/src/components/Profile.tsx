import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-red-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="text-white text-2xl font-bold hover:text-gray-200"
              >
                F1 Fan Hub
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center">
              <div className="h-24 w-24 rounded-full bg-red-600 text-white text-3xl font-bold flex items-center justify-center mx-auto mb-4">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
              <p className="text-gray-500 mt-1">F1 Fan</p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="text-gray-900">{user.username}</p>
                </div>
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-gray-900">2024</p>
                </div>
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500">Favorite Team</p>
                  <p className="text-gray-900">Not Set</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 