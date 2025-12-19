# Google Sheet Security Setup

Your Google Sheet contains all the sensitive data (player names, scores, notes). Here's how to protect it properly.

---

## 🔒 Current Security Model

**How it works:**
1. Your HTML app contains a Google Apps Script URL
2. That URL is **public** (anyone with the HTML file has it)
3. The script can write to your Google Sheet
4. **BUT** - only people with Google Sheet access can VIEW the data

**The Risk:**
- Someone could spam fake data to your sheet via the script URL
- They **cannot** view your actual player data unless you share the sheet with them

---

## ✅ STEP 1: Protect Your Google Sheet

### Go to Your Google Sheet: "GC Tryout Evaluations 2026"

1. **Click the "Share" button** (top right)
2. **Check who has access** - you should see a list
3. **Set sharing to "Restricted"** (not "Anyone with the link")

### Recommended Sharing Settings:

**For Coaches Using the App:**
- **Don't need Sheet access!** They use the HTML app only
- The app writes through the script (which runs as you)
- They never need to open Google Sheets

**For People Viewing Results:**
- Share as **"Viewer"** - can see data but not edit
- Only share with people who need to see player scores

**For Other Coaches Who Need to Edit Directly:**
- Share as **"Editor"** - only if they need direct Sheet access
- Most coaches should just use the HTML app

### Your Sheet Should Be:
```
Restricted access:
✅ You (Owner)
✅ Maybe 1-2 other admins as Editors (optional)
✅ Parents/directors as Viewers (only if they need to see results)
❌ NOT "Anyone with the link"
❌ NOT public
```

---

## ✅ STEP 2: Verify Your Google Apps Script Permissions

### Check Your Script Deployment Settings:

1. Go to **Google Apps Script** (extensions.google.com/macros)
2. Find your script project
3. Click **Deploy** → **Manage deployments**
4. Check the settings:

**Should be set to:**
- **Execute as:** "Me" (your email)
- **Who has access:** "Anyone" (even anonymous)

**Why these settings:**
- **Execute as "Me"** = Script runs with your permissions, writes to your sheet
- **Anyone access** = Required for the HTML app to work without login prompts
- Since the script runs as YOU, it can access YOUR sheet even if others can't

### This is CORRECT - Don't change it!
- Yes, the script URL is public
- But it only does what the script allows (read/write specific data)
- Your sheet permissions control who can actually VIEW the data

---

## ✅ STEP 3: Protect Specific Tabs

### Protect the "TryoutData" Tab (Raw Data)

1. In your Google Sheet, **right-click the "TryoutData" tab**
2. Select **"Protect sheet"**
3. Set to **"Only you"** can edit
4. Click "Set permissions"

**Why:** This tab has the raw JSON data. You don't want anyone accidentally messing it up.

### Keep "Players (Readable)" Tab Visible

- This tab is the pretty formatted view
- Safe for people to see
- You can share the whole sheet as "Viewer" for people who just need to see results

---

## ✅ STEP 4: Monitor Access

### Set Up Notifications

1. In Google Sheets: **Tools** → **Notification rules**
2. Choose: **"Any changes are made"**
3. Get email notifications when data changes

**Benefits:**
- You'll know if someone is spamming your sheet
- Can catch issues during tryouts
- Peace of mind

### Check Script Execution Logs

1. Go to your Apps Script project
2. Click **"Executions"** on the left
3. See every time someone used the app to upload/download

**What to look for:**
- Unusual number of executions
- Errors or failures
- Timing of access

---

## 🛡️ STEP 5: Add Script-Level Protection (Optional)

**I can add a simple security check to your Google Apps Script:**

### Option A: Whitelist Check
```javascript
// At the top of doPost() function:
const ALLOWED_IPS = ['list', 'of', 'IPs']; // Not very practical
```
❌ **Problem:** IPs change, especially on mobile

### Option B: Secret Token
```javascript
// Script requires a secret token to write
const SECRET_TOKEN = 'your-secret-here-abc123';

function doPost(e) {
  // Check if token is provided
  if (e.parameter.token !== SECRET_TOKEN) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Unauthorized'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  // ... rest of code
}
```

**Then update HTML to send token:**
```javascript
input.name = 'token';
input.value = 'your-secret-here-abc123';
```

✅ **Benefits:** Only your HTML app (with the token) can write
❌ **Drawback:** Token is visible in HTML source if someone opens the file

### Option C: Time Window Check
```javascript
// Only accept uploads during tryout times
const TRYOUT_START = new Date('2026-02-15');
const TRYOUT_END = new Date('2026-02-28');

function doPost(e) {
  const now = new Date();
  if (now < TRYOUT_START || now > TRYOUT_END) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Tryouts are not currently active'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  // ... rest of code
}
```

✅ **Benefits:** Automatically locks after tryouts end
✅ **Simple and effective**

**Would you like me to add any of these protections to your script?**

---

## 📊 STEP 6: Review Sheet Permissions Right Now

### Do This Now:

1. **Open your Google Sheet:** "GC Tryout Evaluations 2026"
2. **Click "Share"** button
3. **Check the access list**

**Is it set to:**
- ✅ "Restricted" (only specific people)
- ❌ "Anyone with the link" can view/edit

**Who is listed:**
- Should be ONLY people you explicitly added
- Remove anyone who doesn't need access

### If It Says "Anyone with the link":
1. Click the dropdown
2. Change to **"Restricted"**
3. Click "Done"

**This is the most important step!** Even if your script URL leaks, people can't see your data if they're not on your share list.

---

## 🎯 Recommended Security Setup

### For Maximum Security:

**Google Sheet Sharing:**
```
✅ Restricted to specific people
✅ You = Owner
✅ 1-2 trusted admins = Editors (optional)
✅ Parents/directors = Viewers (only if needed)
✅ "TryoutData" tab protected (only you can edit)
```

**Google Apps Script:**
```
✅ Deployed as web app
✅ Execute as: Me
✅ Access: Anyone (required for app to work)
✅ Optional: Add time window check (start/end dates)
```

**HTML File Distribution:**
```
✅ Email to trusted coaches only
✅ Don't post URL publicly if hosting online
✅ Optional: Add password screen to HTML
```

### This Gives You:

1. **Data Protection:** Only people you share Sheet with can VIEW data
2. **Write Access:** Anyone with HTML app can WRITE (but that's your coaches)
3. **Audit Trail:** Google Apps Script logs all executions
4. **Monitoring:** Email notifications when Sheet changes
5. **Auto-lock:** Optional time window prevents access after tryouts

---

## ⚠️ What Can Still Go Wrong?

**If someone gets your HTML file:**
- ✅ They can add fake player data
- ❌ They **cannot** see your existing player data (Sheet is protected)
- ✅ You'll get notified via email (if you set up notifications)
- ✅ You can see who did it in execution logs (shows timestamps)

**Worst case scenario:**
- Someone spams your sheet with junk data
- **Fix:** You can restore previous version (File → Version history)
- **Prevention:** Only share HTML with trusted people

---

## ✅ Action Items for YOU Right Now:

1. [ ] Open "GC Tryout Evaluations 2026" Google Sheet
2. [ ] Click "Share" → verify it's "Restricted" (not public)
3. [ ] Remove any people who don't need access
4. [ ] Right-click "TryoutData" tab → Protect sheet → Only you
5. [ ] Tools → Notification rules → Email me when changes are made
6. [ ] Optional: Let me know if you want time window protection added to script

**The #1 most important thing: Make sure your Sheet is "Restricted" and not "Anyone with the link"**

That's where your actual player data lives, and that's what needs protection!
