import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';

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
const db = getFirestore(app);

// Titles of the sample stories to remove
const sampleStoryTitles = [
  "The Journey Begins",
  "A Silent Night"
];

async function removeSampleStories() {
  try {
    console.log("Removing sample stories...");
    
    // Get all stories
    const storiesCollection = collection(db, "stories");
    const querySnapshot = await getDocs(storiesCollection);
    
    // Track how many stories we remove
    let removedCount = 0;
    
    // Check each story
    for (const docSnapshot of querySnapshot.docs) {
      const storyData = docSnapshot.data();
      
      // If this is one of our sample stories, remove it
      if (sampleStoryTitles.includes(storyData.title)) {
        console.log(`Removing story: "${storyData.title}" with ID: ${docSnapshot.id}`);
        await deleteDoc(doc(db, "stories", docSnapshot.id));
        removedCount++;
      }
    }
    
    console.log(`Removed ${removedCount} sample stories.`);
    
    // Also remove the sample user if it exists
    console.log("Checking for sample user...");
    const usersCollection = collection(db, "users");
    const userQuery = query(usersCollection, where("email", "==", "admin@example.com"));
    const userQuerySnapshot = await getDocs(userQuery);
    
    let userRemovedCount = 0;
    for (const docSnapshot of userQuerySnapshot.docs) {
      console.log(`Removing sample user with ID: ${docSnapshot.id}`);
      await deleteDoc(doc(db, "users", docSnapshot.id));
      userRemovedCount++;
    }
    
    console.log(`Removed ${userRemovedCount} sample users.`);
    
    console.log("Sample data removal completed!");
  } catch (error) {
    console.error("Error removing sample data: ", error);
  }
}

// Run the removal
await removeSampleStories();