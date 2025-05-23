'use client'
import { createContext, useState, useEffect } from 'react';
import { auth }       from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Create AuthContext to share user authentication state across the app
export const AuthContext = createContext();

// AuthProvider component: wraps application and provides current user and loading state
export function AuthProvider({ children }) {
  // Local state for authenticated user object
  const [user, setUser] = useState(null);
  // Loading state to show a fallback while checking auth status
  const [loading, setLoading] = useState(true);

  // Effect: subscribe to Firebase auth state changes on mount
  useEffect(() => {
    // onAuthStateChanged fires immediately with current auth state and on each update
    const unsubscribe = onAuthStateChanged(auth, current => {
      setUser(current);
      setLoading(false);
    });
    // Unsubscribe listener on unmount to avoid memory leaks
    return unsubscribe;
  }, []);
  
  // While auth state is being determined, render a loading indicator
  if (loading) return <div>Loading auth...</div>;

  // Once loaded, provide the `user` via context to all children
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}