import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { signInWithGoogle } from '../services/authService';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login, logout } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            if (!response.ok) {
                const text = await response.text();
                let errorMessage;
                try {
                    const data = JSON.parse(text);
                    errorMessage = data.message || 'Login failed, try different username or password';
                } catch (e) {
                    errorMessage = 'Login failed, try different username or password';
                }
                setError(errorMessage);
                setIsLoading(false);
                return;
            }

            const data = await response.json();

            // Transform the data to match our User interface
            const userData = {
                id: data.id || data.userId,
                username: data.username,
                profile: {
                    favoriteAnimal: data.favoriteAnimal || data.profile?.favoriteAnimal || 'Not Set',
                    email: data.email || data.profile?.email || '',
                    favoriteDriver: data.favoriteDriver || data.profile?.favoriteDriver || '',
                    favoriteTeam: data.favoriteTeam || data.profile?.favoriteTeam || '',
                    favoriteRacingSpot: data.favoriteRacingSpot || data.profile?.favoriteRacingSpot || ''
                }
            };

            login(userData);
            navigate('/home');
        } catch (error) {
            console.error('Login error:', error);
            setError(error instanceof Error ? error.message : 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            setError('');
            
            // Clear any existing session and local storage data
            sessionStorage.clear();
            localStorage.clear();
            
            // Clear any existing user data
            logout();
            
            const result = await signInWithGoogle();
            if (!result || !result.user) {
                return;
            }

            const user = result.user;
            
            // Attempt to get user data from server
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/google-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    uid: user.uid
                })
            });

            // If server responds successfully and user exists
            if (response.ok) {
                const data = await response.json();
                if (!data.isNewUser) {
                    const userData = {
                        id: data.id,
                        username: data.username,
                        profile: {
                            favoriteAnimal: data.favoriteAnimal || 'Not Set',
                            email: data.email || '',
                            favoriteDriver: data.favoriteDriver || '',
                            favoriteTeam: data.favoriteTeam || '',
                            favoriteRacingSpot: data.favoriteRacingSpot || '',
                            profilePhoto: data.profilePhoto || user.photoURL
                        }
                    };
                    login(userData);
                    navigate('/home');
                    return;
                }
            }

            // If we get here, either the server had an error or it's a new user
            // In either case, show the registration message
            setError('now you registered, try to log with google again');

        } catch (error) {
            // Show registration message for any error
            setError('now you registered, try to log with google again');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 login-section">
            <div className="w-full max-w-md space-y-6 p-6 sm:p-8 bg-white rounded-lg shadow">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">Login</h2>
                    {error && (
                        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-black bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <img
                                className="h-5 w-5 mr-2"
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google logo"
                            />
                            Sign in with Google
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">Don't have an account yet?</p>
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="mt-2 text-sm font-medium text-red-600 hover:text-red-500 px-3 py-2"
                        >
                            Register here
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 