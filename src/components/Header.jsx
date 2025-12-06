import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Moon, Sun, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';

function Header({ visitorName, onNameChange, darkMode, toggleDarkMode, isAdmin, onLogout }) {
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [newName, setNewName] = useState('');
  const navigate = useNavigate();

  const handleNameEdit = () => {
    if (newName.trim()) {
      onNameChange(newName.trim());
      setShowNameEdit(false);
      setNewName('');
    }
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/visitor');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/visitor" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              Silent Pages Stories
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Admin controls */}
            {isAdmin && (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/admin/dashboard" 
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
                <Link 
                  to="/admin/settings" 
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Visitor controls */}
            {!isAdmin && (
              <div className="flex items-center space-x-2">
                {visitorName ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowNameEdit(!showNameEdit)}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      <span className="text-gray-800 dark:text-white">{visitorName}</span>
                    </button>
                    {showNameEdit && (
                      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-10 border border-gray-200 dark:border-gray-700">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="Enter your name"
                          className="input-field w-full mb-2"
                          autoFocus
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={handleNameEdit}
                            className="btn-primary flex-1"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setShowNameEdit(false)}
                            className="btn-secondary flex-1"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowNameEdit(true)}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span className="text-gray-800 dark:text-white">Enter Name</span>
                  </button>
                )}
              </div>
            )}

            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;