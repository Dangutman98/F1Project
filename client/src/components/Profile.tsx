import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';

// Import team logos
import alfaRomeoLogo from '../assets/TeamsIcons/alfa romeo.png';
import alphaTauriLogo from '../assets/TeamsIcons/alpha tauri.jpg';
import alpineLogo from '../assets/TeamsIcons/alpine.avif';
import astonMartinLogo from '../assets/TeamsIcons/aston martin.avif';
import ferrariLogo from '../assets/TeamsIcons/ferrari.avif';
import haasLogo from '../assets/TeamsIcons/haas.avif';
import mcLarenLogo from '../assets/TeamsIcons/mclaren.avif';
import mercedesLogo from '../assets/TeamsIcons/mercedes.avif';
import redBullLogo from '../assets/TeamsIcons/red bull.avif';
import williamsLogo from '../assets/TeamsIcons/williams.avif';

interface FavoriteDriver {
  driverId: number;
  driverName: string;
  photoURL: string;
  teamId: number;
  acronymName: string;
  teamName: string;
  teamColor: string;
}

interface FavoriteTeam {
  teamId: number;
  teamName: string;
  color: string;
}

interface UserFavorites {
  drivers: FavoriteDriver[];
  teams: FavoriteTeam[];
  racingSpots: string[];
}

// Map team names to their logos
const teamLogos: { [key: string]: string } = {
  'Alfa Romeo': alfaRomeoLogo,
  'AlphaTauri': alphaTauriLogo,
  'Alpine': alpineLogo,
  'Aston Martin': astonMartinLogo,
  'Ferrari': ferrariLogo,
  'Haas F1 Team': haasLogo,
  'McLaren': mcLarenLogo,
  'Mercedes': mercedesLogo,
  'Red Bull Racing': redBullLogo,
  'Williams': williamsLogo
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile } = useUser();
  const [favoriteDrivers, setFavoriteDrivers] = useState<FavoriteDriver[]>([]);
  const [favoriteTeams, setFavoriteTeams] = useState<FavoriteTeam[]>([]);
  const [favoriteSpots, setFavoriteSpots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        console.log('No user ID available');
        return;
      }

      try {
        // Fetch user's profile photo
        const photoResponse = await fetch(`http://localhost:5066/api/user/${user.id}/profile-photo`);
        if (photoResponse.ok) {
          const photoData = await photoResponse.json();
          if (photoData.profilePhoto) {
            // Update the user context with the fetched photo
            updateProfile({
              ...user.profile,
              profilePhoto: photoData.profilePhoto
            });
          }
        }

        const favoritesResponse = await fetch(`http://localhost:5066/api/user/${user.id}/favorites`);
        if (!favoritesResponse.ok) {
          console.error('Failed to fetch favorites:', favoritesResponse.statusText);
          throw new Error('Failed to fetch data');
        }

        const favorites: UserFavorites = await favoritesResponse.json();

        if (favorites.drivers) {
          setFavoriteDrivers(favorites.drivers || []);
        }
        if (favorites.teams) {
          setFavoriteTeams(favorites.teams || []);
        }
        if (favorites.racingSpots) {
          setFavoriteSpots(favorites.racingSpots || []);
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
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
                    src={user.profile.profilePhoto.startsWith('data:image') ? 
                         user.profile.profilePhoto : 
                         `data:image/jpeg;base64,${user.profile.profilePhoto}`}
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
                      <h3 className="text-lg font-semibold text-gray-900">Favorite Drivers</h3>
                      {favoriteDrivers.length > 0 ? (
                        <div className="mt-1 space-y-4">
                          {favoriteDrivers.map((driver) => (
                            <div key={driver.driverId} className="flex items-center space-x-4">
                              <img
                                src={driver.photoURL}
                                alt={driver.driverName}
                                className="h-12 w-12 rounded-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://media.formula1.com/d_driver_fallback_image.png';
                                }}
                              />
                              <div>
                                <p className="font-semibold text-gray-900">{driver.driverName}</p>
                                <p className="text-sm text-gray-600">{driver.teamName}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-1 text-gray-600">No favorite drivers selected</p>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Favorite Teams</h3>
                      {favoriteTeams.length > 0 ? (
                        <div className="mt-1 space-y-4">
                          {favoriteTeams.map((team) => (
                            <div key={team.teamId} className="flex items-center space-x-4">
                              <img
                                src={teamLogos[team.teamName]}
                                alt={team.teamName}
                                className="h-12 w-12 object-contain"
                              />
                              <p className="font-semibold text-gray-900">{team.teamName}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-1 text-gray-600">No favorite teams selected</p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Favorite Racing Spots</h3>
                      {favoriteSpots.length > 0 ? (
                        <ul className="mt-2 space-y-2">
                          {favoriteSpots.map((spot, index) => (
                            <li key={`${spot}-${index}`} className="flex items-center space-x-2">
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
                        <p className="mt-1 text-gray-600">No favorite racing spots selected</p>
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