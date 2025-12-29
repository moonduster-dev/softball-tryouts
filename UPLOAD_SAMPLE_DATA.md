# How to Upload Sample Data to Your Softball Tryouts Spreadsheet

## Quick Steps

### Method 1: Using Browser Console (Recommended)

1. **Open your softball tryouts page** ([index.html](index.html)) in your web browser

2. **Open the browser console**:
   - Press `F12` (Windows/Linux) or `Cmd+Option+J` (Mac)
   - Or right-click anywhere → Inspect → Console tab

3. **Load the sample data**:
   - Open [sample_data.js](sample_data.js) in a text editor
   - Copy the **entire contents** of the file
   - Paste it into the browser console
   - Press Enter

4. **Apply the sample data**:
   In the console, run these commands one by one:
   ```javascript
   players = samplePlayers;
   ```
   ```javascript
   saveData();
   ```
   ```javascript
   uploadToSheets();
   ```

5. **Verify the upload**:
   - You should see "✓ Auto-synced to Google Sheets" message
   - Open your Google Spreadsheet to verify the data appears

## What's Included in the Sample Data

The sample data includes **10 players** with complete tryout information:

### Players:
1. Emily Rodriguez (#12) - Strong all-around player
2. Sarah Chen (#7) - Good hustle and energy
3. Madison Taylor (#23) - Excellent speed and fielding
4. Olivia Martinez (#15) - Solid fundamentals
5. Ava Johnson (#9) - Fast runner with good hitting
6. Sophia Anderson (#3) - Balanced skills
7. Isabella Brown (#18) - Top performer in most drills
8. Mia Wilson (#21) - Developing player
9. Charlotte Davis (#5) - Elite athlete, top scores
10. Amelia Garcia (#11) - Consistent performer

### Each Player Has:
- **Hustle & Energy**: Attitude, runs on/off field, cheers for teammates, dives for balls, aggressive baserunning
- **Fielding Data**: Fly ball tracking, throwing speed (3 attempts), throwing accuracy (3 attempts)
- **Hitting Data**: Bat speed (3 attempts), exit velocity (3 attempts), bunting skills (1B, P, 3B), pitch recognition, strike recognition
- **Speed Drills**: H→1B times, H→2B times, H→H times, Broad Jump distances (all 3 attempts each)
- **Catcher Data**: Pop time, throw accuracy, throw speed, pop fly catching, blocking score, bunt fielding score
- **Pitching Data**: Fastball speed (3 attempts), accuracy, movement, mechanics

## Troubleshooting

### If you get an error "uploadToSheets is not defined":
- Make sure you're on the softball tryouts page (index.html)
- Refresh the page and try again

### If the upload shows 403 error:
- Follow the steps in [FIX_403_NEW_DEPLOYMENT.md](FIX_403_NEW_DEPLOYMENT.md)
- You need to create a new Google Apps Script deployment with proper permissions

### If data doesn't appear in spreadsheet:
- Check that your Google Apps Script URL is configured in index.html (line 427)
- Make sure you've deployed the Apps Script as a web app
- Verify permissions are granted (see [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md))

## Customizing the Sample Data

To create your own sample data or modify the existing data:

1. Open [sample_data.js](sample_data.js) in a text editor
2. Modify the player information:
   - Change names, numbers, scores
   - Add or remove players
   - Adjust any drill values
3. Save the file
4. Follow the upload steps above

### Sample Player Structure:
```javascript
{
  id: 1,
  name: "Player Name",
  number: "12",
  hustleEnergy: { attitude: 5, runsonoff: 5, cheers: 4, dives: 5, baserunning: 4 },
  fieldingData: { flyball: 7, throwspeed: [1.85, 1.92, 1.88], throwaccuracy: [1, 1, 1] },
  hittingData: {
    batspeed: [62, 64, 61],
    exitvelocity: [68, 72, 70],
    bunt1b: [1, 1, 1],
    buntp: [1, 1, 0],
    bunt3b: [1, 1, 1],
    pitchrecog: [1, 1, 1, 1, 0],
    strikerecog: [1, 1, 1, 1, 1]
  },
  speedTimes: {
    h1b: [3.2, 3.1, 3.3],
    h2b: [5.8, 6.0, 5.9],
    hh: [12.1, 12.3, 11.9],
    broadjump: [6.8, 7.1, 6.9]
  },
  catcherData: {
    poptime: [2.45, 2.38, 2.42],
    throwaccuracy: [1, 1, 0],
    throwspeed: [58, 60, 59],
    popfly: [1, 1, 1],
    blocking: 4,
    buntfielding: 5
  },
  pitchingData: {
    fastballspeed: [55, 58, 56],
    accuracy: 4,
    movement: 4,
    mechanics: 5
  }
}
```

## Notes

- **Accuracy values**: 1 = success, 0 = miss
- **Throwing/running times**: Lower is better (seconds)
- **Speeds**: Higher is better (mph)
- **Broad jump**: Higher is better (feet)
- **Most scores**: 0-5 scale (5 is best)
- **Fly ball tracking**: Out of 8 attempts

---

**Need Help?** Check the other documentation files:
- [SCORING_CONFIG_GUIDE.md](SCORING_CONFIG_GUIDE.md) - Configure scoring thresholds
- [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) - Set up Google Sheets sync
- [FIX_403_NEW_DEPLOYMENT.md](FIX_403_NEW_DEPLOYMENT.md) - Fix upload errors
