import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock } from 'lucide-react';

function SubmittedStoriesPreview() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmittedStories();
  }, []);

  const fetchSubmittedStories = async () => {
    try {
      const response = await fetch('http://localhost:3004/api/submitted-stories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      // Check if response is ok before parsing JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Get only the 3 most recent pending stories
      const pendingStories = data
        .filter(story => story.status === 'pending')
        .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
        .slice(0, 3);
      
      setStories(pendingStories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching submitted stories:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium text-gray-800 dark:text-white">
          Pending Submissions
        </h3>
      </div>
      
      {stories.length > 0 ? (
        <div className="space-y-3">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <h4 className="font-medium text-gray-800 dark:text-white text-sm truncate">
                {story.title}
              </h4>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  by {story.author}
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{new Date(story.submitted_at).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">
          No pending submissions
        </p>
      )}
    </div>
  );
}

export default SubmittedStoriesPreview;