import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from './config';
import { encryption } from '../utils/encryption';

const USERS_COLLECTION = 'users';

// Register new user
export const registerUser = async (userData) => {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    const user = userCredential.user;
    
    // Check if this is the first user (owner)
    const usersSnapshot = await getDocs(collection(db, USERS_COLLECTION));
    const isFirstUser = usersSnapshot.empty;
    
    // Store user data in Firestore
    await setDoc(doc(db, USERS_COLLECTION, user.uid), {
      name: userData.name,
      email: userData.email,
      phone: userData.phone || null,
      role: isFirstUser ? 'owner' : 'user',
      createdAt: new Date().toISOString(),
      verified: true,
      avatar: null
    });
    
    return { 
      success: true, 
      user: {
        id: user.uid,
        ...userData,
        role: isFirstUser ? 'owner' : 'user'
      }
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: error.message };
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, user.uid));
    
    if (userDoc.exists()) {
      return { 
        success: true, 
        user: {
          id: user.uid,
          ...userDoc.data()
        }
      };
    } else {
      return { success: false, error: 'User data not found' };
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error: error.message };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error);
    return { success: false, error: error.message };
  }
};

// Listen to auth state changes
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, user.uid));
      if (userDoc.exists()) {
        callback({
          id: user.uid,
          ...userDoc.data()
        });
      } else {
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

// Get all users (for admin)
export const getAllUsers = async () => {
  try {
    const snapshot = await getDocs(collection(db, USERS_COLLECTION));
    const users = [];
    snapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return { success: true, users };
  } catch (error) {
    console.error('Error getting users:', error);
    return { success: false, error: error.message, users: [] };
  }
};

// Update user role
export const updateUserRole = async (userId, newRole) => {
  try {
    await setDoc(doc(db, USERS_COLLECTION, userId), { role: newRole }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: error.message };
  }
};
