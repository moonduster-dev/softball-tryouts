# Configurable Scoring System - User Guide

## Overview
All scoring thresholds for drills involving feet, mph, or seconds are now fully configurable through the Advanced Options menu.

## How to Access

1. Open your softball tryouts app
2. Click **"⚙️ Advanced Options"** button at the top
3. Scroll down to the **"⚙️ Scoring Configuration"** section

## Configurable Metrics

### Speed Drills (seconds/feet)
- **H→1B** - Input threshold times for 5, 4, 3, and 2 points
- **H→2B** - Input threshold times for 5, 4, 3, and 2 points
- **H→H** - Input threshold times for 5, 4, 3, and 2 points
- **Broad Jump** - Input threshold distances (in feet) for 1, 2, 3, and 4 points

### Hitting Drills (mph)
- **Bat Speed** - Input threshold speeds for 0, 1, 2, 3, and 4 points (5pts = above highest threshold)
- **Exit Velocity** - Input threshold speeds for 0, 1, 2, 3, and 4 points

### Fielding Drills (seconds)
- **Throwing Speed** - Input threshold times for 1, 2, 3, 4, and 5 points

### Catcher Drills
- **Pop Time** (seconds) - Input threshold times for 1, 2, 3, and 4 points
- **Catcher Throw Speed** (mph) - Input threshold speeds for 1, 2, 3, and 4 points

### Pitching Drills (mph)
- **Fastball Speed** - Input threshold speeds for 1, 2, 3, 4, and 5 points

## How to Use

### Changing Thresholds
1. Click in any input field
2. Enter your desired threshold value
3. The placeholder text shows what the threshold means (e.g., "5pts<" means "5 points if less than this value")
4. Click **"💾 Save Scoring Config"** to apply changes

### What Happens When You Save
- All threshold values are saved to browser localStorage
- All player scores are automatically recalculated with the new thresholds
- The current view refreshes to show updated scores
- Configuration persists across browser sessions

### Resetting to Defaults
1. Click **"Reset to Defaults"** button
2. All thresholds return to original factory values
3. Scores are automatically recalculated

## Default Threshold Values

### Speed Drills
- **H→1B**: 5pts<3.1s, 4pts<3.8s, 3pts<4.6s, 2pts<5.2s
- **H→2B**: 5pts<5.75s, 4pts<6.25s, 3pts<7s, 2pts<8s
- **H→H**: 5pts<11.8s, 4pts<13.3s, 3pts<15s, 2pts<17s
- **Broad Jump**: 1pt<4ft, 2pts<5ft, 3pts<6ft, 4pts<7ft

### Hitting Drills
- **Bat Speed**: 0pts≤40mph, 1pt≤50mph, 2pts≤55mph, 3pts≤60mph, 4pts≤65mph, 5pts>65mph
- **Exit Velocity**: 0pts≤50mph, 1pt≤55mph, 2pts≤60mph, 3pts≤65mph, 4pts≤70mph, 5pts>70mph

### Fielding Drills
- **Throwing Speed**: 1pt≥2.71s, 2pts≥2.1s, 3pts≥1.53s, 4pts≥1.41s, 5pts≤1.4s

### Catcher Drills
- **Pop Time**: 1pt>4s, 2pts≥3.15s, 3pts≥2.51s, 4pts≥2.31s, 5pts<2.31s
- **Catcher Throw Speed**: 1pt<40mph, 2pts<45mph, 3pts<52mph, 4pts≤65mph, 5pts>65mph

### Pitching Drills
- **Fastball Speed**: 1pt≤42mph, 2pts<47mph, 3pts<52mph, 4pts<57mph, 5pts≥60mph

## Tips

- **Hover over input fields** to see tooltips explaining what each threshold means
- **Make small adjustments** and save to see how scores change
- **Use realistic values** based on your players' typical performance ranges
- The configuration is **saved locally** in your browser - it won't sync to Google Sheets
- If multiple coaches use different computers, each will need to configure scoring separately

## Technical Details

- Configuration is stored in browser localStorage under the key `softball_scoring_config`
- All scoring functions dynamically use the configured thresholds
- When thresholds are updated, all player scores are recalculated in real-time
- The system supports decimal values for precise threshold control

## Example: Adjusting for Different Age Groups

If you're using this for younger players:

1. **Lower all speed thresholds** (slower times get higher points)
   - H→1B: Change 3.1s to 4.0s for 5 points
   - H→2B: Change 5.75s to 7.5s for 5 points

2. **Lower hitting thresholds** (lower bat speeds get higher points)
   - Bat Speed: Change 65mph to 55mph for 4 points
   - Exit Velocity: Change 70mph to 60mph for 4 points

3. Click **Save Scoring Config** and all scores update automatically!

---

**Questions or Issues?** The scoring logic is fully transparent - check the scoring functions in the code or adjust thresholds until you get the desired point distribution.
