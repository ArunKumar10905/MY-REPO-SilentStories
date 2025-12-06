#!/usr/bin/env node

/**
 * Script to fix corrupted stories in the database
 * 
 * This script identifies and attempts to repair stories with corrupted content.
 * 
 * BACKUP YOUR FIRESTORE DATABASE BEFORE RUNNING THIS SCRIPT!
 * 
 * Usage:
 *   node tools/fixCorruptedStories.js
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, getDoc, updateDoc, doc, query, where } from 'firebase/firestore';

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

// Collections
const storiesCollection = collection(db, 'stories');
const submittedStoriesCollection = collection(db, 'submitted_stories');

async function findCorruptedStories() {
  console.log('Searching for corrupted stories...');
  
  try {
    const querySnapshot = await getDocs(storiesCollection);
    const corruptedStories = [];
    
    querySnapshot.forEach((doc) => {
      const storyData = doc.data();
      
      // Check for corrupted content patterns
      if (
        !storyData.content ||
        storyData.content === '' ||
        storyData.content === 'A A A' ||
        storyData.content === 'A'
      ) {
        corruptedStories.push({
          id: doc.id,
          ...storyData
        });
      }
    });
    
    console.log(`Found ${corruptedStories.length} corrupted stories`);
    return corruptedStories;
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
}

async function findOriginalSubmission(sourceId) {
  if (!sourceId) return null;
  
  try {
    const docRef = doc(db, 'submitted_stories', sourceId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching submitted story:', error);
    return null;
  }
}

async function repairStory(story) {
  console.log(`Attempting to repair story ID: ${story.id}`);
  
  // Try to find the original submission
  const sourceId = story.source_submitted_id || story.original_id;
  if (sourceId) {
    const originalSubmission = await findOriginalSubmission(sourceId);
    
    if (originalSubmission) {
      // Extract content from various possible fields
      const content = originalSubmission.content || 
                     originalSubmission.story || 
                     originalSubmission.text || 
                     originalSubmission.body || 
                     originalSubmission.content_html || 
                     null;
                     
      if (content) {
        try {
          const docRef = doc(db, 'stories', story.id);
          await updateDoc(docRef, {
            content: content,
            status: 'repaired'
          });
          
          console.log(`Successfully repaired story ID: ${story.id} using original submission`);
          return true;
        } catch (error) {
          console.error(`Error updating story ID: ${story.id}`, error);
        }
      } else {
        console.log(`No valid content found in original submission for story ID: ${story.id}`);
      }
    } else {
      console.log(`Original submission not found for story ID: ${story.id}`);
    }
  }
  
  // If we can't repair from original submission, mark for manual review
  try {
    const docRef = doc(db, 'stories', story.id);
    await updateDoc(docRef, {
      status: 'needs_manual_review',
      repair_notes: 'Content was corrupted and original submission could not be located or had no content'
    });
    
    console.log(`Marked story ID: ${story.id} for manual review`);
    return true;
  } catch (error) {
    console.error(`Error marking story ID: ${story.id} for manual review`, error);
    return false;
  }
}

async function main() {
  console.log('=== Story Repair Tool ===');
  console.log('WARNING: Backup your Firestore database before running this script!');
  console.log('');
  
  const corruptedStories = await findCorruptedStories();
  
  if (corruptedStories.length === 0) {
    console.log('No corrupted stories found. Database is clean.');
    return;
  }
  
  console.log('');
  console.log('Corrupted stories found:');
  corruptedStories.forEach(story => {
    console.log(`  - ID: ${story.id}, Title: ${story.title || 'Untitled'}`);
  });
  
  console.log('');
  console.log('Starting repair process...');
  
  let repairedCount = 0;
  let failedCount = 0;
  
  for (const story of corruptedStories) {
    try {
      const repaired = await repairStory(story);
      if (repaired) {
        repairedCount++;
      } else {
        failedCount++;
      }
    } catch (error) {
      console.error(`Error repairing story ID: ${story.id}`, error);
      failedCount++;
    }
  }
  
  console.log('');
  console.log('=== Repair Summary ===');
  console.log(`Successfully repaired: ${repairedCount}`);
  console.log(`Failed to repair: ${failedCount}`);
  console.log(`Total processed: ${corruptedStories.length}`);
  
  if (failedCount > 0) {
    console.log('');
    console.log('Some stories could not be automatically repaired and have been marked for manual review.');
  }
}

// Run the script
main().catch(console.error);