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

  useEffect(() => {
    const fetchWithRetry = async (url: string, retries = 3): Promise<any> => {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch from ${url}`);
          return await response.json();
        } catch (err) {
          if (i === retries - 1) throw err;
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
        }
      }
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch teams and drivers in parallel
        const [teamsData, driversData] = await Promise.all([
          fetchWithRetry('http://localhost:5066/api/Team'),
          fetchWithRetry('http://localhost:5066/api/Driver/fetch')
        ]);

        setTeams(teamsData);
        setDrivers(driversData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!user) {
    navigate('/login');
    return null;
  }

  const getTeamDrivers = (teamName: string) => {
    return drivers.filter(driver => driver.teamId === teamName);
  };

  const handleTeamClick = (teamId: number) => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // This will trigger the useEffect hook to run again
    window.location.reload();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center space-y-4">
        <div className="text-2xl text-red-600">Error: {error}</div>
        <button
          onClick={handleRetry}
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
                      <h2 className="text-2xl font-bold">{team.name}</h2>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50">
                      {getTeamDrivers(team.name).map(driver => (
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
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{driver.name}</h3>
                            <p className="text-gray-600">{driver.acronymName}</p>
                          </div>
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