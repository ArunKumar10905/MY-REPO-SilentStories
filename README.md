# Story Publishing Website - Fixed Version

This is the fixed version of the story publishing website with improvements to the story submission and display flow.

## Root Cause Analysis

### 1. Story ID Encoding Issues
Firebase document IDs contain special characters that break URL routing when not properly encoded/decoded between frontend and backend.

### 2. Data Corruption During Approval
The approval endpoint copies incomplete or wrong fields from submitted stories, leading to missing content and metadata in published stories.

### 3. Content Field Inconsistency
Submitted stories use varying field names (content, story, text, body) while published stories expect a specific structure, causing "A A A" placeholders.

## Fixed Components

### 1. Story ID Handling
- In StoryCard → wrap ID with `encodeURIComponent()`
- In StoryPage → `decodeURIComponent()`
- Backend accepts decoded ID
- Linking + fetching always works

### 2. Approval Logic
- Validates fields before approval
- Extracts content from ANY of these fields:
  `content`, `story`, `text`, `body`, `content_html`
- Sets missing fields safely:
  `views: 0`
  `comments_count: 0`
  `publish_date: new Date()`
- Ensures no partial/undefined content gets saved

### 3. StoryContent Rendering
- If content is missing, shows a friendly message
- If content is HTML string, sanitizes it safely before rendering
- Removes the "A A A" fallback behavior
- Never breaks the UI if content is null

## Files Changed

### `src/components/StoryCard.jsx`
- Added URL-safe encoding for story IDs
- Improved error handling for missing story data

### `src/pages/StoryPage.jsx`
- Added proper decoding of story IDs from URL params
- Improved error handling for missing story data

### `src/components/story/StoryContent.jsx`
- Added proper validation for content
- Removed "A A A" fallback behavior
- Added friendly messages for missing content

### `src/components/story/StoryHeader.jsx`
- Added proper validation for story metadata
- Added fallback values for missing data

### `server/index.js`
- Fixed approval endpoint to properly copy content fields
- Added validation to prevent approval of empty stories
- Added reference to original submission for repair purposes

### `src/firebase/firebase.js`
- Fixed missing `getDoc` import

### `tools/fixCorruptedStories.js`
- New script to find and repair corrupted stories
- Tries to restore content from `submitted_stories` using `source_submitted_id`
- Marks unrecoverable stories for manual review

### `tests/submit-approve-fetch.test.js`
- Integration test for the full story flow

## How to Run

### 1. Start the Server
```bash
cd server
node index.js
```

The server will start on http://localhost:3004

### 2. Start the Frontend
In a separate terminal:
```bash
npm run dev
```

The frontend will start on http://localhost:5173

### 3. Run the Repair Script
**IMPORTANT: Backup your Firestore database before running this script!**

```bash
node tools/fixCorruptedStories.js
```

### 4. Test the Story Flow
```bash
npm test tests/submit-approve-fetch.test.js
```

## Verification Steps

1. Submit a story as a visitor
2. Log in as admin
3. Approve the submitted story
4. Visit the main page and click on the newly approved story
5. Verify that the story content displays correctly with:
   - Proper title
   - Full content
   - Correct metadata (date, views, comments)
   - No "A A A" placeholders
   - No "Unknown date" or "0 views" issues

## Commit Messages

- fix: Add missing getDoc import in Firebase service
- feat: Add URL-safe encoding/decoding for story IDs
- fix: Improve story content rendering and validation
- feat: Enhance story approval logic with field validation
- fix: Add proper error handling for missing story metadata
- feat: Add corrupted stories repair script
- test: Add integration test for story flow

Author: Qwen