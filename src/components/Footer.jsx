import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-orange-500 fill-current" />
            <span>for storytellers</span>
          </div>

          <div className="flex space-x-6">
            <Link 
              to="/privacy-policy" 
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </Link>
            {/* Removed direct admin link to prevent visitors from accessing admin page */}
          </div>
        </div>
        
        {/* Added footer text as requested */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          -Arun Kumar Sapidi
        </div>
      </div>
    </footer>
  );
}

export default Footer;