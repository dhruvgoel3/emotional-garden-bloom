// Firebase configuration - currently using mock data for demo
// In production, replace with actual Firebase configuration

export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback) => {
    // Mock auth state - user is always authenticated for demo
    setTimeout(() => {
      callback({ uid: 'demo-user', isAnonymous: true });
    }, 100);
    return () => {}; // unsubscribe function
  },
  signInAnonymously: () => Promise.resolve({ user: { uid: 'demo-user' } })
};

export const db = {
  collection: () => ({
    doc: () => ({
      set: () => Promise.resolve(),
      get: () => Promise.resolve({ exists: false, data: () => null }),
      onSnapshot: (callback) => {
        callback([]);
        return () => {};
      }
    }),
    add: () => Promise.resolve({ id: `mock-${Date.now()}` }),
    where: () => ({
      orderBy: () => ({
        onSnapshot: (callback) => {
          callback([]);
          return () => {};
        }
      })
    })
  })
};

export const analytics = {
  logEvent: () => {}
};

// Mock Firestore Timestamp
export const Timestamp = {
  now: () => new Date(),
  fromDate: (date) => date
};