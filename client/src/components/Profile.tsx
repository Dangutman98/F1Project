import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useRef } from 'react';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({
          ...user.profile,
          profilePhoto: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/home')}
                className="text-black text-2xl font-bold hover:text-gray-800"
              >
                F1 Fan Hub
              </button>
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/home')}
                className="text-black hover:text-gray-800"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="text-black hover:text-gray-800"
              >
                Profile
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-red-600">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div 
                onClick={handlePhotoClick} 
                className="cursor-pointer relative inline-block"
              >
                {user.profile?.profilePhoto ? (
                  <img
                    src={user.profile.profilePhoto}
                    alt="Profile"
                    className="h-32 w-32 rounded-full mx-auto mb-6 object-cover border-4 border-white"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-white text-red-600 text-4xl font-bold flex flex-col items-center justify-center mx-auto mb-6 border-4 border-white relative group hover:bg-gray-50">
                    <span className="text-red-600 text-4xl">+</span>
                    <span className="text-red-600 text-xs mt-1">Upload photo</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
              <h1 className="text-4xl font-bold text-black mb-2">{user.username}</h1>
              <p className="text-xl text-black">F1 Fan</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Username</h3>
                      <p className="mt-1 text-gray-600">{user.username}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Favorite Animal</h3>
                      <p className="mt-1 text-gray-600">{user.profile?.favoriteAnimal || 'Not Set'}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Favorite Driver</h3>
                      <p className="mt-1 text-gray-600">{user.profile?.favoriteDriver || 'Not Set'}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Favorite Team</h3>
                      <p className="mt-1 text-gray-600">{user.profile?.favoriteTeam || 'Not Set'}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Favorite Racing Spot</h3>
                      <p className="mt-1 text-gray-600">{user.profile?.favoriteRacingSpot || 'Not Set'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => navigate('/edit-profile')}
                  className="bg-red-600 text-black py-3 px-8 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-lg font-semibold"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>© 2024 F1 Fan Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 