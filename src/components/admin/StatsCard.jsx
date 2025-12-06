import React from 'react';
import { motion } from 'framer-motion';

function StatsCard({ title, value, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-secondary-600 dark:text-secondary-300 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-secondary-800 dark:text-white">
            {value}
          </p>
        </div>
        <Icon className="w-12 h-12 text-primary-500" />
      </div>
    </motion.div>
  );
}

export default StatsCard;
