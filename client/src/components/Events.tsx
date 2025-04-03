import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import event images
import bahrainImg from '../assets/events-pics/Bahrain.avif';
import saudiArabiaImg from '../assets/events-pics/Saudi_Arabia.avif';
import australiaImg from '../assets/events-pics/Australia.avif';
import japanImg from '../assets/events-pics/Japan.avif';
import chineseImg from '../assets/events-pics/Chinese.avif';
import miamiImg from '../assets/events-pics/Miami.jpg';
import emiliaRomagnaImg from '../assets/events-pics/Emilia Romagna.avif';
import monacoImg from '../assets/events-pics/Monaco.avif';
import canadianImg from '../assets/events-pics/Canadian.avif';
import spainImg from '../assets/events-pics/Spain.avif';
import austriaImg from '../assets/events-pics/Austria.avif';
import britishImg from '../assets/events-pics/British.avif';
import hungaryImg from '../assets/events-pics/Hungary.avif';
import belgianImg from '../assets/events-pics/Belgian.avif';
import dutchImg from '../assets/events-pics/Dutch.jpg';
import italyImg from '../assets/events-pics/Italy.avif';
import azerbaijanImg from '../assets/events-pics/Azerbaijan.jpg';
import singaporeImg from '../assets/events-pics/Singapore.avif';
import usaImg from '../assets/events-pics/USA.avif';
import mexicoImg from '../assets/events-pics/Mexico.avif';
import brazilImg from '../assets/events-pics/Brazil.avif';
import lasVegasImg from '../assets/events-pics/Las Vegas.avif';
import qatarImg from '../assets/events-pics/Qatar.avif';
import abuDhabiImg from '../assets/events-pics/Abu Dhabi.avif';

interface Event {
  id: number;
  raceName: string;
  raceDate: string;
  location: string;
}

// Map race names to their corresponding images
const eventImages: { [key: string]: any } = {
  'Bahrain': bahrainImg,
  'Saudi Arabian': saudiArabiaImg,
  'Australian': australiaImg,
  'Japanese': japanImg,
  'Chinese': chineseImg,
  'Miami': miamiImg,
  'Emilia Romagna': emiliaRomagnaImg,
  'Monaco': monacoImg,
  'Canadian': canadianImg,
  'Spanish': spainImg,
  'Austrian': austriaImg,
  'British': britishImg,
  'Hungarian': hungaryImg,
  'Belgian': belgianImg,
  'Dutch': dutchImg,
  'Italian': italyImg,
  'Azerbaijan': azerbaijanImg,
  'Singapore': singaporeImg,
  'United States': usaImg,
  'Mexico City': mexicoImg,
  'São Paulo': brazilImg,
  'Las Vegas': lasVegasImg,
  'Qatar': qatarImg,
  'Abu Dhabi': abuDhabiImg
};

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
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5066/api/Event');
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
    try {
      // Extract the base name without "Grand Prix" for matching
      const baseName = raceName.replace(' Grand Prix', '');
      console.log('Looking for image for:', baseName); // Debug log
      const image = eventImages[baseName];
      if (!image) {
        console.log('No direct match, trying alternative names...'); // Debug log
        // Try alternative names
        for (const [key, value] of Object.entries(eventImages)) {
          if (baseName.includes(key)) {
            console.log('Found match with:', key); // Debug log
            return value;
          }
        }
      }
      return image || 'https://via.placeholder.com/400x225?text=Circuit+Image+Not+Available';
    } catch (error) {
      console.error('Error getting event image:', error);
      return 'https://via.placeholder.com/400x225?text=Circuit+Image+Not+Available';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 events-section">
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
                  className="text-black text-xl font-bold hover:text-gray-800"
                >
                  Profile
                </button>
              </nav>
            </div>
          </div>
        </header>
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">F1 Race Events</h1>
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
    <div className="min-h-screen bg-gray-100 events-section">
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
                className="text-black text-xl font-bold hover:text-gray-800"
              >
                Profile
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">F1 Race Events</h1>
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
  );
}
