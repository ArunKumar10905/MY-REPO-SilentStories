import React from 'react';

function StoryContent({ content, fontSize }) {
  const fontSizes = {
    small: 'text-base',
    medium: 'text-lg',
    large: 'text-xl'
  };

  // Function to safely render content
  const renderContent = () => {
    if (!content) {
      return <p className="text-gray-500">No content available for this story.</p>;
    }

    // Check if content is valid
    if (typeof content !== 'string' || content.trim().length === 0) {
      return <p className="text-gray-500">Story content is empty or invalid.</p>;
    }

    // Check for the "A A A" pattern which indicates corrupted content
    if (content.trim() === 'A' || content.trim() === 'A A A') {
      return <p className="text-gray-500">Story content appears to be corrupted.</p>;
    }

    return (
      <div
        className={`story-content ${fontSizes[fontSize]}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  return (
    <div className="story-content-wrapper">
      {renderContent()}
    </div>
  );
}

export default StoryContent;