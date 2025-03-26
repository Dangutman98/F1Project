import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UserProfile {
  favoriteDriver?: string;
  favoriteTeam?: string;
  favoriteRacingSpot?: string;
  favoriteAnimal?: string;
  profilePhoto?: string;
}

interface User {
  id: string;
  username: string;
  profile?: UserProfile;
  profilePhoto?: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
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

  const login = (userData: User) => {
    console.log('Login data received:', userData);
    // Handle profile photo from login response
    const userWithProfile = {
      ...userData,
      profile: {
        ...userData.profile,
        profilePhoto: userData.profile?.profilePhoto || null
      }
    };
    console.log('Processed user data for storage:', userWithProfile);
    setUser(userWithProfile);
    // Ensure the data is immediately saved to localStorage
    localStorage.setItem('user', JSON.stringify(userWithProfile));
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = (profile: UserProfile) => {
    if (user) {
      const updatedProfile = {
        ...profile,
        profilePhoto: profile.profilePhoto?.startsWith('data:image') ? 
          profile.profilePhoto : 
          profile.profilePhoto ? `data:image/jpeg;base64,${profile.profilePhoto}` : null
      };

      const updatedUser = {
        ...user,
        profile: {
          ...user.profile,
          ...updatedProfile
        }
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
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
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 