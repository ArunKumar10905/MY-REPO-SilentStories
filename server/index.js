import express from 'express';
import cors from 'cors';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
// Import Firebase functions
import { getStories, createStory, updateStory, deleteStory, getComments, createComment, deleteComment, getSubmittedStories, createSubmittedStory, updateSubmittedStory, getUsers, getStoryById } from './firebase.js';

dotenv.config();

const app = express();
const PORT = 3004; // Changed from 3003 to avoid conflict

// Mock data storage
let admins = [
  { id: 1, username: 'ArunKumar', password_hash: '$2a$10$rOzJqQZ8QxQZ8QxQZ8QxQeO/O3hK8Pv/YjW8hK8Pv/YjW8hK8Pv/Yi', created_at: new Date(), last_login: null }
];

let stories = [
  {
    id: 1,
    title: 'Monthly Story — September',
    content: '<h2>The Coffee Shop at Dawn</h2><p>The first rays of sunlight filtered through the window of the small coffee shop on the corner of Fifth and Main. Sarah had been coming here every morning for the past three years, always ordering the same thing: a medium latte with an extra shot.</p><p>But today was different. Today, she noticed something she had never seen before...</p><p>The barista, whose name tag read "Michael," had been watching her with a curious expression. When their eyes met, he smiled and said something that would change everything.</p><p>"I\'ve been wanting to tell you something for a long time," he began, his voice barely above a whisper. "Every morning, I make your coffee with a little extra care. Not because it\'s my job, but because your smile when you take that first sip makes my entire day worthwhile."</p><p>Sarah felt her cheeks flush. In three years of routine, she had never truly seen him. But now, in this moment, everything was different.</p><p>"Would you like to stay for a while?" he asked, gesturing to a small table by the window. "I\'d love to hear your story."</p><p>And so, over coffee and conversation, two strangers became something more. Sometimes, the most beautiful stories begin in the most ordinary places.</p>',
    category: 'Real life',
    tags: 'romance, coffee, morning, connection',
    publish_date: new Date().toISOString(),
    views: 0,
    likes: 0, // Added likes field
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    comments_count: 0
  }
];

let comments = [];

// Initialize with empty visitor sessions instead of default John Doe
let visitor_sessions = [];

// Mock data for visitor-submitted stories
let submitted_stories = [];

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for mobile compatibility
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Auth middleware
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.substring(7);
  // In production, verify JWT token properly
  next();
};

// Helper function to find admin by username
function findAdminByUsername(username) {
  return admins.find(admin => admin.username === username);
}

// Helper function to find story by ID
function findStoryById(id) {
  return stories.find(story => story.id === parseInt(id));
}

// Helper function to find comments by story ID
function findCommentsByStoryId(storyId) {
  return comments.filter(comment => comment.story_id === parseInt(storyId));
}

