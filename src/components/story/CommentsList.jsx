import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, EyeOff, Reply, ThumbsUp, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import CommentForm from './CommentForm';

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

function CommentsList({ comments, storyId, visitorName, onCommentSubmit }) {
  const [replyingTo, setReplyingTo] = useState(null);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, mostLiked, mostVoted
  const [likedComments, setLikedComments] = useState(() => {
    return JSON.parse(localStorage.getItem('likedComments') || '[]');
  });
  const [votedComments, setVotedComments] = useState(() => {
    return JSON.parse(localStorage.getItem('votedComments') || '{}');
  });

  // Filter out private comments for regular users
  const publicComments = comments.filter(comment => !comment.is_private);
  
  // Organize comments into threads (parent comments and their replies)
  const organizeComments = (comments) => {
    const parentComments = comments.filter(c => !c.reply_to);
    const replies = comments.filter(c => c.reply_to);
    
    return parentComments.map(parent => ({
      ...parent,
      replies: replies.filter(r => r.reply_to === parent.id)
    }));
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

  const organizedComments = useMemo(() => {
    const organized = organizeComments(publicComments);
    
    // Sort based on selected option
    return [...organized].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return parseDate(a.created_at) - parseDate(b.created_at);
        case 'mostLiked':
          return (b.likes || 0) - (a.likes || 0);
        case 'mostVoted':
          const scoreA = (a.upvotes || 0) - (a.downvotes || 0);
          const scoreB = (b.upvotes || 0) - (b.downvotes || 0);
          return scoreB - scoreA;
        case 'newest':
        default:
          return parseDate(b.created_at) - parseDate(a.created_at);
      }
    });
  }, [publicComments, sortBy]);

  const handleLike = async (commentId) => {
    if (likedComments.includes(commentId)) return; // Already liked
    
    try {
      const response = await fetch(`http://localhost:3004/api/comments/${commentId}/like`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const updated = [...likedComments, commentId];
        setLikedComments(updated);
        localStorage.setItem('likedComments', JSON.stringify(updated));
        onCommentSubmit();
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleVote = async (commentId, voteType) => {
    const voteKey = `${commentId}_${voteType}`;
    if (votedComments[voteKey]) return; // Already voted
    
    try {
      const response = await fetch(`http://localhost:3004/api/comments/${commentId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType })
      });
      
      if (response.ok) {
        const updated = { ...votedComments, [voteKey]: true };
        setVotedComments(updated);
        localStorage.setItem('votedComments', JSON.stringify(updated));
        onCommentSubmit();
      }
    } catch (error) {
      console.error('Error voting on comment:', error);
    }
  };

  const CommentItem = ({ comment, isReply = false }) => {
    const isLiked = likedComments.includes(comment.id);
    const hasUpvoted = votedComments[`${comment.id}_upvote`];
    const hasDownvoted = votedComments[`${comment.id}_downvote`];
    
    return (
      <div className={`${isReply ? 'ml-8 mt-4 border-l-2 border-gray-300 dark:border-gray-600 pl-4' : ''}`}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <p className="font-medium text-gray-800 dark:text-white">
                  {comment.visitor_name}
                </p>
                {comment.is_private && (
                  <EyeOff className="w-4 h-4 text-red-500" title="Private comment" />
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(comment.created_at)}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {comment.rating && (
                <div className="flex">
                  {[...Array(comment.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {comment.text && (
            <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">
              {comment.text}
            </p>
          )}

          <div className="flex items-center space-x-4">
            {/* Like button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleLike(comment.id)}
              disabled={isLiked}
              className={`flex items-center space-x-1 text-sm ${
                isLiked 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{comment.likes || 0}</span>
            </motion.button>

            {/* Voting buttons */}
            <div className="flex items-center space-x-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleVote(comment.id, 'upvote')}
                disabled={hasUpvoted}
                className={`p-1 rounded ${
                  hasUpvoted 
                    ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400'
                }`}
              >
                <ChevronUp className="w-4 h-4" />
              </motion.button>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {(comment.upvotes || 0) - (comment.downvotes || 0)}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleVote(comment.id, 'downvote')}
                disabled={hasDownvoted}
                className={`p-1 rounded ${
                  hasDownvoted 
                    ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Reply button */}
            {!isReply && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Reply className="w-4 h-4" />
                <span>Reply</span>
              </motion.button>
            )}
          </div>

          {/* Reply form */}
          {replyingTo === comment.id && (
            <div className="mt-4">
              <CommentForm
                storyId={storyId}
                visitorName={visitorName}
                onCommentSubmit={onCommentSubmit}
                replyTo={comment.id}
                onCancelReply={() => setReplyingTo(null)}
              />
            </div>
          )}
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Sort options */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {publicComments.length} {publicComments.length === 1 ? 'Comment' : 'Comments'}
        </h3>
        <div className="flex items-center space-x-2">
          <ArrowUpDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="mostLiked">Most Liked</option>
            <option value="mostVoted">Most Voted</option>
          </select>
        </div>
      </div>

      {organizedComments.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        organizedComments.map((comment) => (
          <div key={comment.id}>
            <CommentItem comment={comment} />
            {/* Render replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-2">
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} isReply={true} />
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default CommentsList;
