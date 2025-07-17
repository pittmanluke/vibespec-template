import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, DocumentData } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export type UserRole = 'user' | 'admin' | null;

export interface AuthState {
  user: FirebaseUser | null;
  userData: DocumentData | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  userRole: UserRole;
  isAdmin: boolean;
  isRegularUser: boolean;
  isDevelopment: boolean;
  isRoleOverridden: boolean;
  originalRole: UserRole;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  [key: string]: unknown; // Allow additional fields
}

class AuthService {
  /**
   * Sign up a new user
   */
  static async signUp(data: SignUpData): Promise<FirebaseUser> {
    if (!auth) {
      throw new Error('Authentication is not initialized');
    }
    
    const { email, password, firstName, lastName, ...additionalData } = data;
    
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document in Firestore if db is available
    if (db) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        role: 'user', // Default role
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...additionalData
      });
    }
    
    return user;
  }
  
  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string): Promise<FirebaseUser> {
    if (!auth) {
      throw new Error('Authentication is not initialized');
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }
  
  /**
   * Sign in with Google
   */
  static async signInWithGoogle(): Promise<FirebaseUser> {
    if (!auth) {
      throw new Error('Authentication is not initialized');
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user document exists if db is available
    if (db) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create user document for first-time Google sign-in
        const names = user.displayName?.split(' ') || ['', ''];
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          firstName: names[0] || '',
          lastName: names.slice(1).join(' ') || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          role: 'user', // Default role
          authProvider: 'google',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    }
    
    return user;
  }
  
  /**
   * Sign out
   */
  static async signOut(): Promise<void> {
    if (!auth) {
      throw new Error('Authentication is not initialized');
    }
    await firebaseSignOut(auth);
  }
  
  /**
   * Send password reset email
   */
  static async resetPassword(email: string): Promise<void> {
    if (!auth) {
      throw new Error('Authentication is not initialized');
    }
    await sendPasswordResetEmail(auth, email);
  }
  
  /**
   * Get current user
   */
  static getCurrentUser(): FirebaseUser | null {
    if (!auth) {
      return null;
    }
    return auth.currentUser;
  }
}

export default AuthService;