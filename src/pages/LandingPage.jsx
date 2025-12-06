import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, BookOpen, Shield } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center items-center space-x-3 mb-6"
          >
            <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white">
              Silent Pages Stories
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300"
          >
            Welcome to your story platform
          </motion.p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 gap-6">
          {/* Visitor Button */}
          <motion.button
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/visitor')}
            className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  <User className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Visitor
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Read and share your stories with the community
              </p>
            </div>
          </motion.button>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400"
        >
          Choose your role to continue
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LandingPage;

