import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock } from 'lucide-react';

function RealTimeVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data
    fetchVisitors();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchVisitors, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const fetchVisitors = async () => {
    try {
      const response = await fetch('http://localhost:3004/api/realtime-visitors');
      const data = await response.json();
      
      setVisitors(data.active_visitors);
      setTotalVisitors(data.total_visitors);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching real-time visitors:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium text-gray-800 dark:text-white">
          Active Visitors
        </h3>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Users className="w-4 h-4 mr-1" />
          <span>{totalVisitors} total</span>
        </div>
      </div>
      
      {visitors.length > 0 ? (
        <div className="space-y-3">
          {visitors.map((visitor, index) => (
            <motion.div
              key={visitor.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-800 dark:text-white text-sm">
                  {visitor.name}
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{new Date(visitor.last_active).toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                {visitor.comment_count} comments
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">
          No active visitors
        </p>
      )}
    </div>
  );
}

export default RealTimeVisitors;