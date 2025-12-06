import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

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

// Sample data
const sampleStories = [
  {
    title: "The Journey Begins",
    content: "Once upon a time, in a land far away, there lived a young adventurer...",
    category: "Adventure",
    tags: "adventure,fantasy",
    publish_date: new Date().toISOString(),
    views: 0,
    likes: 0
  },
  {
    title: "A Silent Night",
    content: "The moon cast its gentle light over the quiet village...",
    category: "Fiction",
    tags: "fiction,drama",
    publish_date: new Date().toISOString(),
    views: 0,
    likes: 0
  }
];

const sampleUsers = [
  {
    email: "admin@example.com",
    role: "admin",
    created_at: new Date().toISOString()
  }
];

async function initializeDatabase() {
  try {
    console.log("Initializing Firebase database...");
    
    // Add sample stories
    for (const story of sampleStories) {
      const docRef = await addDoc(collection(db, "stories"), story);
      console.log("Added story with ID: ", docRef.id);
    }
    
    // Add sample users
    for (const user of sampleUsers) {
      const docRef = await addDoc(collection(db, "users"), user);
      console.log("Added user with ID: ", docRef.id);
    }
    
    console.log("Database initialization completed!");
  } catch (error) {
    console.error("Error initializing database: ", error);
  }
}

// Run the initialization
await initializeDatabase();