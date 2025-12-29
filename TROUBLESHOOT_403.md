# Troubleshooting 403 Errors - Complete Checklist

## Current Situation
- ✅ App can READ from Google Sheets (doGet works)
- ❌ App cannot WRITE to Google Sheets (doPost returns 403)

## Root Cause Analysis
A 403 error on POST requests usually means one of these issues:
1. **Wrong deployment settings** (Execute as / Who has access)
2. **Old deployment URL still being used**
3. **Permissions not granted for the specific spreadsheet**

---

## Solution Steps (Follow Exactly)

### Step 1: Verify Apps Script Code is Saved
1. Open your Google Spreadsheet
2. Click **Extensions** → **Apps Script**
3. You should see the updated code with `broadjump` references
4. Click **Save** (disk icon) to be sure

### Step 2: Delete Old Deployments (IMPORTANT!)
Before creating a new one, let's clean up:
1. Click **Deploy** → **Manage deployments**
2. For EACH deployment listed:
   - Click the **Archive** button (looks like a box with down arrow)
   - Confirm archiving
3. Now you should have NO active deployments

### Step 3: Create Fresh Deployment
1. Click **Deploy** → **New deployment**
2. Click the **gear icon ⚙️** next to "Select type"
3. Choose **Web app**
4. Fill in these settings **EXACTLY**:
   - **Description**: `Softball Tryouts - Fresh Deploy`
   - **Execute as**: **Me** (should show your email)
   - **Who has access**: **Anyone**

     ⚠️ **CRITICAL**: Make sure it says "Anyone", NOT "Anyone with Google account"
5. Click **Deploy**

### Step 4: Grant Permissions Carefully
You MUST see a permissions popup:
1. Click **Authorize access**
2. Select your Google account
3. Warning screen: **"Google hasn't verified this app"**
4. Click **Advanced** (bottom left corner)
5. Click **"Go to [your project] (unsafe)"**
6. Review the permissions:
   - See and download your Google Sheets
   - See, edit, create, and delete your Google Sheets
7. Click **Allow**

### Step 5: Copy the Web App URL
1. After permissions, you'll see "Deployment successfully created"
2. Look for **"Web app URL"**
3. **COPY THE ENTIRE URL** - it looks like:
   ```
   https://script.google.com/macros/s/AKfycby...long_random_string.../exec
   ```
4. Click **Done**

### Step 6: Update index.html
1. Open `index.html` in your editor
2. Press Ctrl+F and search for: `GOOGLE_SCRIPT_URL`
3. You'll find line 427 that looks like:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/OLD_URL/exec';
   ```
4. **Replace the ENTIRE URL** with the new one you copied
5. **Save the file** (Ctrl+S)

### Step 7: Test with Browser Console Open
1. Open your softball tryouts page in browser
2. Press **F12** to open Developer Console
3. Click the **Console** tab
4. Refresh the page (Ctrl+R or F5)
5. Look for the auto-load message - should say "34 players loaded"
6. Make a small change to any player (add a score)
7. Watch the console for errors

### Step 8: What You Should See
✅ **SUCCESS looks like:**
```
Auto-upload sent (cross-origin response)
✓ Auto-synced to Google Sheets
```

❌ **FAILURE looks like:**
```
Failed to load resource: the server responded with a status of 403
```

---

## If You Still Get 403 After This

### Check Deployment Settings
1. Go back to Apps Script
2. Click **Deploy** → **Manage deployments**
3. Click the **pencil/edit icon** next to your deployment
4. Verify:
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone ← MUST BE "Anyone"

### Alternative: Check if URL is Correct
1. In Apps Script, click **Deploy** → **Manage deployments**
2. Copy the "Web app" URL shown there
3. Compare it to the URL in index.html line 427
4. They MUST match exactly

### Nuclear Option: New Google Apps Script Project
If nothing works, we can create a completely new Apps Script project:
1. In Apps Script editor, click **Project Settings** (gear icon, left sidebar)
2. Note the current project name
3. Create a new Apps Script: **Extensions** → **Apps Script** (from spreadsheet)
   - This creates a fresh project
4. Paste the code from `google-apps-script.js`
5. Deploy as web app (steps above)
6. Update the URL in index.html

---

## Expected Final State
- ✅ Can load 34 players from Google Sheets
- ✅ Can save changes to Google Sheets
- ✅ No 403 errors in console
- ✅ Changes appear in spreadsheet within seconds
