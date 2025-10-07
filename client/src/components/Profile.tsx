import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

// Import team logos
import alfaRomeoLogo from '../assets/TeamsIcons/alfa romeo.png';
import alphaTauriLogo from '../assets/TeamsIcons/alpha tauri.jpg';
import alpineLogo from '../assets/TeamsIcons/alpine-DZMZVEL_.jpg';
import astonMartinLogo from '../assets/TeamsIcons/Aston-Martin.jpg';
import ferrariLogo from '../assets/TeamsIcons/ferrari-nin9UOPe.jpg';
import haasLogo from '../assets/TeamsIcons/haas.jpg';
import mcLarenLogo from '../assets/TeamsIcons/mclaren.jpg';
import mercedesLogo from '../assets/TeamsIcons/Mercedes.jpg';
import redBullLogo from '../assets/TeamsIcons/red bull-zr1Qozou.jpg';
import williamsLogo from '../assets/TeamsIcons/williams.jpg';

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
        
        // Always fetch photo from our endpoint
        const photoResponse = await fetch(`${API_BASE_URL}/user/${user.id}/profile-photo`);
        if (photoResponse.ok) {
          const photoData = await photoResponse.json();
          setProfilePhoto(photoData.profilePhoto || '');
        } else {
          console.error('Failed to fetch profile photo:', await photoResponse.text());
          setProfilePhoto('');
        }

        // Fetch favorites
        const favoritesResponse = await fetch(`${API_BASE_URL}/user/${user.id}/favorites`);
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
      const response = await fetch(`${API_BASE_URL}/user/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 pb-4">
        {/* Hero Section */}
        <div className="bg-red-600 profile-hero">
          <div className="max-w-7xl mx-auto py-3 px-4">
            <div className="text-center">
              <div className="flex flex-col items-center mb-2">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2">
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
                      <span className="text-gray-500 text-sm">No Photo</span>
                    </div>
                  )}
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white">{user?.username.toUpperCase()}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="mt-2 px-4 mb-2">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="p-3 sm:p-4">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 text-center">Profile Information</h2>
                  <div className="space-y-2">
                    <div className="text-center">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Username</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{user?.username.toUpperCase()}</p>
                    </div>
                    <div className="text-center">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Favorite Animal</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        {user?.profile?.favoriteAnimal && (
                          <span className="inline-flex items-center justify-center">
                            <span className="text-lg sm:text-xl mr-1">{animalEmojis[user.profile.favoriteAnimal]}</span>
                            {user.profile.favoriteAnimal}
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white text-center">Favorite Drivers</h3>
                      {favoriteDrivers.length > 0 ? (
                        <div className="mt-1 space-y-2">
                          {favoriteDrivers.map((driver) => (
                            <div key={driver.driverId} className="flex items-center justify-center space-x-2">
                              <div className="flex-shrink-0">
                                <img
                                  src={driver.photoURL}
                                  alt={`driver-${driver.driverName}`}
                                  className="rounded-full object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://media.formula1.com/d_driver_fallback_image.png';
                                  }}
                                />
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{driver.driverName}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-300">{driver.teamName}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">No favorite drivers selected</p>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white text-center">Favorite Teams</h3>
                      {favoriteTeams.length > 0 ? (
                        <div className="mt-1 space-y-2">
                          {favoriteTeams.map((team) => (
                            <div key={team.teamId} className="flex items-center justify-center space-x-2">
                              <img
                                src={teamLogos[team.teamName]}
                                alt={team.teamName}
                                className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                              />
                              <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{team.teamName}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">No favorite teams selected</p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 text-center">Additional Information</h2>
                  <div className="space-y-2">
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white text-center">Favorite Racing Spots</h3>
                      {favoriteSpots.length > 0 ? (
                        <ul className="mt-1 space-y-1">
                          {favoriteSpots.map((spot, index) => (
                            <li key={`${spot}-${index}`} className="flex items-center justify-center space-x-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 sm:h-4 sm:w-4 text-red-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{spot}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">No favorite racing spots selected</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Inside profile card */}
                <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-row justify-between gap-2">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="w-1/2 bg-gray-100 hover:bg-gray-200 dark:bg-red-500 dark:hover:bg-red-600 text-red-600 dark:text-white py-2 px-3 rounded-md text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors border border-red-500 dark:border-transparent shadow-sm hover:shadow"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Account'}
                    </button>
                    <button
                      onClick={() => navigate('/edit-profile')}
                      className="w-1/2 bg-gray-100 hover:bg-gray-200 dark:bg-red-600 dark:hover:bg-red-700 text-gray-900 dark:text-white py-2 px-3 rounded-md text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors border border-gray-300 dark:border-transparent shadow-sm hover:shadow"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-2 mt-auto">
        <div className="text-center text-gray-400">
          <p className="text-xs">© 2024 F1 Fan Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 