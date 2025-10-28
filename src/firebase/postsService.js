import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  arrayUnion,
  arrayRemove,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

const POSTS_COLLECTION = 'posts';

// Create a new post
export const createPost = async (postData) => {
  try {
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
      ...postData,
      createdAt: serverTimestamp(),
      likes: [],
      comments: []
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, error: error.message };
  }
};

// Get all posts (real-time)
export const subscribeToPost = (callback) => {
  const q = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const posts = [];
    snapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    });
    callback(posts);
  }, (error) => {
    console.error('Error subscribing to posts:', error);
    callback([]);
  });
};

// Get all posts (one-time)
export const getAllPosts = async () => {
  try {
    const q = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const posts = [];
    snapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    });
    return { success: true, posts };
  } catch (error) {
    console.error('Error getting posts:', error);
    return { success: false, error: error.message, posts: [] };
  }
};

// Like a post
export const likePost = async (postId, userId) => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    await updateDoc(postRef, {
      likes: arrayUnion(userId)
    });
    return { success: true };
  } catch (error) {
    console.error('Error liking post:', error);
    return { success: false, error: error.message };
  }
};

// Unlike a post
export const unlikePost = async (postId, userId) => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    await updateDoc(postRef, {
      likes: arrayRemove(userId)
    });
    return { success: true };
  } catch (error) {
    console.error('Error unliking post:', error);
    return { success: false, error: error.message };
  }
};

// Delete a post
export const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(db, POSTS_COLLECTION, postId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error: error.message };
  }
};

// Add comment to post
export const addComment = async (postId, commentData) => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    await updateDoc(postRef, {
      comments: arrayUnion({
        ...commentData,
        createdAt: new Date().toISOString()
      })
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding comment:', error);
    return { success: false, error: error.message };
  }
};
