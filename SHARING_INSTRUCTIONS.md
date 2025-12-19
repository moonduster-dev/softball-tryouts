# Softball Tryout Scorer - Sharing Instructions

## For You (The Admin/Coach)

### How to Share the App:

1. **FIRST: Change the password!**
   - Open `index.html` in Notepad/TextEdit
   - Find line: `const APP_PASSWORD = 'tryout2026';`
   - Change to your own password
   - Save the file
   - See **PASSWORD_SETUP.md** for detailed instructions

2. **Find the file:** `index.html` in your `softball_tryouts` folder

3. **Send it to trusted people:**
   - Via email as an attachment
   - Via USB drive
   - Via shared Google Drive/Dropbox folder
   - Via any secure file sharing method

4. **Share the password separately:**
   - Text or call them with the password
   - Don't put password in the same email as the file

### Important Notes:
- 🔒 **Password protected** - users must enter password to access
- ✅ The HTML file contains your Google Apps Script URL (already configured)
- ✅ Everyone who has the file can access the same Google Sheet (with correct password)
- ✅ Changes auto-save and auto-sync to Google Sheets

---

## For People You Share With

### How to Use the App on Computer:

1. **Download the `index.html` file** (from email, USB, etc.)
2. **Save it somewhere on your computer** (Desktop, Documents, etc.)
3. **Double-click the file** to open it in your web browser (Chrome recommended)

### How to Use on Phone/Tablet:

**📱 See MOBILE_INSTRUCTIONS.md for detailed steps!**

**Quick version:**
- **iPhone/iPad**: Save attachment to Files app, then tap to open in Safari. Add to Home Screen for easy access!
- **Android**: Download attachment, open from Downloads folder in Chrome. Add to Home Screen for easy access!
- Works great on mobile - all features available, touch-friendly interface

### Daily Workflow:

1. **When you start:**
   - Open the HTML file
   - **Enter the password** when prompted
   - Data **automatically downloads** from Google Sheets after unlock

2. **Score players:**
   - Choose your view:
     - **👤 Players** - Score one player at a time, navigate through all their drills
     - **🎯 Stations** - Pick your station, then score players as they rotate through
   - Everything **auto-saves** and **auto-syncs** to Google Sheets (2 seconds after you stop typing)

3. **When you're done:**
   - Just close the app - everything is already synced!
   - Or manually click **"⬆️ Upload to Sheets"** if you want to force a sync

### Working Together:

- **Auto-sync** means everyone sees updates automatically (within 2 seconds)
- If two people edit at the same time, the last person's changes win
- Use the **"Players (Readable)"** tab in Google Sheets to view formatted results
- **Stations view** is perfect for tryouts where coaches stay at one station

### Buttons Explained:

- **👤 Players** - Score one player at a time across all categories
- **🎯 Stations** - Pick your station, score players as they come through
- **📊 View All** - See all players ranked by total score in a table
- **⬆️ Upload to Sheets** - Manually force upload (auto-uploads happen automatically)
- **⬇️ Download from Sheets** - Manually refresh from Google Sheets (auto-downloads on page load)
- **⬇️ Export CSV** - Download a spreadsheet file

---

## Troubleshooting

**"No data found in Google Sheets"**
- Nobody has uploaded yet, or the sheet is empty

**"Upload failed"**
- Check your internet connection
- Make sure you can access Google Sheets in your browser

**My changes disappeared**
- Someone else uploaded after you - download their version and re-enter your changes
- Or check the Google Sheet to see if your data is there

**File won't open**
- Right-click the file → Open with → Chrome (or your preferred browser)
- If it opens in a text editor, that's wrong - use a web browser

---

## Best Practices

✅ **Download at the start** of each session
✅ **Upload frequently** (every 15-30 minutes)
✅ **Communicate** with other coaches about who's entering what
✅ **Keep a backup** - export CSV periodically
✅ **Use one computer per station** to avoid conflicts

---

## Google Sheet Access

The shared Google Sheet is: **GC Tryout Evaluations 2026**

- **TryoutData** tab - Raw data (don't touch)
- **Players (Readable)** tab - Beautiful formatted view (view/print this!)

---

Questions? Contact the person who shared this file with you!
