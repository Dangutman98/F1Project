import { createContext, useContext, useState, useEffect } from 'react';

interface UserProfile {
  favoriteDriver?: string;
  favoriteTeam?: string;
  favoriteRacingSpot?: string;
  favoriteAnimal?: string;
  email?: string;
  profilePhoto?: string;
}

interface User {
  id: number;
  username: string;
  profile?: UserProfile;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from sessionStorage instead of localStorage
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Update sessionStorage when user state changes
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  const login = (userData: any) => {
    const userDataToProcess = userData.user || userData;
    
    const userId = userDataToProcess.id || userDataToProcess.userId;
    const username = userDataToProcess.username;
    
    if (!userId || !username) {
        console.error('Missing required user data:', { userId, username, originalData: userData });
        return;
    }

    const user: User = {
        id: Number(userId),
        username: username,
        profile: {
            favoriteAnimal: userDataToProcess.favoriteAnimal || userDataToProcess.profile?.favoriteAnimal || 'Not Set',
            email: userDataToProcess.email || userDataToProcess.profile?.email || '',
            favoriteDriver: userDataToProcess.favoriteDriver || userDataToProcess.profile?.favoriteDriver || '',
            favoriteTeam: userDataToProcess.favoriteTeam || userDataToProcess.profile?.favoriteTeam || '',
            favoriteRacingSpot: userDataToProcess.favoriteRacingSpot || userDataToProcess.profile?.favoriteRacingSpot || '',
            profilePhoto: userDataToProcess.profilePhoto || userDataToProcess.profile?.profilePhoto || ''
        }
    };

    setUser(user);
    sessionStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    // Clear all session storage data
    sessionStorage.clear();
    // Clear any other stored data if exists
    localStorage.removeItem('darkMode');
  };

  const updateProfile = (profileData: UserProfile) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      profile: profileData,
    };

    setUser(updatedUser);
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 