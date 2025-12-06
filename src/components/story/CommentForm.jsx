import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Eye, EyeOff, Eye as EyeIcon, X } from 'lucide-react';

function CommentForm({ storyId, visitorName, onCommentSubmit, replyTo = null, onCancelReply = null }) {
  const [rating, setRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const MAX_CHARS = 1000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() && rating === 0) return;
    if (commentText.length > MAX_CHARS) return;

    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:3004/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyId,
          visitorName,
          text: commentText.trim(),
          rating: rating || null,
          isPrivate: isPrivate,
          replyTo: replyTo || null
        })
      });

      if (response.ok) {
        setCommentText('');
        setRating(0);
        setIsPrivate(false);
        setShowPreview(false);
        if (onCancelReply) onCancelReply();
        onCommentSubmit();
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      {replyTo && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700 dark:text-blue-300">Replying to a comment</span>
            {onCancelReply && (
              <button
                type="button"
                onClick={onCancelReply}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {!replyTo && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rate this story
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating
                      ? 'text-yellow-500 fill-current'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {!replyTo && (
        <div className="mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="sr-only"
              />
              <div className={`block w-10 h-6 rounded-full ${isPrivate ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isPrivate ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className="text-gray-700 dark:text-gray-300">
              {isPrivate ? (
                <span className="flex items-center">
                  <EyeOff className="w-4 h-4 mr-1" />
                  Private comment (only admin can see)
                </span>
              ) : (
                <span className="flex items-center">
                  <EyeIcon className="w-4 h-4 mr-1" />
                  Public comment
                </span>
              )}
            </span>
          </label>
        </div>
      )}

      <div className="mb-2">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {replyTo ? 'Your reply' : 'Your comment'}
          </label>
          <span className={`text-xs ${commentText.length > MAX_CHARS ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
            {commentText.length}/{MAX_CHARS} characters
          </span>
        </div>
        <textarea
          value={commentText}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) {
              setCommentText(e.target.value);
            }
          }}
          placeholder={replyTo ? "Write your reply..." : "Share your thoughts..."}
          className="input-field min-h-[100px] mb-2"
          maxLength={MAX_CHARS}
        />
        <div className="flex items-center space-x-2 mb-4">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 flex items-center space-x-1"
          >
            <EyeIcon className="w-4 h-4" />
            <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
          </button>
        </div>
      </div>

      {showPreview && commentText.trim() && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview:</span>
          </div>
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {commentText}
          </div>
          {rating > 0 && (
            <div className="mt-2 flex items-center space-x-1">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
              ))}
            </div>
          )}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={submitting || commentText.length > MAX_CHARS || (!commentText.trim() && rating === 0)}
        className="btn-primary"
      >
        {submitting ? 'Posting...' : replyTo ? 'Post Reply' : 'Post comment'}
      </motion.button>
    </form>
  );
}

export default CommentForm;