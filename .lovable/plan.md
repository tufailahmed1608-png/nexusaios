
# Change Browser Favicon to Masira Logo

## Overview
Replace the current Lovable favicon with the uploaded Masira logo icon to match your brand identity across all browser tabs.

## Changes Required

### 1. Copy the Uploaded Icon to Public Folder
- Copy `user-uploads://App_Icon-2.ico` to `public/favicon.ico`
- This will replace the existing Lovable favicon

### 2. Verify index.html Reference
The `index.html` already has the correct reference at line 5:
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
```
No changes needed to the HTML file since we're replacing the file with the same name.

## Result
After this change:
- All browser tabs will show the Masira logo instead of the Lovable icon
- The favicon will appear in bookmarks, browser history, and tab headers
- No code changes required - just a file replacement

## Note
You may need to hard refresh (Ctrl+Shift+R or Cmd+Shift+R) the browser to see the new favicon, as browsers cache favicons aggressively.
