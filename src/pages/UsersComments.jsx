import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import VisitorsList from '../components/admin/VisitorsList';
import PrivateCommentsPanel from '../components/admin/PrivateCommentsPanel';

function UsersComments() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, commentsRes] = await Promise.all([
        fetch('http://localhost:3004/api/users', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        }),
        fetch('http://localhost:3004/api/admin/comments', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        })
      ]);

      const usersData = await usersRes.json();
      const commentsData = await commentsRes.json();

      setUsers(usersData);
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (id) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`http://localhost:3004/api/comments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ['Name', 'Comment Count', 'Last Active'],
      ...users.map(user => [
        user.name,
        user.comment_count,
        format(new Date(user.last_active), 'yyyy-MM-dd HH:mm:ss')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
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
          Users & Comments
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportCSV}
          className="btn-primary flex items-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Export CSV</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Visitors
          </h2>
          <VisitorsList users={users} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            All Comments (Including Private)
          </h2>
          <PrivateCommentsPanel comments={comments} onDelete={handleDeleteComment} />
        </motion.div>
      </div>
    </div>
  );
}

export default UsersComments;