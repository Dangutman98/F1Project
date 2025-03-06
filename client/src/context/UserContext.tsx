import { createContext, useContext, useState, ReactNode } from 'react';

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
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (profile: UserProfile) => {
    if (user) {
      setUser({
        ...user,
        profile: {
          ...user.profile,
          ...profile
        }
      });
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