import React from 'react';
import { motion } from 'framer-motion';
import { Type, Bookmark, Share2 } from 'lucide-react';

function ReadingControls({ fontSize, setFontSize, bookmarked, onBookmark, onShare }) {
  return (
    <div className="flex items-center justify-between border-t border-b border-secondary-200 dark:border-secondary-700 py-4">
      <div className="flex items-center space-x-2">
        <Type className="w-5 h-5 text-secondary-600 dark:text-secondary-300" />
        <button
          onClick={() => setFontSize('small')}
          className={`px-3 py-1 rounded ${fontSize === 'small' ? 'bg-primary-500 text-white' : 'bg-secondary-100 dark:bg-secondary-700'}`}
        >
          A
        </button>
        <button
          onClick={() => setFontSize('medium')}
          className={`px-3 py-1 rounded text-lg ${fontSize === 'medium' ? 'bg-primary-500 text-white' : 'bg-secondary-100 dark:bg-secondary-700'}`}
        >
          A
        </button>
        <button
          onClick={() => setFontSize('large')}
          className={`px-3 py-1 rounded text-xl ${fontSize === 'large' ? 'bg-primary-500 text-white' : 'bg-secondary-100 dark:bg-secondary-700'}`}
        >
          A
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBookmark}
          className={`p-2 rounded-lg ${bookmarked ? 'bg-accent-100 text-accent-600' : 'bg-secondary-100 dark:bg-secondary-700'}`}
        >
          <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onShare}
          className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-700"
        >
          <Share2 className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}

export default ReadingControls;
