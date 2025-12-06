// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, getDoc, addDoc, deleteDoc, doc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmo1Cmf0yDYeawdEUNoc7NdHPW6EZ5dsY",
  authDomain: "story-73855.firebaseapp.com",
  projectId: "story-73855",
  storageBucket: "story-73855.firebasestorage.app",
  messagingSenderId: "451328491428",
  appId: "1:451328491428:web:34d7671f6829837a800b31",
  measurementId: "G-LMYRB2FSB1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

// Collections
const storiesCollection = collection(db, 'stories');
const commentsCollection = collection(db, 'comments');
const usersCollection = collection(db, 'users');
const submittedStoriesCollection = collection(db, 'submitted_stories');

// Stories functions
export const getStories = async () => {
  try {
    // Remove the orderBy clause temporarily to see if that's causing issues
    const querySnapshot = await getDocs(storiesCollection);
    const stories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort manually in JavaScript to avoid Firebase query issues
    stories.sort((a, b) => {
      // Handle potential date formatting issues
      let dateA, dateB;
      
      try {
        dateA = a.publish_date instanceof Date ? a.publish_date : new Date(a.publish_date);
        dateB = b.publish_date instanceof Date ? b.publish_date : new Date(b.publish_date);
      } catch (error) {
        // If date parsing fails, use created_at or fallback to id
        dateA = a.created_at instanceof Date ? a.created_at : new Date(a.created_at || 0);
        dateB = b.created_at instanceof Date ? b.created_at : new Date(b.created_at || 0);
      }
      
      return dateB - dateA; // Descending order (newest first)
    });
    
    return stories;
  } catch (error) {
    console.error('Error fetching stories:', error);
    // Return empty array as fallback instead of throwing error
    return [];
  }
};

export const getStoryById = async (id) => {
  try {
    const docRef = doc(db, 'stories', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const storyData = { id: docSnap.id, ...docSnap.data() };
      return storyData;
    } else {
      throw new Error('Story not found');
    }
  } catch (error) {
    console.error('Error fetching story:', error);
    throw error;
  }
};

export const createStory = async (storyData) => {
  try {
    const docRef = await addDoc(storiesCollection, storyData);
    return { id: docRef.id, ...storyData };
  } catch (error) {
    console.error('Error creating story:', error);
    throw error;
  }
};

export const updateStory = async (id, storyData) => {
  try {
    const docRef = doc(db, 'stories', id);
    await updateDoc(docRef, storyData);
    return { id, ...storyData };
  } catch (error) {
    console.error('Error updating story:', error);
    throw error;
  }
};

export const deleteStory = async (id) => {
  try {
    const docRef = doc(db, 'stories', id);
    await deleteDoc(docRef);
    return { message: 'Story deleted successfully' };
  } catch (error) {
    console.error('Error deleting story:', error);
    throw error;
  }
};

// Comments functions
export const getComments = async (storyId = null) => {
  try {
    let q = commentsCollection;
    if (storyId) {
      // Ensure storyId is a string for consistent comparison
      q = query(commentsCollection, where('story_id', '==', storyId.toString()));
    }
    
    const querySnapshot = await getDocs(q);
    let comments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort manually to avoid Firebase query issues
    comments.sort((a, b) => {
      try {
        const dateA = a.created_at instanceof Date ? a.created_at : new Date(a.created_at);
        const dateB = b.created_at instanceof Date ? b.created_at : new Date(b.created_at);
        return dateB - dateA; // Descending order (newest first)
      } catch (error) {
        return 0; // If sorting fails, maintain current order
      }
    });
    
    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const createComment = async (commentData) => {
  try {
    const docRef = await addDoc(commentsCollection, commentData);
    return { id: docRef.id, ...commentData };
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const updateComment = async (id, commentData) => {
  try {
    const docRef = doc(db, 'comments', id);
    await updateDoc(docRef, commentData);
    return { id, ...commentData };
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

export const deleteComment = async (id) => {
  try {
    const docRef = doc(db, 'comments', id);
    await deleteDoc(docRef);
    return { message: 'Comment deleted successfully' };
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Submitted stories functions
export const getSubmittedStories = async () => {
  try {
    const q = query(submittedStoriesCollection, orderBy('submitted_at', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching submitted stories:', error);
    throw error;
  }
};

export const createSubmittedStory = async (storyData) => {
  try {
    const docRef = await addDoc(submittedStoriesCollection, storyData);
    return { id: docRef.id, ...storyData };
  } catch (error) {
    console.error('Error creating submitted story:', error);
    throw error;
  }
};

export const updateSubmittedStory = async (id, storyData) => {
  try {
    const docRef = doc(db, 'submitted_stories', id);
    await updateDoc(docRef, storyData);
    return { id, ...storyData };
  } catch (error) {
    console.error('Error updating submitted story:', error);
    throw error;
  }
};

// Users functions
export const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(usersCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Auth functions
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export { db, auth };