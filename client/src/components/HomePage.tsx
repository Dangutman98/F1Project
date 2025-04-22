import { useState, useEffect } from 'react';
import Slider from 'react-slick';

// Import images
const ferrariImg = new URL('../assets/car-imgs/ferrari-sf24-past-model-fullimg-d.jpg', import.meta.url).href;
const redbullImg = new URL('../assets/car-imgs/oracle-red-bull-racing-rb20-launch-2024.jpg', import.meta.url).href;
const mercedesImg = new URL('../assets/car-imgs/Mercedes-AMG W15 E PERFORMANCE - Lewis Hamilton - Front Quarter.jpg', import.meta.url).href;
const mclarenImg = new URL('../assets/car-imgs/car-reveal-2024-article-cover-square.jpg', import.meta.url).href;

export default function HomePage() {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [isHovered, setIsHovered] = useState<number | null>(null);

  const latestNews = [
    {
      title: "2025 F1 Calendar Revealed",
      content: "Record-breaking 24-race calendar confirmed for 2025 season, including new night races",
      date: "April 2024"
    },
    {
      title: "Mercedes Unveils Revolutionary Design",
      content: "Team reveals groundbreaking 'zero-sidepod' concept for upcoming season",
      date: "April 2024"
    },
    {
      title: "Sprint Race Format Changes",
      content: "F1 announces new points system and qualifying format for sprint weekends",
      date: "March 2024"
    },
    {
      title: "Sustainable Fuel Implementation",
      content: "F1 moves closer to carbon neutrality goals with new fuel regulations",
      date: "March 2024"
    },
    {
      title: "New Team Entry Confirmed",
      content: "FIA approves Andretti-Cadillac bid to join Formula 1 grid in 2026",
      date: "March 2024"
    },
    {
      title: "Safety Innovations Announced",
      content: "Next-generation crash structures and halo updates coming for 2025",
      date: "March 2024"
    },
    {
      title: "Las Vegas GP Success",
      content: "Record-breaking attendance and viewership numbers from inaugural night race",
      date: "March 2024"
    },
    {
      title: "Driver Market Shake-up",
      content: "Multiple teams announce driver lineup changes for upcoming season",
      date: "March 2024"
    }
  ];

  const teamUpdates = [
    {
      team: "Mercedes",
      update: "Revolutionary sidepod design for 2025",
      status: "Development"
    },
    {
      team: "Red Bull Racing",
      update: "New power unit partnership announced",
      status: "Confirmed"
    },
    {
      team: "Ferrari",
      update: "Advanced hybrid system testing",
      status: "Testing"
    }
  ];

  const carouselItems = [
    {
      image: ferrariImg,
      title: "Ferrari SF-24 Launch",
      description: "Witness the unveiling of Ferrari's latest challenger for the 2024 season"
    },
    {
      image: redbullImg,
      title: "Red Bull RB20 Reveal",
      description: "Red Bull Racing showcases their innovative RB20 for the 2024 championship"
    },
    {
      image: mercedesImg,
      title: "Mercedes W15 Launch",
      description: "Mercedes-AMG unveils the W15, their hope for reclaiming the championship"
    },
    {
      image: mclarenImg,
      title: "McLaren MCL38",
      description: "McLaren continues their resurgence with the striking MCL38"
    }
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % latestNews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Content Container */}
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900 overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Formula 1 Fan Hub
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-8">
                Your ultimate destination for F1 news, stats, and community.
              </p>

              {/* Carousel Section */}
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6">F1 Highlights</h2>
                <div className="carousel-container">
                  <Slider {...sliderSettings}>
                    {carouselItems.map((item, index) => (
                      <div key={index} className="px-2">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-48 sm:h-64 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">{item.title}</h3>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>

              {/* Latest News Section */}
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">Latest News</h2>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg shadow-md">
                  <div className="transition-all duration-500 ease-in-out">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                      {latestNews[currentNewsIndex].title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
                      {latestNews[currentNewsIndex].content}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {latestNews[currentNewsIndex].date}
                    </p>
                  </div>
                  <div className="flex justify-center mt-4 space-x-2">
                    {latestNews.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                          currentNewsIndex === index 
                            ? 'bg-gray-600 dark:bg-white w-4' 
                            : 'bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500'
                        }`}
                        onClick={() => setCurrentNewsIndex(index)}
                        aria-label={`Go to news item ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Team Updates Section */}
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">Team Updates</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamUpdates.map((update, index) => (
                    <div
                      key={index}
                      className={`bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg shadow-md transition-all duration-300 ${
                        isHovered === index ? 'transform scale-105' : ''
                      }`}
                      onMouseEnter={() => setIsHovered(index)}
                      onMouseLeave={() => setIsHovered(null)}
                    >
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
                        {update.team}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mt-2">
                        {update.update}
                      </p>
                      <span className={`inline-block mt-2 px-2 py-1 rounded text-xs sm:text-sm font-medium ${
                        update.status === 'Confirmed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          : update.status === 'Development' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                      }`}>
                        {update.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* About Section */}
              <div className="border-t dark:border-gray-700 pt-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">About F1 Fan Hub</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-center text-base sm:text-lg">
                      F1 Fan Hub is your comprehensive platform for everything Formula 1. 
                      <span className="block mt-4">
                        We provide detailed information about teams, drivers, upcoming events, and iconic racing spots around the world.
                      </span>
                      <span className="block mt-4 font-medium text-red-600 dark:text-red-400">
                        Create your profile, choose your favorite team and driver, and join our passionate community of racing fans.
                      </span>
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">F1 Fan Hub Features</h3>
                    <ul className="space-y-4">
                      <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                        <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-base sm:text-lg">Real-time Race Weather Updates</span>
                      </li>
                      <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                        <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-base sm:text-lg">Live Race Statistics</span>
                      </li>
                      <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                        <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-base sm:text-lg">Interactive Track Maps</span>
                      </li>
                      <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                        <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-base sm:text-lg">Community Discussion Forums</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 