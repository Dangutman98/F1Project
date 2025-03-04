import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Home() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user.email}!</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Dashboard</h2>
          <p className="text-gray-600">
            This is your protected home page. You can only see this content when you're logged in.
          </p>
        </div>
      </div>
    </div>
  );
} 