import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

// Safe date formatting function
const formatDate = (dateValue) => {
  try {
    if (!dateValue) return 'Date not available';
    
    // Handle Firestore Timestamp objects
    let date;
    if (dateValue.toDate && typeof dateValue.toDate === 'function') {
      date = dateValue.toDate();
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else {
      date = new Date(dateValue);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return format(date, 'MMM dd, yyyy HH:mm');
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Date not available';
  }
};

function CommentsPanel({ comments, onDelete }) {
  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      {comments.map((comment, index) => (
        <motion.div
          key={comment.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 }}
          className="p-4 bg-secondary-50 dark:bg-secondary-700 rounded-lg"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-medium text-secondary-800 dark:text-white">
                {comment.visitor_name}
              </p>
              <p className="text-sm text-secondary-600 dark:text-secondary-300">
                on "{comment.story_title}"
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {comment.rating && (
                <div className="flex">
                  {[...Array(comment.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(comment.id)}
                className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          {comment.text && (
            <p className="text-secondary-700 dark:text-secondary-300 text-sm mb-2">
              {comment.text}
            </p>
          )}
          <p className="text-xs text-secondary-500 dark:text-secondary-400">
            {formatDate(comment.created_at)}
          </p>
        </motion.div>
      ))}
      {comments.length === 0 && (
        <p className="text-center text-secondary-600 dark:text-secondary-300 py-8">
          No comments yet
        </p>
      )}
    </div>
  );
}

export default CommentsPanel;
