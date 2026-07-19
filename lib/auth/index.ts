import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    sendEmailVerification,
    User,
    UserCredential,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from './firebase';

const googleProvider = new GoogleAuthProvider();

/**
 * Maps Firebase Auth error codes to user-friendly messages
 */
const getFriendlyErrorMessage = (error: any): string => {
    const code = error.code;

    switch (code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return 'Incorrect email or password. Please try again.';
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/weak-password':
            return 'Password is too weak. Please use at least 6 characters.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/popup-closed-by-user':
            return 'Sign-in was cancelled.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
        default:
            return error.message || 'An unexpected error occurred. Please try again.';
    }
};

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
    email: string,
    password: string
): Promise<UserCredential> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error: any) {
        throw new Error(getFriendlyErrorMessage(error));
    }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (
    email: string,
    password: string
): Promise<UserCredential> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error: any) {
        throw new Error(getFriendlyErrorMessage(error));
    }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
        const userCredential = await signInWithPopup(auth, googleProvider);
        return userCredential;
    } catch (error: any) {
        throw new Error(getFriendlyErrorMessage(error));
    }
};

/**
 * Sign out
 */
export const signOut = async (): Promise<void> => {
    try {
        await firebaseSignOut(auth);
    } catch (error: any) {
        throw new Error(error.message || 'Failed to sign out');
    }
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

/**
 * Get provider from user credential
 */
export const getProviderFromUser = (user: User): string => {
    const providerData = user.providerData[0];
    if (providerData?.providerId.includes('google')) {
        return 'google';
    }
    return 'email';
};

/**
 * Send email verification
 */
export const sendVerificationEmail = async (user: User): Promise<void> => {
    try {
        await sendEmailVerification(user);
    } catch (error: any) {
        throw new Error(getFriendlyErrorMessage(error));
    }
};

export const sendPasswordResetLink = async (email: string): Promise<void> => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
        throw new Error(getFriendlyErrorMessage(error));
    }
};


