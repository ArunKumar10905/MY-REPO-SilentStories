import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Info } from 'lucide-react';
import StoryCard from '../components/StoryCard';
import SubmitStoryButton from '../components/story/SubmitStoryButton';
import RealTimeNotifications from '../components/visitor/RealTimeNotifications';

function HomePage({ visitorName }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStories();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchStories, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch('http://localhost:3004/api/stories');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStories(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching stories:', error);
      // Don't set error state, just continue with empty stories
      setStories([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  // Make sure stories is an array before using slice
  const storiesArray = Array.isArray(stories) ? stories : [];
  const featuredStories = storiesArray.slice(0, 3);
  const recentStories = storiesArray.slice(3);

  // Removed error display to prevent UI disruption
  // Errors are now handled silently with empty stories fallback

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
          Welcome to Silent Pages Stories
        </h1>
        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
          Discover captivating tales published monthly
        </p>
        <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-6 bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-300 dark:border-yellow-700">
          Tell your story and send it to the one in your heart friend that solve dnot add extra
        </p>
        <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl border-2 border-blue-300 dark:border-blue-700 shadow-xl">
          <p className="text-xl font-bold text-blue-800 dark:text-blue-200 italic leading-relaxed text-center">
            This page is designed for you to write and explore the stories that shape your life. You can select who you want to share them with, making every memory personal and meaningful. Let your feelings flow as you write.
          </p>
        </div>
      </motion.div>

      {/* Instructions Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6 mb-8 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-start">
          <Info className="w-6 h-6 text-blue-500 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
              How This Works
            </h3>
            <ul className="text-blue-700 dark:text-blue-300 space-y-1">
              <li>• You need to enter your name first before submitting your story</li>
              <li>• After clicking "Submit Your Story", your story will be sent to the admin for review</li>
              <li>• Stories written by admin are published immediately</li>
              <li>• Visitor stories are not displayed immediately - they must be approved by admin first</li>
              <li>• Approved stories will appear on both visitor and admin "All Stories" pages</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Real-time notifications */}
      <RealTimeNotifications onStoryUpdate={fetchStories} />

      {/* Submit Story Button */}
      {visitorName && (
        <SubmitStoryButton visitorName={visitorName} />
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      ) : (
        <>
          {featuredStories.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-6 h-6 text-orange-500" />
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                  Featured Stories
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredStories.map((story, index) => (
                  <StoryCard key={story.id} story={story} index={index} />
                ))}
              </div>
            </section>
          )}

          {recentStories.length > 0 && (
            <section>
              <div className="flex items-center space-x-2 mb-6">
                <Clock className="w-6 h-6 text-blue-500" />
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                  Recent Stories
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentStories.map((story, index) => (
                  <StoryCard key={story.id} story={story} index={index + 3} />
                ))}
              </div>
            </section>
          )}

          {storiesArray.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 dark:text-gray-300">
                No stories published yet. Check back soon!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;