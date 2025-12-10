import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock, BookOpen, Heart, Edit, Save, X as CloseIcon, Mail } from 'lucide-react';

function SubmittedStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStoryId, setEditingStoryId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    author: '',
    email: '', // Added email field
    dedication: '',
    content: '',
    category: ''
  });

  useEffect(() => {
    fetchSubmittedStories();
  }, []);

  const fetchSubmittedStories = async () => {
    try {
      const response = await fetch('http://localhost:3004/api/submitted-stories', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      const data = await response.json();
      setStories(data);
    } catch (error) {
      console.error('Error fetching submitted stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (story, status) => {
    try {
      // When approving, we need to send the full story data
      const requestData = status === 'approved' 
        ? { ...story, status }
        : { status };
      
      const response = await fetch(`http://localhost:3004/api/submitted-stories/${story.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        fetchSubmittedStories();
      } else {
        const errorData = await response.json();
        console.error('Error updating story status:', errorData.error);
        alert(`Failed to update story status: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error updating story status:', error);
      alert(`Failed to update story status: ${error.message}`);
    }
  };

  const handleEditClick = (story) => {
    setEditingStoryId(story.id);
    setEditFormData({
      title: story.title,
      author: story.author,
      email: story.email || '', // Added email field
      dedication: story.dedication || '',
      content: story.content,
      category: story.category || ''
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const response = await fetch(`http://localhost:3004/api/submitted-stories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        setEditingStoryId(null);
        fetchSubmittedStories();
      }
    } catch (error) {
      console.error('Error updating story:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingStoryId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <Check className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Submitted Stories
        </h1>
      </div>

      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Visitor Submissions
        </h2>

        {stories.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No stories have been submitted yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                {editingStoryId === story.id ? (
                  // Edit mode
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        Editing Story
                      </h3>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSaveEdit(story.id)}
                          className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-full mb-2"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          <span>Save</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCancelEdit}
                          className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors w-full"
                        >
                          <CloseIcon className="w-4 h-4 mr-1" />
                          <span>Cancel</span>
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={editFormData.title}
                          onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                          className="input-field w-full"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Author
                        </label>
                        <input
                          type="text"
                          value={editFormData.author}
                          onChange={(e) => setEditFormData({...editFormData, author: e.target.value})}
                          className="input-field w-full"
                        />
                      </div>
                      
                      {/* Added email field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                          <Mail className="w-4 h-4 mr-1 text-blue-500" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={editFormData.email}
                          onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                          className="input-field w-full"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Category
                        </label>
                        <select
                          value={editFormData.category}
                          onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                          className="input-field w-full"
                        >
                          <option value="">Select a category</option>
                          <option value="Fiction">Fiction</option>
                          <option value="Non-Fiction">Non-Fiction</option>
                          <option value="Mystery">Mystery</option>
                          <option value="Romance">Romance</option>
                          <option value="Sci-Fi">Sci-Fi</option>
                          <option value="Fantasy">Fantasy</option>
                          <option value="Horror">Horror</option>
                          <option value="Adventure">Adventure</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                          <Heart className="w-4 h-4 mr-1 text-red-500" />
                          Dedication
                        </label>
                        <input
                          type="text"
                          value={editFormData.dedication}
                          onChange={(e) => setEditFormData({...editFormData, dedication: e.target.value})}
                          className="input-field w-full"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Content
                      </label>
                      <textarea
                        value={editFormData.content}
                        onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                        className="input-field w-full min-h-[200px]"
                      />
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                          {story.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          By {story.author} • {new Date(story.submitted_at).toLocaleDateString()}
                        </p>
                        {/* Display email if present */}
                        {story.email && (
                          <div className="flex items-center mt-2 text-blue-500 dark:text-blue-400">
                            <Mail className="w-4 h-4 mr-1" />
                            <span className="text-sm">Email: {story.email}</span>
                          </div>
                        )}
                        {/* Display dedication if present */}
                        {story.dedication && (
                          <div className="flex items-center mt-2 text-red-500 dark:text-red-400">
                            <Heart className="w-4 h-4 mr-1" />
                            <span className="text-sm">Dedicated to: {story.dedication}</span>
                          </div>
                        )}
                        {story.category && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                            {story.category}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(story.status)}`}>
                          {getStatusIcon(story.status)}
                          <span className="ml-1 capitalize">{story.status}</span>
                        </span>
                      </div>
                    </div>

                    <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
                      <div 
                        dangerouslySetInnerHTML={{ __html: story.content }} 
                        className="text-gray-700 dark:text-gray-300"
                      />
                    </div>

                    {story.status === 'pending' && (
                      <div className="flex space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleStatusChange(story, 'approved')}
                          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleStatusChange(story, 'rejected')}
                          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditClick(story)}
                          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </motion.button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SubmittedStories;