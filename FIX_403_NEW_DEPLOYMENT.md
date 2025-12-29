# Fix 403 Errors - Create New Deployment

## The Problem
When you update an existing deployment, Google doesn't always request new permissions. This causes 403 errors when trying to WRITE to Google Sheets.

## Solution: Create a Brand New Deployment

### Step 1: Open Apps Script
1. Go to your Google Spreadsheet
2. Click **Extensions** → **Apps Script**
3. Make sure the updated code is saved (you should see "Saved" at the top)

### Step 2: Create a NEW Deployment (Don't Update!)
1. Click **Deploy** button (top right)
2. Click **New deployment** (NOT "Manage deployments")
3. Click the **gear icon ⚙️** next to "Select type"
4. Select **Web app**

### Step 3: Configure the New Deployment
Fill in these settings:
- **Description**: `Softball Tryouts v2` (or any name you want)
- **Execute as**: **Me** (your Google account email)
- **Who has access**: **Anyone**

### Step 4: Deploy and Grant Permissions
1. Click **Deploy** button
2. You WILL see **"Authorizing access"** popup
3. Click **Authorize access**
4. Select your Google account
5. You'll see **"Google hasn't verified this app"**
6. Click **Advanced** (bottom left)
7. Click **Go to [project name] (unsafe)**
8. Click **Allow**

### Step 5: Copy the NEW Web App URL
1. After clicking Allow, you'll see a **"Deployment successfully created"** message
2. **COPY the new Web app URL** - it will look like:
   ```
   https://script.google.com/macros/s/DIFFERENT_ID_HERE/exec
   ```
3. Click **Done**

### Step 6: Update index.html with NEW URL
1. Open `index.html` in your editor
2. Find line 427 (search for `GOOGLE_SCRIPT_URL`)
3. **Replace the URL** with the NEW one you just copied
4. Save the file

### Step 7: Test It
1. Open or refresh your softball tryouts page
2. Make a small change to any player (add a drill score)
3. Open browser console (F12)
4. You should see **NO 403 errors**
5. Check your Google Sheet - the data should appear!

---

## Why This Works
- Creating a NEW deployment forces Google to request permissions again
- Updating an existing deployment often keeps old permissions
- The new URL will have proper write access to your spreadsheet

## Expected Result
✅ App loads 34 players from Google Sheets
✅ Can WRITE changes to Google Sheets
✅ No 403 errors in console
✅ Auto-save works perfectly
