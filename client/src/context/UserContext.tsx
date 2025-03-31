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
    // Ensure profile photo is properly formatted when logging in
    if (userData.profile?.profilePhoto && !userData.profile.profilePhoto.startsWith('data:image')) {
      userData.profile.profilePhoto = `data:image/jpeg;base64,${userData.profile.profilePhoto}`;
    }
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = (profileData: UserProfile) => {
    if (!user) return;

    // Ensure profile photo is properly formatted when updating
    if (profileData.profilePhoto && !profileData.profilePhoto.startsWith('data:image')) {
      profileData.profilePhoto = `data:image/jpeg;base64,${profileData.profilePhoto}`;
    }

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
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 