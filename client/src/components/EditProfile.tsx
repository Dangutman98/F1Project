import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface Driver {
  id: number;
  name: string;
  photoURL: string;
  teamId: number;
  acronymName: string;
  teamName: string;
  teamColor: string;
}

interface Team {
  id: number;
  name: string;
  color: string;
}

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, updateProfile } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [formData, setFormData] = useState({
    favoriteDriver: '',
    favoriteTeam: '',
    favoriteRacingSpot: '',
    profilePhoto: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch drivers and teams
    const fetchData = async () => {
      try {
        const [driversResponse, teamsResponse] = await Promise.all([
          fetch('http://localhost:5066/api/Driver/fetch'),
          fetch('http://localhost:5066/api/Team')
        ]);

        if (!driversResponse.ok || !teamsResponse.ok) {
          console.error('API Error:', {
            drivers: driversResponse.status,
            teams: teamsResponse.status
          });
          throw new Error('Failed to fetch data');
        }

        const driversData = await driversResponse.json();
        const teamsData = await teamsResponse.json();
        console.log('Fetched data:', { drivers: driversData, teams: teamsData });
        setDrivers(driversData);
        setTeams(teamsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load drivers and teams');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        favoriteDriver: user.profile.favoriteDriver || '',
        favoriteTeam: user.profile.favoriteTeam || '',
        favoriteRacingSpot: user.profile.favoriteRacingSpot || '',
        profilePhoto: user.profile.profilePhoto || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Create the request body with only the preference fields
      const requestBody = {
        favoriteDriverId: formData.favoriteDriver ? parseInt(formData.favoriteDriver) : null,
        favoriteTeamId: formData.favoriteTeam ? parseInt(formData.favoriteTeam) : null,
        favoriteRacingSpotId: null  // Set to null since it's not used yet
      };

      console.log('Sending request with data:', requestBody);

      // Update user preferences in the backend
      const response = await fetch(`http://localhost:5066/api/user/${user?.id}/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error details:', errorData);
        throw new Error(`Failed to update preferences: ${errorData.message || response.statusText}`);
      }

      // Update local state
      updateProfile({
        favoriteDriver: formData.favoriteDriver,
        favoriteTeam: formData.favoriteTeam,
        favoriteRacingSpot: formData.favoriteRacingSpot,
        profilePhoto: formData.profilePhoto
      });
      
      navigate('/profile');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePhoto: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-8">Edit Profile</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Profile Photo
                </label>
                <div className="mt-1 flex justify-center items-center">
                  <div 
                    onClick={handlePhotoClick}
                    className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    {formData.profilePhoto ? (
                      <img
                        src={formData.profilePhoto}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center text-gray-400">
                        <span className="text-2xl">+</span>
                        <span className="text-xs mt-1">Upload Photo Here</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Favorite Driver
                </label>
                <select
                  value={formData.favoriteDriver}
                  onChange={(e) => setFormData(prev => ({ ...prev, favoriteDriver: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                >
                  <option value="">Select a driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} - {driver.teamName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Favorite Team
                </label>
                <select
                  value={formData.favoriteTeam}
                  onChange={(e) => setFormData(prev => ({ ...prev, favoriteTeam: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                >
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Favorite Racing Spot
                </label>
                <input
                  type="text"
                  value={formData.favoriteRacingSpot}
                  onChange={(e) => setFormData(prev => ({ ...prev, favoriteRacingSpot: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 