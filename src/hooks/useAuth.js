import { useState, useEffect } from 'react';
import { auth, db, Timestamp } from '../utils/firebase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInAnonymously = async () => {
    try {
      const result = await auth.signInAnonymously();
      return result.user;
    } catch (error) {
      console.error('Anonymous sign-in failed:', error);
      throw error;
    }
  };

  const createUserProfile = async (userId, profileData) => {
    try {
      await db.collection('users').doc(userId).set({
        ...profileData,
        createdAt: Timestamp.now(),
        lastActive: Timestamp.now()
      });
    } catch (error) {
      console.error('Failed to create user profile:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signInAnonymously,
    createUserProfile
  };
};