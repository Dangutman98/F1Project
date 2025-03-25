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

interface Team {
  id: number;
  name: string;
  color: string;
}

interface Driver {
  id: number;
  name: string;
  photoURL: string;
  teamId: string;
  acronymName: string;
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

const LoadingSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3, 4, 5].map((index) => (
      <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 animate-pulse bg-gray-200">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-300 rounded w-48"></div>
            <div className="h-8 bg-gray-300 rounded w-8"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function TeamsAndDrivers() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [teams, setTeams] = useState<Team[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteDrivers, setFavoriteDrivers] = useState<number[]>([]);
  const [favoriteTeam, setFavoriteTeam] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchWithRetry = async (url: string, retries = 3): Promise<any> => {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch from ${url}`);
          return await response.json();
        } catch (err) {
          if (i === retries - 1) throw err;
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    };

    const fetchData = async () => {
      if (!user?.id) {
        console.log('No user ID available in TeamsAndDrivers');
        return;
      }
      
      try {
        setLoading(true);
        console.log('Starting to fetch data in TeamsAndDrivers');
        
        // Fetch teams, drivers, and favorites in parallel
        console.log('Fetching teams...');
        const teamsData = await fetchWithRetry('http://localhost:5066/api/Team');
        console.log('Teams data received:', teamsData?.length || 0, 'teams');
        
        console.log('Fetching drivers...');
        const driversData = await fetchWithRetry('http://localhost:5066/api/Driver/fetch');
        console.log('Drivers data received:', driversData?.length || 0, 'drivers');
        
        console.log('Fetching favorites...');
        const favoritesData = await fetchWithRetry(`http://localhost:5066/api/user/${user.id}/favorites`);
        console.log('Favorites data received:', JSON.stringify(favoritesData, null, 2));

        if (teamsData) {
          console.log('Setting teams state');
          setTeams(teamsData);
        }
        
        if (driversData) {
          console.log('Setting drivers state');
          setDrivers(driversData);
        }
        
        // Update favorite states from the API response
        if (favoritesData && favoritesData.drivers) {
          console.log('Setting favorite drivers state');
          const favoriteDriverIds = favoritesData.drivers.map((d: { driverId: number }) => d.driverId);
          setFavoriteDrivers(favoriteDriverIds);
        }
        
        if (favoritesData && favoritesData.teams && favoritesData.teams.length > 0) {
          console.log('Setting favorite team state');
          const favoriteTeamId = favoritesData.teams[0].teamId;
          setFavoriteTeam(favoriteTeamId);
        } else {
          console.log('No favorite team found');
          setFavoriteTeam(null);
        }
      } catch (err) {
        console.error('Error in TeamsAndDrivers fetchData:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        console.log('Setting loading to false in TeamsAndDrivers');
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const toggleFavoriteDriver = async (driverId: number) => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5066/api/user/${user.id}/favorite/driver/${driverId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFavoriteDrivers(data.favoriteDrivers || []);
        
        // Set appropriate message based on the action
        const isAdding = data.favoriteDrivers.includes(driverId);
        if (isAdding) {
          if (data.favoriteDrivers.length === 2) {
            setMessage('Maximum of two favorite drivers selected!');
          } else {
            setMessage('Driver added to favorites!');
          }
        } else {
          setMessage('Driver removed from favorites!');
        }
        
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error toggling favorite driver:', error);
      setMessage('Error updating favorite driver');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const toggleFavoriteTeam = async (teamId: number) => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5066/api/user/${user.id}/favorite/team/${teamId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const newFavoriteTeam = data.favoriteTeams[0] || null;
        setFavoriteTeam(newFavoriteTeam);
        
        // Set message based on whether team was added or removed
        setMessage(newFavoriteTeam === teamId ? 'Team added to favorites!' : 'Team removed from favorites!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error toggling favorite team:', error);
      setMessage('Error updating favorite team');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleTeamClick = (teamId: number) => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center space-y-4">
        <div className="text-2xl text-red-600">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
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
              <button
                onClick={() => navigate('/profile')}
                className="text-black hover:text-gray-800"
              >
                Profile
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">F1 Teams & Drivers</h1>
          
          {message && (
            <div className={`mb-4 p-4 rounded-md ${
              message.includes('Error') 
                ? 'bg-red-100 text-red-700'
                : message.includes('Maximum') 
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}

          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="space-y-6">
              {teams.map(team => (
                <div 
                  key={team.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300"
                >
                  <div 
                    className="p-8 cursor-pointer transition-colors hover:opacity-90"
                    onClick={() => handleTeamClick(team.id)}
                    style={{ 
                      backgroundColor: team.color,
                      color: ['#000000', '#1E1E1E', '#2B4562', '#2D826D'].includes(team.color) ? '#FFFFFF' : '#000000'
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <h2 className="text-2xl font-bold">{team.name}</h2>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavoriteTeam(team.id);
                          }}
                          className="p-1 rounded-full hover:bg-white/10 transition-colors"
                          title={favoriteTeam === team.id ? "Remove from favorites" : "Add to favorites"}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 ${
                              favoriteTeam === team.id
                                ? 'text-red-500 fill-current'
                                : 'text-gray-400 stroke-current'
                            }`}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            fill="none"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center space-x-4">
                        <img 
                          src={teamLogos[team.name]} 
                          alt={`${team.name} logo`}
                          className="w-20 h-20 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        <span className="text-2xl">
                          {expandedTeam === team.id ? '−' : '+'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {expandedTeam === team.id && (
                    <div className="mt-4 space-y-4">
                      {drivers
                        .filter(driver => driver.teamId === team.name)
                        .map(driver => (
                          <div 
                            key={driver.id} 
                            className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm"
                          >
                            <img
                              src={driver.photoURL}
                              alt={driver.name}
                              className="w-24 h-24 object-cover rounded-full"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://media.formula1.com/d_driver_fallback_image.png';
                              }}
                            />
                            <div className="flex-grow">
                              <h3 className="text-xl font-semibold text-gray-900">{driver.name}</h3>
                              <p className="text-gray-600">{driver.acronymName}</p>
                            </div>
                            <button
                              onClick={() => toggleFavoriteDriver(driver.id)}
                              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                              title={favoriteDrivers.includes(driver.id) ? "Remove from favorites" : "Add to favorites"}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-6 w-6 ${
                                  favoriteDrivers.includes(driver.id)
                                    ? 'text-red-500 fill-current'
                                    : 'text-gray-400 stroke-current'
                                }`}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                fill="none"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 