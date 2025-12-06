/**
 * Integration test for the full story flow:
 * 1. Visitor submits a story
 * 2. Admin approves the story
 * 3. Published story is fetched and verified
 */

import { expect, test, describe, beforeAll, afterAll } from '@jest/globals';
import fetch from 'node-fetch';

// Test configuration
const BASE_URL = 'http://localhost:3004';
const ADMIN_TOKEN = 'admin-token-1'; // Mock token for testing

// Test data
const testStory = {
  title: 'Test Story for Integration',
  author: 'Test Author',
  dedication: 'To my testers',
  content: '<p>This is a test story content for integration testing.</p><p>It has multiple paragraphs.</p>',
  category: 'Test'
};

describe('Story Submission and Approval Flow', () => {
  let submittedStoryId;
  let publishedStoryId;

  beforeAll(async () => {
    // Ensure server is running
    try {
      const healthResponse = await fetch(`${BASE_URL}/api/health`);
      const healthData = await healthResponse.json();
      expect(healthData.status).toBe('OK');
    } catch (error) {
      throw new Error('Server is not running. Please start the server before running tests.');
    }
  });

  test('1. Visitor can submit a story', async () => {
    const response = await fetch(`${BASE_URL}/api/submit-story`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testStory)
    });

    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.message).toBe('Story submitted successfully');
    expect(data.id).toBeDefined();
    
    submittedStoryId = data.id;
  });

  test('2. Admin can approve the submitted story', async () => {
    // First, verify the story exists in submitted stories
    const submittedStoriesResponse = await fetch(`${BASE_URL}/api/submitted-stories`, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      }
    });

    expect(submittedStoriesResponse.status).toBe(200);
    
    const submittedStories = await submittedStoriesResponse.json();
    const submittedStory = submittedStories.find(story => story.id === submittedStoryId);
    expect(submittedStory).toBeDefined();
    expect(submittedStory.title).toBe(testStory.title);

    // Approve the story
    const approveResponse = await fetch(`${BASE_URL}/api/submitted-stories/${submittedStoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify({
        status: 'approved'
      })
    });

    expect(approveResponse.status).toBe(200);
    
    const approvedData = await approveResponse.json();
    expect(approvedData.status).toBe('approved');
  });

  test('3. Published story can be fetched and has correct content', async () => {
    // Wait a moment for the story to be processed
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get all stories and find the newly published one
    const storiesResponse = await fetch(`${BASE_URL}/api/stories`);
    expect(storiesResponse.status).toBe(200);
    
    const stories = await storiesResponse.json();
    const publishedStory = stories.find(story => 
      story.title === testStory.title && 
      story.source_submitted_id === submittedStoryId
    );
    
    expect(publishedStory).toBeDefined();
    expect(publishedStory.id).toBeDefined();
    expect(publishedStory.content).toBe(testStory.content);
    expect(publishedStory.category).toBe(testStory.category);
    expect(publishedStory.views).toBe(0);
    expect(publishedStory.likes).toBe(0);
    expect(publishedStory.comments_count).toBe(0);
    expect(publishedStory.source_submitted_id).toBe(submittedStoryId);
    
    publishedStoryId = publishedStory.id;
  });

  test('4. Published story can be fetched by ID', async () => {
    const storyResponse = await fetch(`${BASE_URL}/api/stories/${publishedStoryId}`);
    expect(storyResponse.status).toBe(200);
    
    const story = await storyResponse.json();
    expect(story.id).toBe(publishedStoryId);
    expect(story.title).toBe(testStory.title);
    expect(story.content).toBe(testStory.content);
    expect(story.category).toBe(testStory.category);
  });

  // Cleanup
  afterAll(async () => {
    // In a real test environment, you might want to clean up test data
    // For now, we'll just log that cleanup would happen
    console.log('Test completed. In a production environment, we would clean up test data here.');
  });
});