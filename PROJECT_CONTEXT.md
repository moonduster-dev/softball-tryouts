# GC Softball Tryouts 2026 - Project Context

## Overview
A multi-coach softball tryout scoring application with Google Sheets integration.

## Key Files
- `gc_softball_tryouts.html` - Main application (single HTML file with embedded JS/CSS)
- `gc-google-apps-script.js` - Google Apps Script code for Sheets integration
- GitHub: https://github.com/moonduster-dev/softball-tryouts

## Google Sheets
- Spreadsheet ID: `1szLJvVQfPBQJk2SDz2YzP4TJBw4hjAfpnmlWI9fVuUY`
- Current Script URL in app: Check `GOOGLE_SCRIPT_URL` constant in gc_softball_tryouts.html

## Authentication
- 7 coach accounts: nick, bob, sophia, amy, bill, gabby, guest
- Password for all: `nick2026`
- localStorage key: `gc_softball_tryouts_2026`

## Scoring Categories

**NOTE: All multi-attempt drills are scored based on AVERAGE of attempts (not best).**

### Catching (30 points max)
- Pop Time: 2 attempts, **averaged**, scored 1-5 based on thresholds
- Throw Accuracy: 3 attempts, 0-3 each (9 max)
- Blocking, Footwork, Mobility: 0-3 each
- Explosiveness (Throwing), Explosiveness (Bunts): 0-3 each

### Baserunning (35 points max)
**Speed Metrics (timed, **averaged**, scored 1-5):**
- H→1B: 2 attempts **averaged**, +0.5s penalty per attempt if missed 1B
- 2B→H: 2 attempts **averaged**, +1s penalty per attempt if missed 3B
- H→3B: 1 attempt, +1s penalty if no stick
- H→H: 1 attempt, +1s penalty if missed base

**Explosiveness:**
- Pro Agility: 2 attempts **averaged**, scored 1-5
- Broad Jump: 2 attempts in feet/inches **averaged**, scored 1-5

**Scrimmage (coach-averaged, 1-3 each):**
- Chop Step, Rounding, Sliding, Softball IQ, Aggressiveness

### Intangibles (15 points max, coach-averaged, 1-5 each)
- Game Situation Awareness
- Leadership
- Enthusiasm

## Features Implemented
1. Multi-coach login with session storage
2. Auto-sync to Google Sheets (1 second debounce)
3. Category icons (catcher.jpg, pitching.jpg, fielding.jpg, hitting.jpg, softball fielding.JPG)
4. Broad jump in feet + inches format
5. **Coach Notes** - Each category has a notes section where coaches can add timestamped notes
6. **Summary Reports** - Generate individual or all-player reports, exportable as HTML

## Data Structure (per player)
```javascript
{
  id: number,
  name: string,
  number: string,
  catching: {
    poptime: [null, null],
    throwaccuracy: [null, null, null],
    blocking: null,
    footwork: null,
    mobility: null,
    explosiveness_throwing: null,
    explosiveness_bunts: null,
    notes: [{ coach: string, text: string, timestamp: string }]
  },
  baserunning: {
    h1b: { times: [null, null], missed1b: [false, false] },
    '2bh': { times: [null, null], missed3b: [false, false] },
    h3b: { time: null, nostick: false },
    hh: { time: null, missedbase: false },
    proagility: [null, null],
    broadjump: [{ feet: null, inches: null }, { feet: null, inches: null }],
    scrimmage: { [coachName]: { chopstep, rounding, sliding, softballiq, aggressiveness } },
    notes: [{ coach: string, text: string, timestamp: string }]
  },
  intangibles: {
    [coachName]: { awareness, leadership, enthusiasm },
    notes: [{ coach: string, text: string, timestamp: string }]
  }
}
```

## Scoring Thresholds
```javascript
// Speed (lower is better)
h1b: { t5: 3.1, t4: 3.8, t3: 4.6, t2: 5.2 }
'2bh': { t5: 5.75, t4: 6.25, t3: 7, t2: 8 }
h3b: { t5: 8.6, t4: 9.4, t3: 10.5, t2: 12 }
hh: { t5: 11.8, t4: 13.3, t3: 15.0, t2: 17.0 }
poptime: { t5: 2.3, t4: 2.5, t3: 2.7, t2: 3.0 }

// Pro Agility (lower is better)
<4.3=5, <=4.6=4, <=5.0=3, <=5.5=2, else=1

// Broad Jump (higher is better, in feet)
<4=1, <5=2, <6=3, <7=4, >=7=5
```

## Categories Coming Soon (disabled)
- Pitching
- Fielding
- Throwing
- Hitting

## Recent Changes
- Added coach notes to all categories
- Added summary report generation with export
- Changed broad jump to feet + inches input
- Fixed report generation errors for undefined data

## To Resume Development
1. Read this file first
2. Read gc_softball_tryouts.html for current implementation
3. Read gc-google-apps-script.js if modifying Sheets integration
4. After changes, commit and push to GitHub
5. Update Google Apps Script in spreadsheet if gc-google-apps-script.js changes
