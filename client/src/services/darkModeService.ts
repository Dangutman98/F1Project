import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase';

export const darkModeService = {
  async saveDarkModePreference(isDarkMode: boolean) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }

      const userRef = doc(db, 'userPreferences', user.uid);
      await setDoc(userRef, {
        darkMode: isDarkMode,
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      console.error('Error saving dark mode preference:', error);
      throw error;
    }
  },

  async getDarkModePreference() {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }

      const userRef = doc(db, 'userPreferences', user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        return docSnap.data().darkMode;
      }
      return false; // Default to light mode
    } catch (error) {
      console.error('Error getting dark mode preference:', error);
      return false; // Default to light mode on error
    }
  }
}; 