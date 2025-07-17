import { User as FirebaseUser, UserInfo } from 'firebase/auth';

/**
 * Mock user object that mimics Firebase User
 */
class MockUser implements Partial<FirebaseUser> {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: { creationTime: string; lastSignInTime: string; };
  providerData: UserInfo[];
  refreshToken: string;
  tenantId: string | null;
  
  constructor(data: {
    uid: string;
    email: string;
    displayName: string;
    role?: string;
  }) {
    this.uid = data.uid;
    this.email = data.email;
    this.displayName = data.displayName;
    this.photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.displayName)}&background=random`;
    this.emailVerified = true;
    this.isAnonymous = false;
    this.metadata = {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString(),
    };
    this.providerData = [];
    this.refreshToken = 'mock-refresh-token';
    this.tenantId = null;
  }
  
  // Required methods
  delete = async () => {};
  getIdToken = async () => 'mock-id-token';
  getIdTokenResult = async () => ({ token: 'mock-id-token', claims: {} } as FirebaseUser['getIdTokenResult'] extends () => Promise<infer R> ? R : never);
  reload = async () => {};
  toJSON = () => ({ ...this });
  // Add other required methods as needed
  get phoneNumber() { return null; }
  get providerId() { return 'mock'; }
}

/**
 * Mock Auth Service for development without Firebase
 */
export class MockAuthService {
  private currentUser: MockUser | null = null;
  private authStateListeners: ((user: MockUser | null) => void)[] = [];
  
  constructor() {
    // Check localStorage for persisted session
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('mockAuthUser');
      if (savedUser) {
        this.currentUser = new MockUser(JSON.parse(savedUser));
        // Notify listeners after a tick
        setTimeout(() => this.notifyAuthStateChange(), 0);
      }
    }
  }
  
  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<{ user: MockUser }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Create mock user
    const mockUser = new MockUser({
      uid: 'mock-user-' + Date.now(),
      email,
      displayName: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'user',
    });
    
    this.currentUser = mockUser;
    this.persistUser();
    this.notifyAuthStateChange();
    
    return { user: mockUser };
  }
  
  /**
   * Sign up with email and password
   */
  async signUp(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    [key: string]: unknown;
  }): Promise<{ user: MockUser }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (!data.email || !data.password) {
      throw new Error('Email and password are required');
    }
    
    // Create mock user
    const mockUser = new MockUser({
      uid: 'mock-user-' + Date.now(),
      email: data.email,
      displayName: `${data.firstName} ${data.lastName}`,
      role: data.email.includes('admin') ? 'admin' : 'user',
    });
    
    this.currentUser = mockUser;
    this.persistUser();
    this.notifyAuthStateChange();
    
    return { user: mockUser };
  }
  
  /**
   * Sign in with Google (mock)
   */
  async signInWithGoogle(): Promise<{ user: MockUser }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mock Google user
    const mockUser = new MockUser({
      uid: 'google-user-' + Date.now(),
      email: 'mockuser@gmail.com',
      displayName: 'Mock Google User',
      role: 'user',
    });
    
    this.currentUser = mockUser;
    this.persistUser();
    this.notifyAuthStateChange();
    
    return { user: mockUser };
  }
  
  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mockAuthUser');
      localStorage.removeItem('mockUserData');
    }
    this.notifyAuthStateChange();
  }
  
  /**
   * Reset password (mock)
   */
  async resetPassword(email: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!email) {
      throw new Error('Email is required');
    }
    
    // Mock success
    console.log(`Password reset email sent to ${email} (mock)`);
  }
  
  /**
   * Get current user
   */
  getCurrentUser(): MockUser | null {
    return this.currentUser;
  }
  
  /**
   * Subscribe to auth state changes
   */
  onAuthStateChanged(callback: (user: MockUser | null) => void): () => void {
    this.authStateListeners.push(callback);
    
    // Immediately call with current user
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }
  
  /**
   * Get user data from mock database
   */
  async getUserData(uid: string): Promise<Record<string, unknown>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('mockUserData');
      if (savedData) {
        return JSON.parse(savedData);
      }
    }
    
    // Return default user data
    return {
      uid,
      email: this.currentUser?.email,
      displayName: this.currentUser?.displayName,
      role: this.currentUser?.email?.includes('admin') ? 'admin' : 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  
  /**
   * Save user data to mock database
   */
  async saveUserData(uid: string, data: Record<string, unknown>): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('mockUserData', JSON.stringify({
        ...data,
        uid,
        updatedAt: new Date(),
      }));
    }
  }
  
  /**
   * Persist user to localStorage
   */
  private persistUser(): void {
    if (typeof window !== 'undefined' && this.currentUser) {
      localStorage.setItem('mockAuthUser', JSON.stringify({
        uid: this.currentUser.uid,
        email: this.currentUser.email,
        displayName: this.currentUser.displayName,
      }));
    }
  }
  
  /**
   * Notify all auth state listeners
   */
  private notifyAuthStateChange(): void {
    this.authStateListeners.forEach(listener => {
      listener(this.currentUser);
    });
  }
}

// Export singleton instance
export const mockAuthService = new MockAuthService();