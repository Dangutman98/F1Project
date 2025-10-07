import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

// Import event images
const eventImages: { [key: string]: string } = {
  'Bahrain': '/cgroup79/test2/tar2/client/assets/events-pics/Bahrain.jpg',
  'Saudi Arabian': '/cgroup79/test2/tar2/client/assets/events-pics/Saudi_Arabia.jpg',
  'Australian': '/cgroup79/test2/tar2/client/assets/events-pics/Australia.jpg',
  'Japanese': '/cgroup79/test2/tar2/client/assets/events-pics/Japan.jpg',
  'Chinese': '/cgroup79/test2/tar2/client/assets/events-pics/Chinese.jpg',
  'Miami': '/cgroup79/test2/tar2/client/assets/events-pics/Miami.jpg',
  'Emilia Romagna': '/cgroup79/test2/tar2/client/assets/events-pics/Emilia_Romagna.jpg',
  'Monaco': '/cgroup79/test2/tar2/client/assets/events-pics/Monaco.jpg',
  'Canadian': '/cgroup79/test2/tar2/client/assets/events-pics/Canadian.jpg',
  'Spanish': '/cgroup79/test2/tar2/client/assets/events-pics/Spain.jpg',
  'Austrian': '/cgroup79/test2/tar2/client/assets/events-pics/Austria.jpg',
  'British': '/cgroup79/test2/tar2/client/assets/events-pics/British.jpg',
  'Hungarian': '/cgroup79/test2/tar2/client/assets/events-pics/Hungary.jpg',
  'Belgian': '/cgroup79/test2/tar2/client/assets/events-pics/Belgian.jpg',
  'Dutch': '/cgroup79/test2/tar2/client/assets/events-pics/Dutch.jpg',
  'Italian': '/cgroup79/test2/tar2/client/assets/events-pics/Italy.jpg',
  'Azerbaijan': '/cgroup79/test2/tar2/client/assets/events-pics/Azerbaijan.jpg',
  'Singapore': '/cgroup79/test2/tar2/client/assets/events-pics/Singapore.jpg',
  'United States': '/cgroup79/test2/tar2/client/assets/events-pics/USA.jpg',
  'Mexico City': '/cgroup79/test2/tar2/client/assets/events-pics/Mexico.jpg',
  'São Paulo': '/cgroup79/test2/tar2/client/assets/events-pics/Brazil.jpg',
  'Las Vegas': '/cgroup79/test2/tar2/client/assets/events-pics/Las_Vegas.jpg',
  'Qatar': '/cgroup79/test2/tar2/client/assets/events-pics/Qatar.jpg',
  'Abu Dhabi': '/cgroup79/test2/tar2/client/assets/events-pics/Abu_Dhabi.jpg'
};

interface Event {
  id: number;
  raceName: string;
  raceDate: string;
  location: string;
}

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((index) => (
      <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-200"></div>
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/Event`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getEventImage = (raceName: string): string => {
    // Extract the base name without "Grand Prix" for matching
    const baseName = raceName.replace(' Grand Prix', '').trim();
    
    // First try direct match
    if (eventImages[baseName]) {
      return eventImages[baseName];
    }
    
    // If no direct match, try partial match once
    for (const [key, value] of Object.entries(eventImages)) {
      if (baseName.includes(key) || key.includes(baseName)) {
        return value;
      }
    }
    
    // If no match found, return placeholder
    return 'https://via.placeholder.com/400x225?text=Circuit+Image+Not+Available';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">F1 Past Race Events</h1>
            <LoadingSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Content Container */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">F1 Past Race Events</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={getEventImage(event.raceName)}
                        alt={`${event.raceName} circuit`}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/400x225?text=Circuit+Image+Not+Available';
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {event.raceName}
                      </h2>
                      <div className="space-y-2 text-gray-600">
                        <p>
                          <span className="font-medium">Location:</span> {event.location}
                        </p>
                        <p>
                          <span className="font-medium">Date:</span>{' '}
                          {new Date(event.raceDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
