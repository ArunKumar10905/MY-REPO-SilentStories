import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

function VisitorsList({ users }) {
  return (
    <div className="space-y-4">
      {users.map((user, index) => (
        <motion.div
          key={user.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 }}
          className="flex justify-between items-center p-4 bg-secondary-50 dark:bg-secondary-700 rounded-lg"
        >
          <div>
            <p className="font-medium text-secondary-800 dark:text-white">
              {user.name}
            </p>
            <p className="text-sm text-secondary-600 dark:text-secondary-300">
              {user.comment_count} comments
            </p>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            {format(new Date(user.last_active), 'MMM dd, yyyy')}
          </p>
        </motion.div>
      ))}
      {users.length === 0 && (
        <p className="text-center text-secondary-600 dark:text-secondary-300 py-8">
          No visitors yet
        </p>
      )}
    </div>
  );
}

export default VisitorsList;
