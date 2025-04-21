import { useState, useEffect } from 'react';
import Slider from 'react-slick';

// Import images
import ferrariImg from '../assets/car-imgs/ferrari-sf24-past-model-fullimg-d.avif';
import redbullImg from '../assets/car-imgs/oracle-red-bull-racing-rb20-launch-2024.avif';
import mercedesImg from '../assets/car-imgs/Mercedes-AMG W15 E PERFORMANCE - Lewis Hamilton - Front Quarter.avif';
import mclarenImg from '../assets/car-imgs/car-reveal-2024-article-cover-square.jpg';

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900 overflow-hidden mb-8">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Formula 1 Fan Hub
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
              Your ultimate destination for F1 news, stats, and community.
            </p>

            {/* Carousel Section */}
            <div className="carousel-container">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">F1 Highlights</h2>
              <Slider {...sliderSettings}>
                {carouselItems.map((item, index) => (
                  <div key={index} className="carousel-slide">
                    <div className="carousel-card">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="carousel-image"
                      />
                      <div className="carousel-content">
                        <h3 className="carousel-title">{item.title}</h3>
                        <p className="carousel-description">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>

            {/* Latest News Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Latest News</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <div className="transition-all duration-500 ease-in-out">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {latestNews[currentNewsIndex].title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {latestNews[currentNewsIndex].content}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {latestNews[currentNewsIndex].date}
                  </p>
                </div>
                <div className="flex justify-center mt-4 space-x-2 news-indicators">
                  {latestNews.map((_, index) => (
                    <button
                      key={index}
                      className={currentNewsIndex === index ? 'active' : ''}
                      onClick={() => setCurrentNewsIndex(index)}
                      aria-label={`Go to news item ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Team Updates Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Team Updates</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {teamUpdates.map((update, index) => (
                  <div
                    key={index}
                    className={`bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md transition-all duration-300 ${
                      isHovered === index ? 'transform scale-105' : ''
                    }`}
                    onMouseEnter={() => setIsHovered(index)}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {update.team}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mt-2">
                      {update.update}
                    </p>
                    <span className={`inline-block mt-2 px-2 py-1 rounded text-sm status-badge ${
                      update.status === 'Confirmed' 
                        ? 'status-badge-confirmed'
                        : update.status === 'Development' 
                        ? 'status-badge-development'
                        : 'status-badge-testing'
                    }`}>
                      {update.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t dark:border-gray-700 pt-8">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">About F1 Fan Hub</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-center text-lg">
                    F1 Fan Hub is your comprehensive platform for everything Formula 1. 
                    <span className="block mt-4">
                      We provide detailed information about teams, drivers, upcoming events, and iconic racing spots around the world.
                    </span>
                    <span className="block mt-4 font-medium text-red-600 dark:text-red-400">
                      Create your profile, choose your favorite team and driver, and join our passionate community of racing fans.
                    </span>
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">F1 Fan Hub Features</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                      <svg className="h-6 w-6 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-lg">Real-time Race Weather Updates</span>
                    </li>
                    <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                      <svg className="h-6 w-6 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-lg">Historical Championship Standings (2023-2024)</span>
                    </li>
                    <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                      <svg className="h-6 w-6 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-lg">Circuit Information</span>
                    </li>
                    <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                      <svg className="h-6 w-6 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-lg">Personalized Team & Driver Tracking</span>
                    </li>
                    <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                      <svg className="h-6 w-6 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-lg">Latest F1 News & Updates</span>
                    </li>
                    <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                      <svg className="h-6 w-6 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-lg">Dark Mode Support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 