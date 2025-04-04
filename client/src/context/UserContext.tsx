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
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (userData: any) => {

    // Handle registration response which might be nested in a 'user' property
    const userDataToProcess = userData.user || userData;
    
    // For registration response, check both direct and nested locations for id
    const userId = userDataToProcess.id || userDataToProcess.userId;
    const username = userDataToProcess.username;
    

    // Check if we have the required fields
    if (!userId || !username) {
        console.error('Missing required user data:', { userId, username, originalData: userData });
        return;
    }

    // Create user object with required structure
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
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (profileData: UserProfile) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      profile: profileData,
    };

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
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