# 🔒 Password Protection - Setup Guide

Your HTML app now has password protection! Here's everything you need to know.

---

## 🎯 Current Password

**Default Password:** `tryout2026`

**IMPORTANT: Change this password before sharing the file!**

---

## 🔧 How to Change the Password

### Step 1: Open index.html in a Text Editor

**On Windows:**
1. Right-click `index.html`
2. Select **"Open with"** → **"Notepad"** or **"Notepad++"**

**On Mac:**
1. Right-click `index.html`
2. Select **"Open with"** → **"TextEdit"**

### Step 2: Find the Password Line

Look for this line near the top of the `<script>` section (around line 268):

```javascript
const APP_PASSWORD = 'tryout2026';
```

### Step 3: Change the Password

Replace `tryout2026` with your new password:

```javascript
const APP_PASSWORD = 'YourNewPassword123';
```

**Password Tips:**
- Make it memorable for your coaches
- Don't make it too complicated (they're using it on phones!)
- Examples: `Softball2026`, `GCTryouts`, `CoachPass123`

### Step 4: Save the File

- **Save** (Ctrl+S or Cmd+S)
- **Close** the text editor
- The password is now changed!

---

## 📱 How Users Will Experience It

### First Time Opening:

1. **User opens the HTML file** (computer, phone, or tablet)
2. **Password screen appears** with a lock icon
3. **User enters password** and clicks "Unlock" (or presses Enter)
4. **App unlocks** and they can use all features

### After Unlocking:

- **Password is remembered** for that browser session
- They won't have to re-enter it while the app is open
- If they close the browser/tab, they'll need to enter it again next time

---

## 🔐 Security Level

### What This Password Protects:

✅ **Prevents casual users** from accessing the app
✅ **Works on all devices** (computer, phone, tablet)
✅ **Simple and user-friendly** for your coaches
✅ **No special setup required** - built into the HTML file

### What It Doesn't Protect:

⚠️ **Not military-grade security** - someone tech-savvy could view the HTML source code and see the password
⚠️ **Password is visible in the file** if someone opens it in a text editor

### This is Perfect For:

✅ **Tryout situations** with trusted coaches
✅ **Keeping out accidental access** or curious people
✅ **Simple password protection** without complicated setup
✅ **Works offline** - no server or internet required

---

## 👥 Sharing Instructions for Users

When you send the HTML file to coaches, tell them:

```
Password: [your-password-here]

TO USE THE APP:
1. Open the HTML file (computer: double-click, mobile: see mobile instructions)
2. Enter the password when prompted
3. Click "Unlock"
4. Start scoring!

The password is remembered while you use the app, but you'll need to
re-enter it if you close and reopen it.
```

---

## ❓ Troubleshooting

**"I forgot the password!"**
- You can always look at the HTML file in a text editor (line ~268)
- The password is right there: `const APP_PASSWORD = 'whatever';`

**"Can I have different passwords for different people?"**
- No, everyone uses the same password
- This is a single-password system for simplicity
- Everyone with the file uses the same password

**"Someone guessed the password!"**
- Just change it in the HTML file
- Re-send the updated file to your trusted coaches
- The old file will still have the old password

**"I want better security"**
- This is simple password protection for ease of use
- For better security, keep your Google Sheet "Restricted" (see GOOGLE_SHEET_SECURITY.md)
- Remember: The real data is in your Google Sheet, which has proper Google security

**"The password screen won't go away even with correct password"**
- Make sure you saved the file after changing the password
- Try refreshing the page (F5 or reload button)
- Check for typos in the password (case-sensitive!)

**"Can I remove the password protection?"**
- Yes! Just delete or comment out the password checking code
- Or set the password to an empty string: `const APP_PASSWORD = '';`
- But keeping it is recommended for basic security

---

## 🎨 Customizing the Password Screen

### Change the Help Text

Find this line (around line 38):
```html
Contact your coach if you don't have the password
```

Change it to:
```html
Text Coach Smith at 555-1234 for the password
```

### Change the Title

Find this line (around line 15):
```html
<h1 class="text-3xl font-bold text-gray-800 mb-2">🔒 Softball Tryout Scorer</h1>
```

Change to:
```html
<h1 class="text-3xl font-bold text-gray-800 mb-2">🔒 GC Softball Tryouts 2026</h1>
```

---

## ✅ Recommended Setup

For your tryout situation, I recommend:

1. **Change password to something memorable:** Like `GCTryout2026`
2. **Test it yourself first:** Open the file, make sure the password works
3. **Share password via text/phone:** Don't put it in the email with the file
4. **Keep Google Sheet "Restricted":** This is your real security (see GOOGLE_SHEET_SECURITY.md)
5. **Tell coaches:** "Password is remembered while app is open"

---

## 📋 Quick Reference

**Default Password:** `tryout2026`
**Location in File:** Line ~268
**How to Change:** Open in text editor, change the password, save
**How Users See It:** Password screen on first open, remembered during session
**Security Level:** Basic protection for trusted group

---

## 🆘 Need Help?

- Open `index.html` in Notepad/TextEdit to see the password
- Password is always visible in the file (not encrypted)
- This is intentional - makes it easy to manage and change
- Real security comes from your Google Sheet permissions

---

Your app is now password protected! Change the default password and you're ready to share it with your coaches.
