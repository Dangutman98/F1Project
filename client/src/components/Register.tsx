import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import AnimalEmojiSelector from './AnimalEmojiSelector';
import { API_BASE_URL } from '../config';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    favoriteAnimal: '',
    dateOfBirth: {
      day: '',
      month: '',
      year: ''
    }
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    password?: string;
    email?: string;
    favoriteAnimal?: string;
    dateOfBirth?: string;
  }>({});

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 7;
    return hasUpperCase && hasLowerCase && hasNumber && hasMinLength;
  };

  const validateForm = () => {
    const errors: typeof validationErrors = {};
    
    if (!formData.username) {
      errors.username = 'Username is required';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      errors.password = 'Must contain at least 7 characters with one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    }
    
    if (!formData.favoriteAnimal) {
      errors.favoriteAnimal = 'Favorite animal is required';
    }
    
    if (!formData.dateOfBirth.day || !formData.dateOfBirth.month || !formData.dateOfBirth.year) {
      errors.dateOfBirth = 'Date of birth is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          passwordHash: formData.password,
          email: formData.email,
          favoriteAnimal: formData.favoriteAnimal
        }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          const data = await response.json();
          if (data.toLowerCase().includes('email')) {
            setValidationErrors(prev => ({ ...prev, email: 'Registration failed, email already in use' }));
          } else {
            setError('Username already exists, choose different');
          }
        } else {
          throw new Error('Registration failed');
        }
        setIsLoading(false);
        return;
      }

      const userData = await response.json();

      // Transform the data to match our User interface
      const transformedUserData = {
        id: userData.id || userData.userId,
        username: userData.username,
        profile: {
          favoriteAnimal: formData.favoriteAnimal,
          email: formData.email,
          favoriteDriver: '',
          favoriteTeam: '',
          favoriteRacingSpot: ''
        }
      };

      login(transformedUserData);
      navigate('/home');
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (field: 'day' | 'month' | 'year', value: string) => {
    setFormData(prev => ({
      ...prev,
      dateOfBirth: {
        ...prev.dateOfBirth,
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-black text-xl sm:text-2xl font-bold">
                F1 Fan Hub
              </span>
            </div>
            <nav className="flex items-center">
              <button
                onClick={() => navigate('/login')}
                className="text-black hover:text-gray-800 text-sm sm:text-base px-3 py-2"
              >
                Login
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-2xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6 sm:mb-8">Create Account</h2>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 ${
                      validationErrors.username ? 'border-red-500' : ''
                    }`}
                  />
                  {validationErrors.username && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.username}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 ${
                      validationErrors.password ? 'border-red-500' : ''
                    }`}
                  />
                  {validationErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                  )}
                  <p className={`mt-1 text-sm ${validationErrors.password ? 'text-red-600' : 'text-gray-500'}`}>
                    Must contain at least 7 characters with one uppercase letter, one lowercase letter, and one number
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 ${
                      validationErrors.email ? 'border-red-500' : ''
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <AnimalEmojiSelector
                    selectedAnimal={formData.favoriteAnimal}
                    onSelect={(animal) => setFormData(prev => ({ ...prev, favoriteAnimal: animal }))}
                    error={validationErrors.favoriteAnimal}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <select
                        value={formData.dateOfBirth.day}
                        onChange={(e) => handleDateChange('day', e.target.value)}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 ${
                          validationErrors.dateOfBirth ? 'border-red-500' : ''
                        }`}
                      >
                        <option value="">Day</option>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        value={formData.dateOfBirth.month}
                        onChange={(e) => handleDateChange('month', e.target.value)}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 ${
                          validationErrors.dateOfBirth ? 'border-red-500' : ''
                        }`}
                      >
                        <option value="">Month</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        value={formData.dateOfBirth.year}
                        onChange={(e) => handleDateChange('year', e.target.value)}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 ${
                          validationErrors.dateOfBirth ? 'border-red-500' : ''
                        }`}
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {validationErrors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.dateOfBirth}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2"
                  >
                    Already have an account? Login
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto bg-red-600 text-black py-2 px-6 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm sm:text-base"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p className="text-sm sm:text-base">© 2024 F1 Fan Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 