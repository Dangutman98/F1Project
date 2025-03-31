import { auth } from '../firebase';
import { 
    GoogleAuthProvider, 
    signInWithPopup,
    signOut,
    UserCredential
} from 'firebase/auth';

export const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
        const provider = new GoogleAuthProvider();
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