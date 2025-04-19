import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RacingSpot, racingSpots as initialRacingSpots } from '../data/racingSpots';
import { useUser } from '../context/UserContext';

export default function RacingSpots() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [racingSpots] = useState<RacingSpot[]>(initialRacingSpots);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'current' | 'upcoming' | 'former'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [favoriteSpots, setFavoriteSpots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteSpots = async () => {
      if (!user?.id) {
        console.log('No user ID available');
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/event/favorite/all/${user.id}`);
        
        
        if (response.ok) {
          const spots = await response.json();
          
          setFavoriteSpots(spots);
        } else {
          console.error('Failed to fetch favorite spots:', response.statusText);
          setFavoriteSpots([]);
        }
      } catch (error) {
        console.error('Error fetching favorite spots:', error);
        setFavoriteSpots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteSpots();
  }, [user?.id]);

  const toggleFavorite = async (spotName: string) => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/event/favorite/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(spotName)
      });

      if (response.ok) {
        setFavoriteSpots(prev => {
          const isCurrentlyFavorite = prev.includes(spotName);
          if (isCurrentlyFavorite) {
            return prev.filter(spot => spot !== spotName);
          } else {
            return [...prev, spotName];
          }
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const filteredSpots = racingSpots.filter(spot => {
    if (selectedStatus !== 'all' && spot.status !== selectedStatus) return false;
    if (selectedRegion !== 'all' && spot.region !== selectedRegion) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 racing-spots-section">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Formula 1 Racing Circuits</h1>
          <div className="flex space-x-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            >
              <option value="all">All Circuits</option>
              <option value="current">Current Circuits</option>
              <option value="upcoming">Upcoming Circuits</option>
              <option value="former">Former Circuits</option>
            </select>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            >
              <option value="all">All Regions</option>
              <option value="Europe">Europe</option>
              <option value="Americas">Americas</option>
              <option value="Asia & Middle East">Asia & Middle East</option>
              <option value="Oceania">Oceania</option>
              <option value="Africa">Africa</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpots.map((spot) => (
            <div
              key={spot.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 p-4 flex items-center justify-center bg-gray-50">
                <img
                  src={spot.imageUrl}
                  alt={spot.spotName}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x200?text=Circuit+Image';
                  }}
                />
                <div className="absolute top-0 right-0 m-2 flex space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    spot.status === 'current' ? 'bg-green-100 text-green-800' :
                    spot.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {spot.status.charAt(0).toUpperCase() + spot.status.slice(1)}
                  </span>
                  <button
                    onClick={() => toggleFavorite(spot.spotName)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 ${
                        favoriteSpots.includes(spot.spotName)
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
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {spot.spotName}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {spot.country}
                  </span>
                </div>
                <p className="text-gray-600">
                  {spot.description}
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  Region: {spot.region}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 