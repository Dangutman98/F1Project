import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {RacingSpot, racingSpots as initialRacingSpots} from '../data/racingSpots';

// Circuit to city mapping for weather data
const circuitToCity: { [key: string]: string } = {
  // Current Circuits
  "Silverstone Circuit": "Silverstone,GB",
  "Circuit de Spa-Francorchamps": "Spa,BE",
  "Hungaroring": "Mogyorod,HU",
  "Circuit Zandvoort": "Zandvoort,NL",
  "Autodromo Nazionale Monza": "Monza,IT",
  "Imola Circuit": "Imola,IT",
  "Circuit de Barcelona-Catalunya": "Montmelo,ES",
  "Red Bull Ring": "Spielberg,AT",
  "Baku City Circuit": "Baku,AZ",
  "Circuit of the Americas": "Austin,US",
  "Miami International Autodrome": "Miami Gardens,US",
  "Las Vegas Strip Circuit": "Las Vegas,US",
  "Autódromo Hermanos Rodríguez": "Mexico City,MX",
  "Interlagos": "Sao Paulo,BR",
  "Circuit Gilles Villeneuve": "Montreal,CA",
  "Shanghai International Circuit": "Shanghai,CN",
  "Suzuka International Racing Course": "Suzuka,JP",
  "Marina Bay Street Circuit": "Singapore,SG",
  "Albert Park Circuit": "Melbourne,AU",
  "Yas Marina Circuit": "Abu Dhabi,AE",
  "Jeddah Corniche Circuit": "Jeddah,SA",
  "Bahrain International Circuit": "Manama,BH",
  "Losail International Circuit": "Doha,QA",
  
  // Former Circuits
  "Brands Hatch": "West Kingsdown,GB",
  "Donington Park": "Castle Donington,GB",
  "Nürburgring": "Nurburg,DE",
  "Hockenheimring": "Hockenheim,DE",
  "Paul Ricard Circuit": "Le Castellet,FR",
  "Magny-Cours": "Magny-Cours,FR",
  "Valencia Street Circuit": "Valencia,ES",
  "Estoril Circuit": "Estoril,PT",
  "Jarama Circuit": "Madrid,ES",
  "Pescara Circuit": "Pescara,IT",
  "Indianapolis Motor Speedway": "Indianapolis,US",
  "Long Beach Street Circuit": "Long Beach,US",
  "Detroit Street Circuit": "Detroit,US",
  "Phoenix Street Circuit": "Phoenix,US",
  "Watkins Glen International": "Watkins Glen,US",
  "Caesar's Palace Circuit": "Las Vegas,US",
  "Autódromo Juan y Oscar Gálvez": "Buenos Aires,AR",
  "Sepang International Circuit": "Sepang,MY",
  "Korea International Circuit": "Mokpo,KR",
  "Buddh International Circuit": "Greater Noida,IN",
  "Kyalami Circuit": "Midrand,ZA"
};

// Default cities for countries when circuit mapping is not found
const defaultCities: { [key: string]: string } = {
  "UK": "London,GB",
  "Belgium": "Brussels,BE",
  "Hungary": "Budapest,HU",
  "Netherlands": "Amsterdam,NL",
  "Italy": "Rome,IT",
  "Spain": "Madrid,ES",
  "Austria": "Vienna,AT",
  "Azerbaijan": "Baku,AZ",
  "USA": "Washington,US",
  "Mexico": "Mexico City,MX",
  "Brazil": "Brasilia,BR",
  "Canada": "Ottawa,CA",
  "China": "Beijing,CN",
  "Japan": "Tokyo,JP",
  "Singapore": "Singapore,SG",
  "Australia": "Canberra,AU",
  "UAE": "Abu Dhabi,AE",
  "Saudi Arabia": "Riyadh,SA",
  "Bahrain": "Manama,BH",
  "Qatar": "Doha,QA",
  "Germany": "Berlin,DE",
  "France": "Paris,FR",
  "Portugal": "Lisbon,PT",
  "Argentina": "Buenos Aires,AR",
  "Malaysia": "Kuala Lumpur,MY",
  "South Korea": "Seoul,KR",
  "India": "New Delhi,IN",
  "South Africa": "Pretoria,ZA"
};

//interfaces
interface WeatherData {
  temp: number;          // Temperature in Celsius
  description: string;   // Weather description (e.g., "cloudy", "clear sky")
  humidity: number;      // Humidity percentage
  icon: string;         // Weather icon code from API
  date: string;         // Current date for the weather data
}

// Combined interface that merges racing spot info with its weather
interface RaceWithWeather {
  spotName: string;     // Name of the racing circuit
  country: string;      // Country where the circuit is located
  weather: WeatherData | null;  // Weather data (null if fetch fails)
  status: 'current' | 'upcoming' | 'former';  // Circuit status from your existing data
}

//components

const RaceWeather= () => {
  //navigation hook for routing
  const navigate = useNavigate();

  //state for racing data from my existing data
  const [racingSpots] = useState<RacingSpot[]>(initialRacingSpots);

  //state for weather data
  const [weatherData,setWeatherData] = useState<RaceWithWeather[]>([]);

  //loading state
  const [isLoading, setIsLoading] = useState(true);

  //error state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (racingSpots.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        const weatherPromises = racingSpots.map(async (spot) => {
          try {
            const cityQuery = circuitToCity[spot.spotName] || defaultCities[spot.country] || null;
            
            if (!cityQuery) {
              throw new Error('No city mapping found');
            }
            
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityQuery)}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`
            );
            
            if (!response.ok) {
              throw new Error(`Weather API error: ${response.status}`);
            }
            
            const data = await response.json();
            return {
              spotName: spot.spotName,
              country: spot.country,
              status: spot.status,
              weather: {
                temp: data.main.temp,
                description: data.weather[0].description,
                humidity: data.main.humidity,
                icon: data.weather[0].icon,
                date: new Date().toLocaleDateString()
              }
            };
          } catch (error) {
            return {
              spotName: spot.spotName,
              country: spot.country,
              status: spot.status,
              weather: null
            };
          }
        });

        const results = await Promise.all(weatherPromises);
        setWeatherData(results);
      } catch (err) {
        setError('Failed to fetch weather data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, [racingSpots]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-red-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/home')}
                className="text-black dark:text-white text-2xl font-bold hover:text-gray-700 dark:hover:text-gray-300"
              >
                Return to Home Page
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Race Weather Forecast</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weatherData.map((race) => (
            <div key={race.spotName} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden relative">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">{race.spotName}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">{race.country}</p>
                
                {race.weather ? (
                  <div className="space-y-4 flex flex-col items-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-24 h-24 flex items-center justify-center">
                        <img 
                          src={`https://openweathermap.org/img/w/${race.weather.icon}.png`}
                          alt={race.weather.description}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-4xl font-bold mt-2 text-gray-900 dark:text-white">{Math.round(race.weather.temp)}°C</p>
                      <p className="capitalize text-lg text-gray-600 dark:text-gray-400 mt-1">{race.weather.description}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-400">Humidity: {race.weather.humidity}%</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Updated: {race.weather.date}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center">Weather data unavailable</p>
                )}
              </div>
              <div className="racing-spots-section bg-white dark:bg-gray-800 p-4 flex justify-center">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  race.status === 'current' ? 'bg-green-100' :
                  race.status === 'upcoming' ? 'bg-blue-100' :
                  'bg-gray-100'
                }`}>
                  {race.status.charAt(0).toUpperCase() + race.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RaceWeather;