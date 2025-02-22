import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password, name) => {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Determine user role
      const role = email === 'abc@test.in' ? 'admin' : 'player';

      // Create user document in Firestore
      await setDoc(doc(firestore, 'users', firebaseUser.uid), {
        name,
        email,
        role,
        createdAt: new Date(),
        lastLogin: new Date()
      });

      return {
        ...firebaseUser,
        role
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Fetch additional user details from Firestore
      const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
      const userData = userDoc.data();

      // Update last login time
      await setDoc(doc(firestore, 'users', firebaseUser.uid), {
        ...userData,
        lastLogin: new Date()
      }, { merge: true });

      return {
        ...firebaseUser,
        ...userData
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user details from Firestore
        const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
        const userData = userDoc.data();

        setUser({
          ...firebaseUser,
          ...userData
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
