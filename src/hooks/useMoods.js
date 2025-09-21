import { useState, useEffect } from 'react';
import { db, Timestamp } from '../utils/firebase';

export const useMoods = (userId) => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = db
      .collection('users')
      .doc(userId)
      .collection('moods')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        const moodData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        setMoods(moodData);
      });

    return unsubscribe;
  }, [userId]);

  const addMood = async (moodData) => {
    if (!userId) throw new Error('User not authenticated');
    
    setLoading(true);
    try {
      const moodEntry = {
        ...moodData,
        timestamp: Timestamp.now(),
        processed: false
      };

      await db
        .collection('users')
        .doc(userId)
        .collection('moods')
        .add(moodEntry);

      return moodEntry;
    } catch (error) {
      console.error('Failed to add mood:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    moods,
    addMood,
    loading
  };
};