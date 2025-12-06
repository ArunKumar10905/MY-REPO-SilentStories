import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Eye, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

function StoryCard({ story, index }) {
  // Function to safely format date
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Unknown date';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Encode the story ID for URL safety
  const getEncodedId = () => {
    if (!story || !story.id) return '';
    return encodeURIComponent(story.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Link to={`/story/${getEncodedId()}`}>
        <div className="card p-6 h-full hover:border-primary-300 dark:hover:border-primary-600">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-secondary-800 dark:text-white group-hover:text-primary-500 transition-colors line-clamp-2">
              {story.title}
            </h3>
            {story.category && (
              <span className="ml-2 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full whitespace-nowrap">
                {story.category}
              </span>
            )}
          </div>

          <div className="text-secondary-600 dark:text-secondary-300 mb-4 line-clamp-3">
            {story.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
          </div>

          <div className="flex items-center justify-between text-sm text-secondary-500 dark:text-secondary-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(story.publish_date)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{story.views || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{story.comments_count || 0}</span>
              </div>
            </div>
          </div>

          {story.tags && story.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {story.tags.split(',').slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 text-xs rounded"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default StoryCard;