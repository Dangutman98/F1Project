import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RacingSpot, racingSpots as initialRacingSpots } from '../data/racingSpots';

export default function RacingSpots() {
  const navigate = useNavigate();
  const [racingSpots] = useState<RacingSpot[]>(initialRacingSpots);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'current' | 'upcoming' | 'former'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const filteredSpots = racingSpots.filter(spot => {
    if (selectedStatus !== 'all' && spot.status !== selectedStatus) return false;
    if (selectedRegion !== 'all' && spot.region !== selectedRegion) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/home')}
                className="text-black text-2xl font-bold hover:text-gray-700"
              >
                Return to Home Page
              </button>
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="text-black hover:text-gray-700"
              >
                Profile
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <div className="absolute top-0 right-0 m-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    spot.status === 'current' ? 'bg-green-100 text-green-800' :
                    spot.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {spot.status.charAt(0).toUpperCase() + spot.status.slice(1)}
                  </span>
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