import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, BookOpen, Heart, AlertCircle, Mail } from 'lucide-react';

function SubmitStoryButton({ visitorName }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: visitorName || '',
    email: '', // Added email field
    dedication: '',
    content: '',
    category: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      setMessage({ 
        type: 'error', 
        text: 'Please read and agree to the terms and conditions before submitting.' 
      });
      return;
    }
    
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:3004/api/submit-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: 'Your story has been submitted to the admin for review!' 
        });
        setFormData({
          title: '',
          author: visitorName || '',
          email: '', // Reset email field
          dedication: '',
          content: '',
          category: ''
        });
        setAgreeToTerms(false);
        setSubmitting(false);
        
        // Hide the form after successful submission
        setTimeout(() => {
          setShowForm(false);
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Failed to submit story. Please try again.' 
        });
        setSubmitting(false);
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to submit story. Please try again.' 
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowForm(!showForm)}
        className="flex items-center justify-center space-x-2 w-full py-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-lg font-medium"
      >
        <BookOpen className="w-5 h-5" />
        <span>{showForm ? 'Cancel Submission' : 'Submit Your Story'}</span>
      </motion.button>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 card p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Submit Your Story
          </h3>
          
          {message.text && (
            <div className={`p-3 rounded-lg mb-4 ${
              message.type === 'success' 
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 story-form">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Story Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="input-field"
                required
              />
            </div>

            {/* Added optional email field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-1 text-blue-500" />
                Your Email (Optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email if you want a response"
                className="input-field"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                This is optional and will only be visible to the admin
              </p>
            </div>

            {/* Added dedication field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Heart className="w-4 h-4 mr-1 text-red-500" />
                Dedicate this story to someone special (Optional)
              </label>
              <input
                type="text"
                value={formData.dedication}
                onChange={(e) => setFormData({ ...formData, dedication: e.target.value })}
                placeholder="Enter the name of the person you want to dedicate this story to"
                className="input-field"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                This is optional and will be displayed with your story
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Story Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="input-field min-h-[200px]"
                placeholder="Write your story here..."
                required
              />
            </div>

            {/* Terms and Conditions */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Terms and Conditions
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• If you want to mention your name in the story, please add it at the end</li>
                    <li>• Submitted stories are for reading purposes only</li>
                    <li>• Stories may be reviewed and edited by admins before publication</li>
                    <li>• By submitting, you agree to these terms</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-3 flex items-center">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="agreeToTerms" className="ml-2 text-sm text-blue-700 dark:text-blue-300">
                  I have read and agree to the terms and conditions
                </label>
              </div>
            </div>

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="btn-primary flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting...' : 'Submit to Admin'}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}

export default SubmitStoryButton;