// Admin routes
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const admin = findAdminByUsername(username);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // For demo purposes, we'll accept the hardcoded credentials
    // In a real application, we would use bcrypt.compare
    if (username === 'ArunKumar' && password === '10092005') {
      // Update last login
      admin.last_login = new Date();
      
      res.json({ 
        token: 'admin-token-' + admin.id,
        message: 'Login successful'
      });
      return;
    }
    
    // Fallback to bcrypt comparison for other cases
    const validPassword = await bcrypt.compare(password, admin.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    admin.last_login = new Date();
    
    res.json({ 
      token: 'admin-token-' + admin.id,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/change-password', requireAuth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  
  try {
    const admin = admins[0]; // Get the first admin
    
    const validPassword = await bcrypt.compare(oldPassword, admin.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Old password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password_hash = hashedPassword;
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// API Routes
app.get('/api/stories', async (req, res) => {
  try {
    const stories = await getStories();
    res.json(stories);
  } catch (error) {
    console.error('Stories fetch error:', error);
    // Send empty array as fallback instead of error
    res.json([]);
  }
});

app.get('/api/stories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Decode the ID in case it was URL-encoded
    const decodedId = decodeURIComponent(id);
    console.log('Story ID received by server:', id); // Debug log
    console.log('Decoded story ID:', decodedId); // Debug log
    const story = await getStoryById(decodedId);
    console.log('Story fetched from Firebase:', story); // Debug log
    res.json(story);
  } catch (error) {
    console.error('Story fetch error:', error);
    res.status(404).json({ error: 'Story not found' });
  }
});

app.post('/api/stories', requireAuth, async (req, res) => {
  try {
    const storyData = {
      ...req.body,
      publish_date: new Date(), // Use Date object instead of string
      views: 0,
      likes: 0
    };
    
    const newStory = await createStory(storyData);
    
    // Add real-time event for admin notification
    addRealTimeEvent({
      type: 'new_story',
      message: `New story published: "${newStory.title}"`,
      data: { storyId: newStory.id }
    });
    
    res.json(newStory);
  } catch (error) {
    console.error('Story creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/stories/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const storyData = req.body;
    
    const updatedStory = await updateStory(id, storyData);
    
    res.json(updatedStory);
  } catch (error) {
    console.error('Story update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/stories/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete the story from Firebase
    const result = await deleteStory(id);
    
    // Add real-time event for admin notification
    addRealTimeEvent({
      type: 'story_deleted',
      message: `Story was deleted`,
      data: { storyId: id }
    });
    
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Story delete error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add like endpoint for stories
app.post('/api/stories/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the story from Firebase
    const story = await getStoryById(id);
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    // Increment likes (this is just for demo - in a real app you'd track who liked what)
    const updatedLikes = (story.likes || 0) + 1;
    
    // Update the story in Firebase
    await updateStory(id, { likes: updatedLikes });
    
    // Add real-time event for admin notification
    addRealTimeEvent({
      type: 'story_like',
      message: `Story "${story.title}" received a like`,
      data: { storyId: id }
    });
    
    res.json({ likes: updatedLikes });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Comment routes
app.get('/api/comments', async (req, res) => {
  const { storyId } = req.query;
  
  try {
    const comments = await getComments(storyId);
    
    // Filter out private comments for public API
    const publicComments = comments.filter(comment => !comment.is_private);
    
    // Sort by created date descending
    publicComments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Add story title to each comment
    const commentsWithStoryTitle = publicComments.map(comment => {
      // Note: In a real implementation, you would fetch the story title from Firebase
      return {
        ...comment,
        story_title: 'Unknown Story'
      };
    });
    
    res.json(commentsWithStoryTitle);
  } catch (error) {
    console.error('Comments fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin-only route to get all comments (including private ones)
app.get('/api/admin/comments', requireAuth, async (req, res) => {
  try {
    const comments = await getComments();
    
    // Sort by created date descending
    comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Add story title to each comment
    const commentsWithStoryTitle = comments.map(comment => {
      // Note: In a real implementation, you would fetch the story title from Firebase
      return {
        ...comment,
        story_title: 'Unknown Story'
      };
    });
    
    res.json(commentsWithStoryTitle);
  } catch (error) {
    console.error('Comments fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/comments', async (req, res) => {
  const { storyId, visitorName, text, rating, isPrivate } = req.body;
  
  try {
    // Update or insert visitor session
    let visitorSession = visitor_sessions.find(v => v.name === visitorName);
    if (visitorSession) {
      visitorSession.last_active = new Date();
    } else {
      visitorSession = {
        id: visitor_sessions.length + 1,
        name: visitorName,
        last_active: new Date()
      };
      visitor_sessions.push(visitorSession);
    }
    
    const newComment = {
      story_id: storyId, // Keep as string to match Firebase storage
      visitor_name: visitorName,
      text,
      rating: parseInt(rating),
      is_private: isPrivate || false,
      created_at: new Date()
    };
    
    const createdComment = await createComment(newComment);
    
    // Add real-time event for admin notification
    // Note: In a real implementation, you would fetch the story title from Firebase
    addRealTimeEvent({
      type: 'new_comment',
      message: `${visitorName} commented on "a story"`,
      data: { commentId: createdComment.id, storyId: storyId }
    });
    
    res.json(createdComment);
  } catch (error) {
    console.error('Comment creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/comments/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  
  try {
    await deleteComment(id);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('Comment delete error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User routes
app.get('/api/users', requireAuth, async (req, res) => {
  try {
    const users = await getUsers();
    
    // Add comment count to each visitor
    const usersWithCommentCount = users.map(visitor => {
      // Note: In a real implementation, you would fetch comments from Firebase
      return {
        ...visitor,
        comment_count: 0
      };
    });
    
    // Sort by last active descending
    usersWithCommentCount.sort((a, b) => new Date(b.last_active) - new Date(a.last_active));
    
    res.json(usersWithCommentCount);
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Real-time visitor data endpoint
app.get('/api/realtime-visitors', (req, res) => {
  try {
    // Get active visitors (last active within last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const activeVisitors = visitor_sessions.filter(visitor => 
      new Date(visitor.last_active) > fiveMinutesAgo
    );
    
    // Add comment count to each visitor
    const activeVisitorsWithCommentCount = activeVisitors.map(visitor => {
      const visitorComments = comments.filter(c => c.visitor_name === visitor.name);
      return {
        ...visitor,
        comment_count: visitorComments.length
      };
    });
    
    // Sort by last active descending
    activeVisitorsWithCommentCount.sort((a, b) => new Date(b.last_active) - new Date(a.last_active));
    
    res.json({
      active_visitors: activeVisitorsWithCommentCount,
      total_visitors: visitor_sessions.length
    });
  } catch (error) {
    console.error('Real-time visitors fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submitted stories routes
app.get('/api/submitted-stories', requireAuth, async (req, res) => {
  try {
    const submittedStories = await getSubmittedStories();
    
    // Sort by submission date descending
    submittedStories.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
    
    res.json(submittedStories);
  } catch (error) {
    console.error('Submitted stories fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/submit-story', async (req, res) => {
  const { title, author, email, dedication, content, category } = req.body;
  
  // Validation
  if (!title || !author || !content) {
    return res.status(400).json({ error: 'Title, author, and content are required' });
  }
  
  try {
    const newSubmission = {
      title,
      author,
      email: email || '', // Add email field (optional)
      dedication: dedication || '',
      content,
      category: category || '',
      submitted_at: new Date(),
      status: 'pending'
    };
    
    const createdSubmission = await createSubmittedStory(newSubmission);
    
    // Add real-time event for admin notification
    addRealTimeEvent({
      type: 'story_submission',
      message: `New story submission: "${title}" by ${author}`,
      data: { submissionId: createdSubmission.id }
    });
    
    res.json({ message: 'Story submitted successfully', id: createdSubmission.id });
  } catch (error) {
    console.error('Story submission error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/submitted-stories/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedSubmission = await updateSubmittedStory(id, updateData);
    
    // Handle different statuses
    if (updateData.status === 'approved') {
      // Extract content from various possible fields to handle inconsistencies
      const content = updatedSubmission.content || 
                     updatedSubmission.story || 
                     updatedSubmission.text || 
                     updatedSubmission.body || 
                     updatedSubmission.content_html || 
                     '';
      
      // Validate that we have content
      if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'Cannot approve story with empty content' });
      }
      
      const newStory = {
        title: updatedSubmission.title || 'Untitled Story',
        content: content,
        category: updatedSubmission.category || '',
        tags: '',
        publish_date: new Date(),
        views: 0,
        likes: 0,
        created_at: new Date(),
        updated_at: new Date(),
        comments_count: 0,
        // Reference to the original submission for repair purposes
        source_submitted_id: id
      };
      
      const createdStory = await createStory(newStory);
      
      // Add real-time event for admin notification
      addRealTimeEvent({
        type: 'story_approved',
        message: `Story "${updatedSubmission.title || 'Untitled'}" was approved and published`,
        data: { storyId: createdStory.id }
      });
    } else if (updateData.status === 'rejected') {
      // Add real-time event for admin notification
      addRealTimeEvent({
        type: 'story_rejected',
        message: `Story "${updatedSubmission.title || 'Untitled'}" was rejected`,
        data: { submissionId: id }
      });
    }

    res.json(updatedSubmission);
  } catch (error) {
    console.error('Submitted story update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/submitted-stories/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Note: In a real implementation, you would delete the submitted story from Firebase
    res.json({ message: 'Submitted story deleted' });
  } catch (error) {
    console.error('Submitted story delete error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Analytics routes
app.get('/api/analytics', requireAuth, (req, res) => {
  try {
    const totalViews = stories.reduce((sum, story) => sum + story.views, 0);
    const totalComments = comments.length;
    const totalVisitors = visitor_sessions.length;
    const totalSubmittedStories = submitted_stories.length;
    
    res.json({
      totalViews,
      totalComments,
      totalVisitors,
      totalSubmittedStories
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', database: 'mock data' });
});

// Store real-time events for admin dashboard
let real_time_events = [];

// Helper function to add real-time events
function addRealTimeEvent(event) {
  const eventWithTimestamp = {
    id: real_time_events.length + 1,
    ...event,
    timestamp: new Date()
  };
  
  real_time_events.push(eventWithTimestamp);
  
  // Keep only the last 50 events to prevent memory issues
  if (real_time_events.length > 50) {
    real_time_events.shift();
  }
}

// Endpoint for admin to get real-time events
app.get('/api/admin/realtime-events', requireAuth, (req, res) => {
  try {
    // Sort by timestamp descending (newest first)
    const sortedEvents = [...real_time_events].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    res.json(sortedEvents);
  } catch (error) {
    console.error('Real-time events fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Endpoint for visitors to get real-time events (filtered)
app.get('/api/realtime-events', (req, res) => {
  try {
    // Filter events to only show public events to visitors
    const publicEvents = real_time_events.filter(event => 
      ['story_approved', 'story_update'].includes(event.type)
    );
    
    // Sort by timestamp descending (newest first)
    const sortedEvents = [...publicEvents].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    res.json(sortedEvents);
  } catch (error) {
    console.error('Real-time events fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});