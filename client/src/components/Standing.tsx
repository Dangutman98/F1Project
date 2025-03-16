import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';

interface DriverStanding {
  position: number;
  points: number;
  wins: number;
  driverName: string;
  acronymName: string;
  teamName: string;
  teamColor: string;
}

interface ConstructorStanding {
  position: number;
  points: number;
  wins: number;
  teamName: string;
  teamColor: string;
}

export default function Standing() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [season, setSeason] = useState(2024);
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [constructorStandings, setConstructorStandings] = useState<ConstructorStanding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStandings();
  }, [season]);

  const fetchStandings = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [driverResponse, constructorResponse] = await Promise.all([
        fetch(`http://localhost:5066/api/standings/drivers/${season}`),
        fetch(`http://localhost:5066/api/standings/constructors/${season}`)
      ]);

      if (!driverResponse.ok || !constructorResponse.ok) {
        throw new Error('Failed to fetch standings');
      }

      const [driverData, constructorData] = await Promise.all([
        driverResponse.json(),
        constructorResponse.json()
      ]);

      setDriverStandings(driverData);
      setConstructorStandings(constructorData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch standings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStandings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5066/api/standings/update/${season}`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to update standings');
      }

      const data = await response.json();
      if (data.driverStandings && data.constructorStandings) {
        setDriverStandings(data.driverStandings);
        setConstructorStandings(data.constructorStandings);
      } else {
        // If the update was successful but we need to fetch the latest data
        await fetchStandings();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update standings');
    } finally {
      setIsLoading(false);
    }
  };

  const renderDriverStandings = () => {
    if (!driverStandings || driverStandings.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
            No driver standings available
          </td>
        </tr>
      );
    }
    return driverStandings.map((driver) => (
      <tr key={driver.position} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {driver.position}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div>
              <div className="text-sm font-medium text-gray-900">
                {driver.acronymName} {driver.driverName}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
            style={{ backgroundColor: driver.teamColor, color: 'white' }}
          >
            {driver.teamName}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
          {driver.points}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {driver.wins}
        </td>
      </tr>
    ));
  };

  const renderConstructorStandings = () => {
    if (!constructorStandings || constructorStandings.length === 0) {
      return (
        <tr>
          <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
            No constructor standings available
          </td>
        </tr>
      );
    }
    return constructorStandings.map((constructor) => (
      <tr key={constructor.position} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {constructor.position}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
            style={{ backgroundColor: constructor.teamColor, color: 'white' }}
          >
            {constructor.teamName}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
          {constructor.points}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {constructor.wins}
        </td>
      </tr>
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-white">F1 Standings</h1>
              <select
                value={season}
                onChange={(e) => setSeason(Number(e.target.value))}
                className="ml-4 rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
              >
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
              </select>
            </div>
            <button
              onClick={handleUpdateStandings}
              className="px-4 py-2 bg-white text-red-600 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Update Standings
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-red-900/20 p-1">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                ${selected 
                  ? 'bg-white text-red-700 shadow'
                  : 'text-gray-700 hover:bg-white/[0.12] hover:text-red-600'}`
              }
            >
              Driver Standings
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                ${selected 
                  ? 'bg-white text-red-700 shadow'
                  : 'text-gray-700 hover:bg-white/[0.12] hover:text-red-600'}`
              }
            >
              Constructor Standings
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">POS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DRIVER</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TEAM</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">POINTS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">WINS</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {renderDriverStandings()}
                  </tbody>
                </table>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">POS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TEAM</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">POINTS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">WINS</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {renderConstructorStandings()}
                  </tbody>
                </table>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </main>
    </div>
  );
} 