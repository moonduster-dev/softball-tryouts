# Fix Google Sheets Auto-Upload (Stop 403 Errors)

## Quick Steps to Update Google Apps Script

### 1. Open Your Spreadsheet
- Go to your softball tryouts Google Spreadsheet
- The one that has your player data

### 2. Open Apps Script Editor
- Click **Extensions** (top menu)
- Click **Apps Script**
- A new tab will open with code editor

### 3. Replace the Code
- **Select ALL the code** in the editor (Ctrl+A)
- **Delete it all**
- Open the file: `google-apps-script.js` (in this folder)
- **Copy ALL the code** from that file
- **Paste it** into the Apps Script editor

### 4. Save
- Click the **Save/Disk icon** (or press Ctrl+S)
- Wait for "Saved" message to appear

### 5. Redeploy
- Click **Deploy** (top right)
- Click **Manage deployments**
- Click the **pencil/edit icon** ✏️ next to your existing deployment
- Under "Version", click **"New version"**
- Click **Deploy**

### 6. Grant Permissions (IMPORTANT!)
When you click Deploy, you'll see a popup asking for permissions:

1. Click **"Review permissions"**
2. Select your Google account
3. You'll see a warning "Google hasn't verified this app"
4. Click **"Advanced"** (bottom left)
5. Click **"Go to [your project name] (unsafe)"**
6. Click **"Allow"**

### 7. Done!
- Close the Apps Script tab
- Go back to your softball tryouts page
- Refresh the page
- Make a small change to any player
- You should see **"✓ Saved to Google Sheets"** instead of 403 errors

---

## What This Updates:
- Adds Broad Jump scoring to the readable spreadsheet
- Fixes write permissions
- Maintains all existing functionality

## Current Status:
- ✅ App works perfectly (saves locally)
- ✅ Can READ from Google Sheets (34 players loaded)
- ❌ Cannot WRITE to Google Sheets (403 forbidden)

After following these steps, all three will be ✅
