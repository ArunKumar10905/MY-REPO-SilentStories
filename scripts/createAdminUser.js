const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');

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
const auth = getAuth(app);

async function createAdminUser(email, password) {
  try {
    console.log("Creating admin user...");
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log("Admin user created successfully!");
    console.log("User ID:", user.uid);
    console.log("Email:", user.email);
    console.log("\nIMPORTANT: Save these credentials securely!");
    console.log("You can now use these credentials to log into the admin panel.");
    
  } catch (error) {
    console.error("Error creating admin user:", error);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log("User already exists. Try a different email.");
    } else if (error.code === 'auth/invalid-email') {
      console.log("Invalid email address.");
    } else if (error.code === 'auth/weak-password') {
      console.log("Password should be at least 6 characters.");
    } else {
      console.log("Please check your Firebase configuration and try again.");
    }
  }
}

// Get email and password from command line arguments
const args = process.argv.slice(2);
const email = args[0];
const password = args[1];

if (!email || !password) {
  console.log("Usage: node scripts/createAdminUser.js <email> <password>");
  console.log("Example: node scripts/createAdminUser.js admin@example.com securePassword123");
  process.exit(1);
}

createAdminUser(email, password);