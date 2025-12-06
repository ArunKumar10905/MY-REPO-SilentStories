import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, User, BookOpen, Heart, Check, X } from 'lucide-react';

function RealTimeMessages() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial real-time events
    fetchRealTimeEvents();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchRealTimeEvents, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchRealTimeEvents = async () => {
    try {
      const response = await fetch('http://localhost:3004/api/admin/realtime-events', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const events = await response.json();
        setMessages(events);
      }
    } catch (error) {
      console.error('Error fetching real-time events:', error);
    } finally {
      if (loading) {
        setLoading(false);
      }
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // In a real implementation, this would send a message to all visitors
      // For now, we'll just show a simulated message
      const simulatedMessage = {
        id: messages.length + 1,
        type: 'admin_message',
        message: `Admin message: ${newMessage}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [simulatedMessage, ...prev]);
      setNewMessage('');
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'story_submission':
        return <BookOpen className="w-4 h-4" />;
      case 'new_comment':
        return <MessageCircle className="w-4 h-4" />;
      case 'story_like':
        return <Heart className="w-4 h-4" />;
      case 'story_approved':
        return <Check className="w-4 h-4" />;
      case 'story_rejected':
        return <X className="w-4 h-4" />;
      case 'story_update':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getColorClasses = (type) => {
    switch (type) {
      case 'story_submission':
        return 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300';
      case 'new_comment':
        return 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300';
      case 'story_like':
        return 'bg-pink-50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300';
      case 'story_approved':
        return 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300';
      case 'story_rejected':
        return 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300';
      case 'story_update':
        return 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300';
      default:
        return 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300';
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
          Real-time Activity
        </h3>
      </div>
      
      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
        {messages.length > 0 ? (
          messages.map((event, index) => (
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
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">
            No recent activity
          </p>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Send a message to visitors..."
          className="input-field flex-1 mr-2 text-sm"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </form>
    </div>
  );
}

export default RealTimeMessages;