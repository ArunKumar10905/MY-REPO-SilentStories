import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Eye, EyeOff, Trash2 } from 'lucide-react';

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

// Safe date parsing for sorting
const parseDate = (dateValue) => {
  try {
    if (!dateValue) return new Date(0);
    
    // Handle Firestore Timestamp objects
    if (dateValue.toDate && typeof dateValue.toDate === 'function') {
      return dateValue.toDate();
    }
    
    if (dateValue instanceof Date) {
      return dateValue;
    }
    
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? new Date(0) : date;
  } catch (error) {
    return new Date(0);
  }
};

function PrivateCommentsPanel({ comments, onDelete }) {
  const [filteredComments, setFilteredComments] = useState(comments);
  const [filter, setFilter] = useState('all'); // 'all', 'private', 'public'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest'

  useEffect(() => {
    let result = [...comments];
    
    // Apply filters
    if (filter === 'private') {
      result = result.filter(comment => comment.is_private);
    } else if (filter === 'public') {
      result = result.filter(comment => !comment.is_private);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const dateA = parseDate(a.created_at);
      const dateB = parseDate(b.created_at);
      
      if (sortBy === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
    
    setFilteredComments(result);
  }, [comments, filter, sortBy]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDelete(id);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by visibility
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Comments</option>
            <option value="private">Private Only</option>
            <option value="public">Public Only</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredComments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-800 dark:text-white">
                    {comment.visitor_name}
                  </h4>
                  {comment.is_private ? (
                    <EyeOff className="w-4 h-4 text-red-500" title="Private comment" />
                  ) : (
                    <Eye className="w-4 h-4 text-green-500" title="Public comment" />
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(comment.created_at)}
                </p>
                {comment.story_title && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    On story: {comment.story_title}
                  </p>
                )}
              </div>
              
              <button
                onClick={() => handleDelete(comment.id)}
                className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            {comment.text && (
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                {comment.text}
              </p>
            )}
            
            {comment.rating && (
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                  Rating:
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < comment.rating
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
        
        {filteredComments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {filter === 'private' 
                ? 'No private comments found.' 
                : filter === 'public' 
                  ? 'No public comments found.' 
                  : 'No comments yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrivateCommentsPanel;