import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, BookOpen, Check } from 'lucide-react';

function RealTimeNotifications({ onStoryUpdate }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial real-time events
    fetchRealTimeEvents();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchRealTimeEvents, 5000);
    
    // Also set up visibility change detection for mobile browsers
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchRealTimeEvents(); // Refresh when tab becomes visible
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchRealTimeEvents = async () => {
    try {
      const response = await fetch('http://localhost:3004/api/realtime-events');
      
      if (response.ok) {
        const events = await response.json();
        setNotifications(events);
        
        // Trigger story update if there are story-related events
        if (events.some(event => ['story_approved', 'story_deleted'].includes(event.type))) {
          if (onStoryUpdate) {
            onStoryUpdate();
          }
        }
      }
    } catch (error) {
      console.error('Error fetching real-time events:', error);
    } finally {
      if (loading) {
        setLoading(false);
      }
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'story_approved':
        return <Check className="w-4 h-4" />;
      case 'story_update':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getColorClasses = (type) => {
    switch (type) {
      case 'story_approved':
        return 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300';
      case 'story_update':
        return 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300';
      default:
        return 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return null; // Don't show anything while loading
  }

  // Only show the latest 3 notifications
  const latestNotifications = notifications.slice(0, 3);

  return (
    <div className="mb-8">
      {latestNotifications.length > 0 && (
        <div className="space-y-3">
          {latestNotifications.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 rounded-lg ${getColorClasses(event.type)}`}
            >
              <div className="flex items-start">
                <div className="mr-2 mt-0.5">
                  {getIconForType(event.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    {event.message}
                  </p>
                  <p className="text-xs opacity-75 mt-1">
                    {formatTime(event.timestamp)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RealTimeNotifications;