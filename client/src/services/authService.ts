import { auth } from '../firebase';
import { 
    GoogleAuthProvider, 
    signInWithPopup,
    signOut,
    UserCredential,
    browserLocalPersistence,
    setPersistence
} from 'firebase/auth';

export const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
        // Set persistence to LOCAL
        await setPersistence(auth, browserLocalPersistence);
        
        // Sign out current user and clear any existing tokens
        await signOut(auth);
        
        // Force a new provider instance to prevent reuse of cached credentials
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        });
        
        const result = await signInWithPopup(auth, provider);
        return result;
    } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
    }
};

export const signOutUser = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}; 