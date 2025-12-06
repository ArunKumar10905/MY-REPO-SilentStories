import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReadingProgress from '../components/story/ReadingProgress';
import StoryHeader from '../components/story/StoryHeader';
import ReadingControls from '../components/story/ReadingControls';
import StoryContent from '../components/story/StoryContent';
import CommentForm from '../components/story/CommentForm';
import CommentsList from '../components/story/CommentsList';
import { Heart, Share2, User } from 'lucide-react';

function StoryPage({ visitorName, setShowNameModal }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState('medium');
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showVisitorName, setShowVisitorName] = useState(false);
  const [reactions, setReactions] = useState({});

  // Decode the story ID from URL params
  const decodedId = decodeURIComponent(id);

  useEffect(() => {
    if (!visitorName) {
      setShowNameModal(true);
      navigate('/');
      return;
    }
    fetchStory();
    fetchComments();
    checkBookmark();
    checkLike();
    
    // Check if visitor has previously chosen to show their name
    const showNamePreference = localStorage.getItem(`showNameInStory_${decodedId}_${visitorName}`);
    if (showNamePreference === 'true') {
      setShowVisitorName(true);
    }
  }, [id, visitorName]);

  const fetchStory = async () => {
    try {
      const response = await fetch(`http://localhost:3004/api/stories/${decodedId}`);
      const data = await response.json();
      setStory(data);
      setLikes(data.likes || 0);
      setReactions(data.reactions || {});
    } catch (error) {
      console.error('Error fetching story:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:3004/api/comments?storyId=${decodedId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const checkBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarked(bookmarks.includes(decodedId));
  };

  const checkLike = () => {
    const likedStories = JSON.parse(localStorage.getItem('likedStories') || '[]');
    setLiked(likedStories.includes(decodedId));
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    if (bookmarked) {
      const updated = bookmarks.filter(b => b !== decodedId);
      localStorage.setItem('bookmarks', JSON.stringify(updated));
      setBookmarked(false);
    } else {
      bookmarks.push(decodedId);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      setBookmarked(true);
    }
  };

  const handleLike = () => {
    const likedStories = JSON.parse(localStorage.getItem('likedStories') || '[]');
    if (liked) {
      const updated = likedStories.filter(l => l !== decodedId);
      localStorage.setItem('likedStories', JSON.stringify(updated));
      setLiked(false);
      setLikes(prev => prev - 1);
    } else {
      likedStories.push(decodedId);
      localStorage.setItem('likedStories', JSON.stringify(likedStories));
      setLiked(true);
      setLikes(prev => prev + 1);
      
      // Update likes on server
      fetch(`http://localhost:3004/api/stories/${decodedId}/like`, {
        method: 'POST'
      }).catch(err => console.log('Failed to update likes on server'));
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleEmojiReaction = async (emojiType) => {
    try {
      const response = await fetch(`http://localhost:3004/api/stories/${decodedId}/reaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji: emojiType })
      });
      
      if (response.ok) {
        const data = await response.json();
        setReactions(data.reactions || {});
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const toggleVisitorNameDisplay = () => {
    const newValue = !showVisitorName;
    setShowVisitorName(newValue);
    localStorage.setItem(`showNameInStory_${decodedId}_${visitorName}`, newValue.toString());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Story not found
        </p>
      </div>
    );
  }

  // Modify story content to include visitor name if option is enabled
  const storyContentWithVisitorName = showVisitorName && visitorName 
    ? `<p class="text-center text-gray-600 dark:text-gray-400 mb-4"><em>Reading as: ${visitorName}</em></p>${story.content}`
    : story.content;

  return (
    <div className="max-w-4xl mx-auto">
      <ReadingProgress />

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 mb-8"
      >
        <StoryHeader story={story} commentsCount={comments.length} />
        <ReadingControls
          fontSize={fontSize}
          setFontSize={setFontSize}
          bookmarked={bookmarked}
          onBookmark={handleBookmark}
          onShare={handleShare}
        />
        
        {/* Option to display visitor name in story content */}
        {visitorName && (
          <div className="flex items-center justify-center my-4">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={showVisitorName}
                  onChange={toggleVisitorNameDisplay}
                />
                <div className={`block w-10 h-6 rounded-full ${showVisitorName ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showVisitorName ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <div className="ml-3 flex items-center text-gray-700 dark:text-gray-300">
                <User className="w-4 h-4 mr-1" />
                <span>Show my name while reading</span>
              </div>
            </label>
          </div>
        )}
        
        <StoryContent content={storyContentWithVisitorName} fontSize={fontSize} />
        
        {/* Like button and Emoji Reactions */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                liked 
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span>{likes} Likes</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-900/70 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </motion.button>
          </div>

          {/* Emoji Reactions */}
          <div className="flex flex-col items-center space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">How did this story make you feel?</p>
            <div className="flex items-center space-x-3">
              {[
                { emoji: '😍', label: 'love', name: 'Love' },
                { emoji: '😢', label: 'sad', name: 'Sad' },
                { emoji: '😂', label: 'funny', name: 'Funny' },
                { emoji: '🤔', label: 'think', name: 'Thoughtful' },
                { emoji: '👏', label: 'clap', name: 'Applause' }
              ].map(({ emoji, label, name }) => (
                <motion.button
                  key={label}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEmojiReaction(label)}
                  className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  title={name}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                    {reactions[label] || 0}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Personalized message at the end */}
        {visitorName && (
          <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
            <p>Thank you for reading, {visitorName}!</p>
            <p className="mt-2">Have a nice day, take care!</p>
          </div>
        )}
      </motion.article>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Comments & Reviews
        </h2>

        <CommentForm
          storyId={decodedId}
          visitorName={visitorName}
          onCommentSubmit={fetchComments}
        />

        <CommentsList 
          comments={comments} 
          storyId={decodedId}
          visitorName={visitorName}
          onCommentSubmit={fetchComments}
        />
      </motion.section>
    </div>
  );
}

export default StoryPage;