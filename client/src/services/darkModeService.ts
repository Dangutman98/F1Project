const LOCAL_STORAGE_KEY = 'darkMode';

export const darkModeService = {
  async saveDarkModePreference(isDarkMode: boolean) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(isDarkMode));
  },

  async getDarkModePreference(): Promise<boolean> {
    try {
      const preference = localStorage.getItem(LOCAL_STORAGE_KEY);
      return preference ? JSON.parse(preference) : false;
    } catch (error) {
      console.warn('Error reading dark mode preference:', error);
      return false;
    }
  }
}; 