import React from 'react';
import { Calendar, Eye, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

function StoryHeader({ story, commentsCount }) {
  // Function to safely format date
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Unknown date';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return format(date, 'MMMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Function to safely get story title
  const getStoryTitle = () => {
    return story && story.title ? story.title : 'Untitled Story';
  };

  // Function to safely get views count
  const getViewsCount = () => {
    return story && typeof story.views === 'number' ? story.views : 0;
  };

  // Function to safely get comments count
  const getCommentsCount = () => {
    return typeof commentsCount === 'number' ? commentsCount : 0;
  };

  return (
    <div className="mb-6">
      <h1 className="text-4xl font-bold text-secondary-800 dark:text-white mb-4">
        {getStoryTitle()}
      </h1>
      
      <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600 dark:text-secondary-300 mb-4">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(story?.publish_date)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Eye className="w-4 h-4" />
          <span>{getViewsCount()} views</span>
        </div>
        <div className="flex items-center space-x-1">
          <MessageCircle className="w-4 h-4" />
          <span>{getCommentsCount()} comments</span>
        </div>
      </div>
    </div>
  );
}

export default StoryHeader;