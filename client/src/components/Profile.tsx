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

// Animal emoji mapping
const animalEmojis: { [key: string]: string } = {
  Dog: '🐶',
  Cat: '🐱',
  Lion: '🦁',
  Tiger: '🐯',
  Horse: '🐎',
  Fox: '🦊',
  Raccoon: '🦝',
  Panda: '🐼',
  Koala: '🐨',
  Cow: '🐮',
  Pig: '🐷',
  Frog: '🐸',
  Rabbit: '🐰',
  Giraffe: '🦒',
  Kangaroo: '🦘',
  Eagle: '🦅',
  Penguin: '🐧',
  Parrot: '🦜',
  Turtle: '🐢',
  Shark: '🦈'
};

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
  const { user, logout } = useUser();
  const [favoriteDrivers, setFavoriteDrivers] = useState<FavoriteDriver[]>([]);
  const [favoriteTeams, setFavoriteTeams] = useState<FavoriteTeam[]>([]);
  const [favoriteSpots, setFavoriteSpots] = useState<string[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check for user immediately
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        console.log('No user ID available, user:', user);
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching data for user ID:', user.id); // Add this for debugging
        
        // Always fetch photo from our endpoint
        const photoResponse = await fetch(`http://localhost:5066/api/user/${user.id}/profile-photo`);
        if (photoResponse.ok) {
          const photoData = await photoResponse.json();
          setProfilePhoto(photoData.profilePhoto || '');
        } else {
          console.error('Failed to fetch profile photo:', await photoResponse.text());
          setProfilePhoto('');
        }

        // Fetch favorites
        const favoritesResponse = await fetch(`http://localhost:5066/api/user/${user.id}/favorites`);
        if (!favoritesResponse.ok) {
          console.error('Failed to fetch favorites:', await favoritesResponse.text());
          throw new Error('Failed to fetch data');
        }

        const favorites: UserFavorites = await favoritesResponse.json();
        setFavoriteDrivers(favorites.drivers || []);
        setFavoriteTeams(favorites.teams || []);
        setFavoriteSpots(favorites.racingSpots || []);
      } catch (error) {
        console.error('Error in fetchData:', error);
        setProfilePhoto('');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:5066/api/user/${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        logout();
        navigate('/login');
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Early return if no user
  if (!user) {
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
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                  {isLoading ? (
                    <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                  ) : profilePhoto ? (
                    <img
                      src={profilePhoto.startsWith('http') ? profilePhoto : profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={() => {
                        setProfilePhoto('');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-lg font-medium">No Photo</span>
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.username.toUpperCase()}</h2>
              </div>
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
                      <p className="mt-1 text-gray-600">{user?.username.toUpperCase()}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Favorite Animal</h3>
                      <p className="mt-1 text-gray-600">
                        {user?.profile?.favoriteAnimal && (
                          <span className="inline-flex items-center">
                            <span className="text-2xl mr-2">{animalEmojis[user.profile.favoriteAnimal]}</span>
                            {user.profile.favoriteAnimal}
                          </span>
                        )}
                      </p>
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

              <div className="mt-8 flex justify-between">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="bg-red-500 text-black py-3 px-8 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-lg font-semibold"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </button>
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