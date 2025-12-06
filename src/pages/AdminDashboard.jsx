import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Eye, MessageCircle, TrendingUp, BookOpen } from 'lucide-react';
import StatsCard from '../components/admin/StatsCard';
import StoriesTable from '../components/admin/StoriesTable';
import RealTimeVisitors from '../components/admin/RealTimeVisitors';
import SubmittedStoriesPreview from '../components/admin/SubmittedStoriesPreview';
import RealTimeMessages from '../components/admin/RealTimeMessages';

function AdminDashboard() {
  const [stories, setStories] = useState([]);
  const [stats, setStats] = useState({ totalViews: 0, totalComments: 0, totalVisitors: 0, totalSubmittedStories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
    fetchStats();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch('http://localhost:3004/api/stories');
      const data = await response.json();
      setStories(data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3004/api/analytics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this story?')) return;

    try {
      console.log('Attempting to delete story with ID:', id);
      
      // Get the admin token
      const adminToken = localStorage.getItem('adminToken');
      console.log('Admin token:', adminToken);
      
      const response = await fetch(`http://localhost:3004/api/stories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      console.log('Delete response status:', response.status);
      console.log('Delete response ok?', response.ok);
      
      // Log response headers
      console.log('Response headers:', [...response.headers.entries()]);

      if (response.ok) {
        console.log('Story deleted successfully');
        // Add a small delay to ensure the deletion is processed
        setTimeout(() => {
          fetchStories();
        }, 500);
      } else {
        // Handle error response
        let errorMessage = 'Unknown error';
        try {
          const errorData = await response.json();
          console.log('Error data:', errorData);
          errorMessage = errorData.error || 'Failed to delete story';
        } catch (parseError) {
          console.log('Could not parse error response:', parseError);
          errorMessage = `HTTP Error: ${response.status}`;
        }
        console.error('Delete error:', errorMessage);
        alert(`Failed to delete story: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Network error deleting story:', error);
      alert(`Failed to delete story. Network error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h1>
        <Link to="/admin/create-story">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Story</span>
          </motion.button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Views"
          value={stats.totalViews}
          icon={Eye}
          delay={0}
        />
        <StatsCard
          title="Total Comments"
          value={stats.totalComments}
          icon={MessageCircle}
          delay={0.1}
        />
        <StatsCard
          title="Total Visitors"
          value={stats.totalVisitors}
          icon={TrendingUp}
          delay={0.2}
        />
        <StatsCard
          title="Submitted Stories"
          value={stats.totalSubmittedStories}
          icon={BookOpen}
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              All Stories
            </h2>
            <Link to="/admin/submitted-stories" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
              View Submitted Stories
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <StoriesTable stories={stories} onDelete={handleDelete} />
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="space-y-4">
            <Link to="/admin/create-story">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
              >
                <Plus className="w-6 h-6 text-blue-500 dark:text-blue-400 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Create New Story</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Write and publish a new story</p>
                </div>
              </motion.div>
            </Link>

            <Link to="/admin/users-comments">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-6 h-6 text-green-500 dark:text-green-400 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Manage Comments</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">View and moderate all comments</p>
                </div>
              </motion.div>
            </Link>

            <Link to="/admin/submitted-stories">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors cursor-pointer"
              >
                <BookOpen className="w-6 h-6 text-purple-500 dark:text-purple-400 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Review Submissions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Review stories submitted by visitors</p>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Real-time Activity
          </h2>
          <RealTimeVisitors />
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Pending Submissions
          </h2>
          <SubmittedStoriesPreview />
        </div>
        
        {/* Added Real-time Messages */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Real-time Messages
          </h2>
          <RealTimeMessages />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;