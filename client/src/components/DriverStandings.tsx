import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface DriverStanding {
    position: number;
    driverName: string;
    teamName: string;
    points: number;
    gapToLeader: string;
}

const fetchWithRetry = async (url: string, retries = 3): Promise<any> => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch from ${url}`);
            return await response.json();
        } catch (err) {
            if (i === retries - 1) throw err;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            console.log(`Retry attempt ${i + 1} for ${url}`);
        }
    }
};

const DriverStandings: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [standings2023, setStandings2023] = useState<DriverStanding[]>([]);
    const [standings2024, setStandings2024] = useState<DriverStanding[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showYear, setShowYear] = useState<2023 | 2024>(2023);
    const [showYearOptions, setShowYearOptions] = useState(false);

    const fetchStandings = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching standings data...');
            const [data2023, data2024] = await Promise.all([
                fetchWithRetry('http://localhost:5066/api/DriverStandings/2023'),
                fetchWithRetry('http://localhost:5066/api/DriverStandings/2024')
            ]);

            if (Array.isArray(data2023)) {
                setStandings2023(data2023);
            } else {
                console.error('Invalid 2023 data format:', data2023);
                throw new Error('Invalid data format for 2023 standings');
            }

            if (Array.isArray(data2024)) {
                setStandings2024(data2024);
            } else {
                console.error('Invalid 2024 data format:', data2024);
                throw new Error('Invalid data format for 2024 standings');
            }
        } catch (err) {
            console.error('Error fetching standings:', err);
            setError(err instanceof Error ? err.message : 'An error occurred while fetching standings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetchStandings();
    }, [user, navigate]);

    useEffect(() => {
        const handleClickOutside = () => {
            setShowYearOptions(false);
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const YearSelector: React.FC = () => (
        <div className="relative">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setShowYearOptions(!showYearOptions);
                }}
                className="flex items-center justify-between w-32 px-4 py-2 bg-red-600 text-black rounded-md hover:bg-red-700 transition-colors"
            >
                <span>{showYear}</span>
                <span className="ml-2">▼</span>
            </button>
            {showYearOptions && (
                <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    {[2023, 2024].map((year) => (
                        <button
                            key={year}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowYear(year as 2023 | 2024);
                                setShowYearOptions(false);
                            }}
                            className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                                showYear === year ? 'bg-gray-50' : ''
                            }`}
                        >
                            {year}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    const StandingsTable: React.FC<{ standings: DriverStanding[] }> = ({ standings }) => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Formula 1 Driver Standings</h2>
                    <YearSelector />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Gap to Leader</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {standings && standings.length > 0 ? (
                                standings.map((standing) => (
                                    <tr key={standing.position} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                            {standing.position}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {standing.driverName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {standing.teamName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                                            {standing.points}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                            {standing.gapToLeader || '—'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No standings data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    if (!user) {
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
                    className="bg-red-600 text-black px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
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
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Driver Standings</h1>
                    <div className="space-y-6">
                        <StandingsTable 
                            standings={showYear === 2024 ? standings2024 : standings2023} 
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DriverStandings; 