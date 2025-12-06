import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Lock } from 'lucide-react';

function NameEntryModal({ onSubmit }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-secondary-800 dark:text-white mb-2">
          Enter your name to continue
        </h2>
        <p className="text-secondary-600 dark:text-secondary-300 mb-6">
          We'd love to know who's reading our stories
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (required)"
            className="input-field mb-4"
            autoFocus
            required
          />
          
          {/* Added privacy notice */}
          <div className="flex items-start mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <Lock className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Privacy Notice:</strong> Only you can see your real name. Even admins cannot see visitor names.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn-primary w-full"
          >
            Enter
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default NameEntryModal;