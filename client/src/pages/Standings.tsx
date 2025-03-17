import React, { useState, useEffect } from 'react';

interface DriverStanding {
    position: number;
    driverName: string;
    teamName: string;
    points: number;
    gapToLeader: number;
}

const Standings: React.FC = () => {
    const [standings, setStandings] = useState<DriverStanding[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                setIsLoading(true);
                // Fetch drivers data
                const driversResponse = await fetch('https://api.openf1.org/v1/drivers?session_key=latest');
                const driversData = await driversResponse.json();

                // Fetch intervals data
                const intervalsResponse = await fetch('https://api.openf1.org/v1/intervals?session_key=latest');
                const intervalsData = await intervalsResponse.json();

                // Process and combine the data
                const processedStandings = driversData.map((driver: any, index: number) => {
                    const driverIntervals = intervalsData.find((interval: any) => 
                        interval.driver_number === driver.driver_number
                    );

                    return {
                        position: index + 1,
                        driverName: driver.full_name,
                        teamName: driver.team_name,
                        points: 0, // This would come from your backend
                        gapToLeader: driverIntervals?.gap_to_leader || 0
                    };
                });

                setStandings(processedStandings);
            } catch (err) {
                setError('Failed to fetch standings data');
                console.error('Error fetching standings:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStandings();
    }, []);

    const formatGap = (gap: number): string => {
        if (gap === 0) return '—';
        return `+${gap.toFixed(1)}s`;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Position
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Driver Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Team
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Points
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Gap to Leader
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {standings.map((standing) => (
                        <tr key={standing.position} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {standing.position}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {standing.driverName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {standing.teamName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {standing.points}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatGap(standing.gapToLeader)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Standings; 