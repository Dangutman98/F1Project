import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';

interface Driver {
  id: number;
  name: string;
  photoURL: string;
  teamId: number;
  acronymName: string;
  teamName: string;
  teamColor: string;
}

interface Team {
  id: number;
  name: string;
  color: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [favoriteDriver, setFavoriteDriver] = useState<Driver | null>(null);
  const [favoriteTeam, setFavoriteTeam] = useState<Team | null>(null);
  const [favoriteSpots, setFavoriteSpots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        const [driversResponse, teamsResponse, spotsResponse] = await Promise.all([
          fetch('http://localhost:5066/api/Driver/fetch'),
          fetch('http://localhost:5066/api/Team'),
          fetch(`http://localhost:5066/api/event/favorite/all/${user.id}`)
        ]);

        if (!driversResponse.ok || !teamsResponse.ok || !spotsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const drivers = await driversResponse.json();
        const teams = await teamsResponse.json();
        const spots = await spotsResponse.json();

        const selectedDriver = drivers.find((d: Driver) => d.id === parseInt(user.profile?.favoriteDriver ?? ''));
        const selectedTeam = teams.find((t: Team) => t.id === parseInt(user.profile?.favoriteTeam ?? ''));

        setFavoriteDriver(selectedDriver || null);
        setFavoriteTeam(selectedTeam || null);
        setFavoriteSpots(spots);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/home')}
                className="text-black text-2xl font-bold hover:text-gray-800"
              >
                Return to Home Page
              </button>
            </div>
            <nav className="flex items-center space-x-4">
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-red-600">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-block">
                {user.profile?.profilePhoto ? (
                  <img
                    src={user.profile.profilePhoto}
                    alt="Profile"
                    className="h-32 w-32 rounded-full mx-auto mb-6 object-cover border-4 border-white"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-white text-gray-400 flex items-center justify-center mx-auto mb-6 border-4 border-white">
                    <span className="text-2xl">No Photo</span>
                  </div>
                )}
              </div>
              <h1 className="text-4xl font-bold text-black mb-2">{user.username}</h1>
              <p className="text-xl text-black">F1 Fan</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="mt-8">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Username</h3>
                      <p className="mt-1 text-gray-600">{user.username}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Favorite Animal</h3>
                      <p className="mt-1 text-gray-600">{user.profile?.favoriteAnimal || 'Not Set'}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Favorite Driver</h3>
                      {isLoading ? (
                        <p className="mt-1 text-gray-600">Loading...</p>
                      ) : favoriteDriver ? (
                        <div className="mt-1 flex items-center space-x-3">
                          <img
                            src={favoriteDriver.photoURL}
                            alt={favoriteDriver.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-gray-600">{favoriteDriver.name}</p>
                            <p className="text-sm text-gray-500">{favoriteDriver.teamName}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 text-gray-600">Not Set</p>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Favorite Team</h3>
                      {isLoading ? (
                        <p className="mt-1 text-gray-600">Loading...</p>
                      ) : favoriteTeam ? (
                        <div className="mt-1 flex items-center space-x-3">
                          <div
                            className="h-12 w-12 rounded-full"
                            style={{ backgroundColor: favoriteTeam.color }}
                          />
                          <p className="text-gray-600">{favoriteTeam.name}</p>
                        </div>
                      ) : (
                        <p className="mt-1 text-gray-600">Not Set</p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Favorite Racing Spots</h3>
                      {isLoading ? (
                        <p className="mt-1 text-gray-600">Loading...</p>
                      ) : favoriteSpots.length > 0 ? (
                        <ul className="mt-2 space-y-2">
                          {favoriteSpots.map((spot, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-red-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-gray-600">{spot}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-1 text-gray-600">No favorite racing spots set</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => navigate('/edit-profile')}
                  className="bg-red-600 text-black py-3 px-8 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-lg font-semibold"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>© 2024 F1 Fan Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 