# 🖼️ How to Add Your Logo to the App

I've added logo placeholders to your app in TWO places:
1. **Main app header** (top of the page after unlocking)
2. **Password screen** (shows before unlocking)

Now you just need to replace the placeholder with your actual logo!

---

## 🎯 EASIEST METHOD: Use Base64 (Single File)

**Best for:** Keeping everything in one HTML file for easy sharing

### Step 1: Convert Your Logo to Base64

1. **Go to this website:** https://www.base64-image.de/
2. **Click "Choose File"** and select your logo (PNG, JPG, or SVG work best)
3. **Click "Copy image"** button - this copies the base64 code
4. You'll get something like: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...`

### Step 2: Replace the Placeholder in Your HTML

1. **Open `index.html` in Notepad/TextEdit**
2. **Find these two lines** (use Ctrl+F or Cmd+F to search for "YOUR_BASE64"):

```html
<!-- Around line 17 (password screen) -->
src="data:image/png;base64,YOUR_BASE64_CODE_HERE"

<!-- Around line 49 (main app header) -->
src="data:image/png;base64,YOUR_BASE64_CODE_HERE"
```

3. **Replace BOTH instances** of `YOUR_BASE64_CODE_HERE` with the base64 code you copied

**Example:**
```html
<!-- Before -->
src="data:image/png;base64,YOUR_BASE64_CODE_HERE"

<!-- After -->
src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
```

4. **Save the file** (Ctrl+S or Cmd+S)
5. **Open and test!**

---

## 🎯 ALTERNATIVE METHOD: Use Separate Image File

**Best for:** If you want to keep image separate and easier to update

### Step 1: Save Your Logo File

1. **Name your logo:** `logo.png` (or `logo.jpg`)
2. **Save it in the SAME folder** as `index.html`

```
softball_tryouts/
  ├── index.html
  ├── logo.png          ← Your logo here!
  ├── QUICK_START.txt
  └── ...
```

### Step 2: Update the HTML

1. **Open `index.html` in Notepad/TextEdit**
2. **Find the two logo lines** (search for "YOUR_BASE64")
3. **Replace with just the filename:**

```html
<!-- Around line 17 (password screen) -->
src="logo.png"

<!-- Around line 49 (main app header) -->
src="logo.png"
```

4. **Save the file**

### Step 3: Share BOTH Files

**Important:** Now you need to share TWO files:
- `index.html`
- `logo.png`

**How to share:**
- Email both as attachments
- Put both in a ZIP file
- Share both via Google Drive/Dropbox

⚠️ **Downside:** If someone only gets the HTML file, they won't see the logo (it'll show a broken image).

---

## 🎨 Adjusting Logo Size

You can change the logo size by editing the class in the HTML:

### Main Header Logo (Currently 64px × 64px):

Find line ~51:
```html
class="h-16 w-16 object-contain"
```

**Change to:**
- **Smaller (48px):** `class="h-12 w-12 object-contain"`
- **Larger (96px):** `class="h-24 w-24 object-contain"`
- **Wide logo:** `class="h-16 w-auto object-contain"` (keeps height, adjusts width)
- **Tall logo:** `class="h-auto w-16 object-contain"` (keeps width, adjusts height)

### Password Screen Logo (Currently 80px × 80px):

Find line ~19:
```html
class="h-20 w-20 object-contain mx-auto mb-4"
```

**Change to:**
- **Smaller (64px):** `class="h-16 w-16 object-contain mx-auto mb-4"`
- **Larger (128px):** `class="h-32 w-32 object-contain mx-auto mb-4"`

---

## 🎨 Logo Best Practices

### Recommended Logo Specs:

**Format:**
- ✅ **PNG** (supports transparency - best choice!)
- ✅ **SVG** (scales perfectly, small file size)
- ⚠️ **JPG** (works, but no transparency)

**Size:**
- **Square logos:** 200×200px to 512×512px
- **Wide logos:** 400×200px or similar
- **File size:** Keep under 100KB for fast loading

**Background:**
- ✅ **Transparent background** (PNG) looks best
- ⚠️ White background works if your logo has one

**Colors:**
- Make sure it's visible on white background (used in app)
- Consider a version with darker colors if your logo is very light

---

## 📍 Where the Logo Appears

### 1. Password Screen (Line ~16-21)
```
┌─────────────────────────┐
│      [YOUR LOGO]        │  ← Logo shows here
│  🔒 Softball Tryout     │
│        Scorer           │
│  Enter password         │
│  [___________]          │
│  [   Unlock   ]         │
└─────────────────────────┘
```

### 2. Main App Header (Line ~46-58)
```
┌────────────────────────────────────────┐
│ [LOGO] Softball Tryout Scorer          │  ← Logo shows here
│        Track player performance...      │
│                           [Buttons...] │
└────────────────────────────────────────┘
```

---

## 🔧 Quick Examples

### Example 1: Small Base64 Logo

If you have a simple logo, here's what the base64 might look like:

```html
src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA
AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHx
gljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
```

(This is a tiny 5×5 pixel red square - just for demonstration)

### Example 2: Using a Separate File

```html
<!-- If your logo file is named "team_logo.png" -->
src="team_logo.png"

<!-- If it's in a subfolder -->
src="images/logo.png"
```

---

## 🚫 Removing the Logo

If you decide you don't want a logo:

### Option 1: Delete the Image Tags

Remove these lines entirely:
- Lines ~16-21 (password screen logo)
- Lines ~48-53 (main header logo)

### Option 2: Hide It

Change both instances to:
```html
<img src="" alt="" style="display: none;" />
```

---

## ❓ Troubleshooting

**"I don't see the logo"**
- Check that you replaced BOTH instances of `YOUR_BASE64_CODE_HERE`
- Make sure you copied the ENTIRE base64 string (it's very long!)
- If using separate file, make sure `logo.png` is in same folder as `index.html`

**"Logo looks blurry"**
- Use a higher resolution image (at least 200×200px)
- PNG or SVG format works best
- Make sure your original logo is high quality

**"Logo is too big/small"**
- Change the `h-16 w-16` to `h-12 w-12` (smaller) or `h-24 w-24` (larger)
- See "Adjusting Logo Size" section above

**"Logo has white box around it"**
- Your logo has a white background
- Use a PNG with transparent background instead
- Or edit your logo in an image editor to remove the background

**"File size is huge after adding logo"**
- Base64 encoding makes the file larger
- Compress your logo before converting (use tinypng.com)
- Or use the separate file method instead

---

## 💡 Recommended Approach

**For your situation (emailing to coaches), I recommend:**

1. ✅ **Use Base64 method** - keeps everything in one file
2. ✅ **Use PNG with transparent background** - looks professional
3. ✅ **Keep logo around 200×200px** - good quality, not too large
4. ✅ **Compress the image first** - use tinypng.com to reduce file size
5. ✅ **Test it** - make sure it looks good before sharing

**Base64 pros:**
- Single file to share (easy!)
- Logo always works (can't get separated)
- No extra files to manage

**Base64 cons:**
- Makes HTML file larger
- Can't easily swap logos without editing HTML

---

## 🎯 Quick Start Summary

1. Go to https://www.base64-image.de/
2. Upload your logo
3. Click "Copy image"
4. Open `index.html` in Notepad
5. Find `YOUR_BASE64_CODE_HERE` (appears twice)
6. Paste your base64 code in BOTH places
7. Save and test!

Your logo will now appear on the password screen and main app header!
