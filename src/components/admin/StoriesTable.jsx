import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

function StoriesTable({ stories, onDelete }) {
  const handleDeleteClick = (id) => {
    console.log('Delete button clicked for story ID:', id);
    onDelete(id);
  };

  // Function to safely format date
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Unknown date';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-secondary-200 dark:border-secondary-700">
            <th className="text-left py-3 px-4 text-secondary-700 dark:text-secondary-300">
              Title
            </th>
            <th className="text-left py-3 px-4 text-secondary-700 dark:text-secondary-300">
              Publish Date
            </th>
            <th className="text-center py-3 px-4 text-secondary-700 dark:text-secondary-300">
              Views
            </th>
            <th className="text-center py-3 px-4 text-secondary-700 dark:text-secondary-300">
              Comments
            </th>
            <th className="text-right py-3 px-4 text-secondary-700 dark:text-secondary-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {stories.map((story, index) => (
            <motion.tr
              key={story.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700"
            >
              <td className="py-3 px-4">
                <Link
                  to={`/story/${story.id}`}
                  className="text-primary-500 hover:text-primary-600 font-medium"
                >
                  {story.title}
                </Link>
              </td>
              <td className="py-3 px-4 text-secondary-600 dark:text-secondary-300">
                {formatDate(story.publish_date)}
              </td>
              <td className="py-3 px-4 text-center text-secondary-600 dark:text-secondary-300">
                {story.views || 0}
              </td>
              <td className="py-3 px-4 text-center text-secondary-600 dark:text-secondary-300">
                {story.comments_count || 0}
              </td>
              <td className="py-3 px-4">
                <div className="flex justify-end space-x-2">
                  <Link to={`/admin/edit-story/${story.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteClick(story.id)}
                    className="p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      {stories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary-600 dark:text-secondary-300">
            No stories yet. Create your first story!
          </p>
        </div>
      )}
    </div>
  );
}

export default StoriesTable;