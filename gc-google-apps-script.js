// Google Apps Script Code for GC Softball Tryouts 2026
// This code runs on Google's servers and connects your app to Google Sheets

// INSTRUCTIONS:
// 1. Open your Google Spreadsheet: https://docs.google.com/spreadsheets/d/1szLJvVQfPBQJk2SDz2YzP4TJBw4hjAfpnmlWI9fVuUY
// 2. Go to Extensions → Apps Script
// 3. DELETE ALL EXISTING CODE
// 4. Copy and paste ALL of this code
// 5. Click the disk icon to save
// 6. Click "Deploy" → "New deployment"
// 7. Select "Web app" as the type
// 8. Set "Execute as" to "Me"
// 9. Set "Who has access" to "Anyone"
// 10. Click "Deploy" and authorize when prompted
// 11. Copy the Web app URL and paste it into gc_softball_tryouts.html

const SHEET_NAME = 'TryoutData';
const READABLE_SHEET_NAME = 'Players (Readable)';

function doGet(e) {
  try {
    return loadData();
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    let players;
    if (e.parameter && e.parameter.data) {
      players = JSON.parse(e.parameter.data);
    } else if (e.postData && e.postData.contents) {
      const formData = e.postData.contents;
      const params = formData.split('&').reduce((acc, pair) => {
        const [key, value] = pair.split('=');
        acc[decodeURIComponent(key)] = decodeURIComponent(value);
        return acc;
      }, {});
      players = JSON.parse(params.data || '[]');
    } else {
      throw new Error('No data received');
    }

    const sheet = getOrCreateSheet();

    if (sheet.getLastRow() > 1) {
      sheet.deleteRows(2, sheet.getLastRow() - 1);
    }

    sheet.getRange(2, 1).setValue(JSON.stringify(players));
    sheet.getRange(2, 2).setValue(new Date());

    updateReadableSheet(players);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Data saved successfully',
        timestamp: new Date().toISOString(),
        playerCount: players.length
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function loadData() {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();

    let result = '[]';
    if (data.length > 1) {
      result = data[1][0] || '[]';
    }

    return ContentService
      .createTextOutput(result)
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function updateReadableSheet(players) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let readableSheet = ss.getSheetByName(READABLE_SHEET_NAME);

  if (!readableSheet) {
    readableSheet = ss.insertSheet(READABLE_SHEET_NAME);
  }

  readableSheet.clear();

  const headers = [
    'Rank', 'Name', 'Jersey #',
    // Catching
    'Pop Time Best', 'Pop Time Score', 'Throw Acc Total', 'Blocking', 'Footwork', 'Mobility', 'Expl-Throw', 'Expl-Bunt', 'Catching Total', 'Catching Notes',
    // Baserunning Speed
    'H→1B Best', 'H→1B Score', '2B→H Best', '2B→H Score', 'H→3B Adj', 'H→3B Score', 'H→H Adj', 'H→H Score',
    // Baserunning Explosiveness
    'Pro Agility Best', 'Pro Agility Score', 'Broad Jump Best', 'Broad Jump Score',
    // Scrimmage (averaged)
    'Chop Step Avg', 'Rounding Avg', 'Sliding Avg', 'Softball IQ Avg', 'Aggressiveness Avg',
    'Baserunning Total', 'Baserunning Notes',
    // Intangibles (averaged)
    'Awareness Avg', 'Leadership Avg', 'Enthusiasm Avg', 'Intangibles Total', 'Intangibles Notes',
    // Grand Total
    'GRAND TOTAL'
  ];

  readableSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  readableSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  readableSheet.setFrozenRows(1);

  if (players.length === 0) return;

  const sortedPlayers = players.sort((a, b) => getGrandTotal(b) - getGrandTotal(a));

  const rows = sortedPlayers.map((player, index) => {
    const c = player.catching || {};
    const b = player.baserunning || {};
    const intang = player.intangibles || {};

    // Catching calculations
    const poptimeBest = getBestTime(c.poptime || []);
    const poptimeScore = calculatePopTimeScore(c.poptime || []);
    const throwAccTotal = sumArray(c.throwaccuracy || []);
    const catchingTotal = poptimeScore + throwAccTotal + (c.blocking || 0) + (c.footwork || 0) + (c.mobility || 0) + (c.explosiveness_throwing || 0) + (c.explosiveness_bunts || 0);

    // Baserunning speed calculations
    const h1bBest = getAdjustedBestH1B(b.h1b || { times: [null, null], missed1b: [false, false] });
    const h1bScore = calculateSpeedScore('h1b', h1bBest);
    const tbhBest = getAdjustedBest2BH(b['2bh'] || { times: [null, null], missed3b: [false, false] });
    const tbhScore = calculateSpeedScore('2bh', tbhBest);
    const h3bAdj = getAdjustedH3B(b.h3b || { time: null, nostick: false });
    const h3bScore = calculateSpeedScore('h3b', h3bAdj);
    const hhAdj = getAdjustedHH(b.hh || { time: null, missedbase: false });
    const hhScore = calculateSpeedScore('hh', hhAdj);

    // Explosiveness
    const proAgilityBest = getBestTime(b.proagility || []);
    const proAgilityScore = calculateProAgilityScore(b.proagility || []);
    const broadJumpBest = getBestBroadJump(b.broadjump || []);
    const broadJumpScore = calculateBroadJumpScore(b.broadjump || []);

    // Scrimmage averages
    const scrimmage = b.scrimmage || {};
    const chopstepAvg = calculateAverageScore(scrimmage, 'chopstep');
    const roundingAvg = calculateAverageScore(scrimmage, 'rounding');
    const slidingAvg = calculateAverageScore(scrimmage, 'sliding');
    const softballiqAvg = calculateAverageScore(scrimmage, 'softballiq');
    const aggressivenessAvg = calculateAverageScore(scrimmage, 'aggressiveness');

    const baserunningTotal = h1bScore + tbhScore + h3bScore + hhScore + proAgilityScore + broadJumpScore + chopstepAvg + roundingAvg + slidingAvg + softballiqAvg + aggressivenessAvg;

    // Intangibles averages
    const awarenessAvg = calculateAverageScore(intang, 'awareness');
    const leadershipAvg = calculateAverageScore(intang, 'leadership');
    const enthusiasmAvg = calculateAverageScore(intang, 'enthusiasm');
    const intangiblesTotal = awarenessAvg + leadershipAvg + enthusiasmAvg;

    const grandTotal = catchingTotal + baserunningTotal + intangiblesTotal;

    // Format notes for each category
    const catchingNotes = formatNotes(c.notes || []);
    const baserunningNotes = formatNotes(b.notes || []);
    const intangiblesNotes = formatNotes(intang.notes || []);

    return [
      index + 1,
      player.name,
      player.number || '',
      poptimeBest || '',
      poptimeScore,
      throwAccTotal,
      c.blocking || '',
      c.footwork || '',
      c.mobility || '',
      c.explosiveness_throwing || '',
      c.explosiveness_bunts || '',
      catchingTotal,
      catchingNotes,
      h1bBest || '',
      h1bScore,
      tbhBest || '',
      tbhScore,
      h3bAdj || '',
      h3bScore,
      hhAdj || '',
      hhScore,
      proAgilityBest || '',
      proAgilityScore,
      broadJumpBest || '',
      broadJumpScore,
      chopstepAvg.toFixed(1),
      roundingAvg.toFixed(1),
      slidingAvg.toFixed(1),
      softballiqAvg.toFixed(1),
      aggressivenessAvg.toFixed(1),
      baserunningTotal.toFixed(1),
      baserunningNotes,
      awarenessAvg.toFixed(1),
      leadershipAvg.toFixed(1),
      enthusiasmAvg.toFixed(1),
      intangiblesTotal.toFixed(1),
      intangiblesNotes,
      grandTotal.toFixed(1)
    ];
  });

  if (rows.length > 0) {
    readableSheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }

  for (let i = 1; i <= headers.length; i++) {
    readableSheet.autoResizeColumn(i);
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatNotes(notes) {
  if (!notes || !Array.isArray(notes) || notes.length === 0) return '';
  return notes.map(function(n) {
    return n.coach + ': ' + n.text;
  }).join(' | ');
}

function getBestTime(times) {
  if (!times || !Array.isArray(times)) return null;
  const valid = times.filter(t => t !== null && !isNaN(t));
  if (valid.length === 0) return null;
  return Math.min(...valid).toFixed(2);
}

function getBestDistance(distances) {
  if (!distances || !Array.isArray(distances)) return null;
  const valid = distances.filter(d => d !== null && !isNaN(d));
  if (valid.length === 0) return null;
  return Math.max(...valid).toFixed(1);
}

function getBestBroadJump(jumps) {
  if (!jumps || !Array.isArray(jumps)) return null;
  let bestTotal = null;
  let bestFeet = null;
  let bestInches = null;

  jumps.forEach(function(jump) {
    if (jump && typeof jump === 'object' && jump.feet !== null && jump.feet !== undefined) {
      var totalInches = (jump.feet * 12) + (jump.inches || 0);
      if (bestTotal === null || totalInches > bestTotal) {
        bestTotal = totalInches;
        bestFeet = jump.feet;
        bestInches = jump.inches || 0;
      }
    } else if (typeof jump === 'number') {
      // Handle legacy format (just feet as decimal)
      var totalInches = jump * 12;
      if (bestTotal === null || totalInches > bestTotal) {
        bestTotal = totalInches;
        bestFeet = Math.floor(jump);
        bestInches = Math.round((jump - Math.floor(jump)) * 12);
      }
    }
  });

  if (bestTotal === null) return null;
  return bestFeet + "' " + bestInches + '"';
}

function getBroadJumpInFeet(jumps) {
  if (!jumps || !Array.isArray(jumps)) return null;
  let best = null;

  jumps.forEach(function(jump) {
    if (jump && typeof jump === 'object' && jump.feet !== null && jump.feet !== undefined) {
      var totalFeet = jump.feet + ((jump.inches || 0) / 12);
      if (best === null || totalFeet > best) {
        best = totalFeet;
      }
    } else if (typeof jump === 'number') {
      // Handle legacy format
      if (best === null || jump > best) {
        best = jump;
      }
    }
  });

  return best;
}

function sumArray(arr) {
  if (!arr || !Array.isArray(arr)) return 0;
  return arr.filter(v => v !== null && !isNaN(v)).reduce((sum, v) => sum + parseInt(v), 0);
}

function getAdjustedBestH1B(data) {
  if (!data || !data.times) return null;
  let best = null;
  for (let i = 0; i < 2; i++) {
    if (data.times[i] !== null && data.times[i] !== undefined) {
      let adjusted = parseFloat(data.times[i]) + (data.missed1b && data.missed1b[i] ? 0.5 : 0);
      if (best === null || adjusted < best) best = adjusted;
    }
  }
  return best ? best.toFixed(2) : null;
}

function getAdjustedBest2BH(data) {
  if (!data || !data.times) return null;
  let best = null;
  for (let i = 0; i < 2; i++) {
    if (data.times[i] !== null && data.times[i] !== undefined) {
      let adjusted = parseFloat(data.times[i]) + (data.missed3b && data.missed3b[i] ? 1 : 0);
      if (best === null || adjusted < best) best = adjusted;
    }
  }
  return best ? best.toFixed(2) : null;
}

function getAdjustedH3B(data) {
  if (!data || data.time === null || data.time === undefined) return null;
  return (parseFloat(data.time) + (data.nostick ? 1 : 0)).toFixed(2);
}

function getAdjustedHH(data) {
  if (!data || data.time === null || data.time === undefined) return null;
  return (parseFloat(data.time) + (data.missedbase ? 1 : 0)).toFixed(2);
}

function calculateSpeedScore(drill, time) {
  if (time === null || time === undefined || time === 'N/A') return 0;
  const t = parseFloat(time);

  const thresholds = {
    'h1b': { t5: 3.1, t4: 3.8, t3: 4.6, t2: 5.2 },
    '2bh': { t5: 5.75, t4: 6.25, t3: 7, t2: 8 },
    'h3b': { t5: 8.6, t4: 9.4, t3: 10.5, t2: 12 },
    'hh': { t5: 11.8, t4: 13.3, t3: 15.0, t2: 17.0 },
    'poptime': { t5: 2.3, t4: 2.5, t3: 2.7, t2: 3.0 }
  };

  const config = thresholds[drill];
  if (!config) return 0;

  if (t < config.t5) return 5;
  if (t < config.t4) return 4;
  if (t < config.t3) return 3;
  if (t < config.t2) return 2;
  return 1;
}

function calculatePopTimeScore(times) {
  const best = getBestTime(times);
  if (!best) return 0;
  return calculateSpeedScore('poptime', best);
}

function calculateProAgilityScore(times) {
  const best = getBestTime(times);
  if (!best) return 0;
  const t = parseFloat(best);
  if (t < 4.3) return 5;
  if (t <= 4.6) return 4;
  if (t <= 5.0) return 3;
  if (t <= 5.5) return 2;
  return 1;
}

function calculateBroadJumpScore(jumps) {
  const best = getBroadJumpInFeet(jumps);
  if (!best) return 0;
  const d = best;
  if (d < 4) return 1;
  if (d < 5) return 2;
  if (d < 6) return 3;
  if (d < 7) return 4;
  return 5;
}

function calculateAverageScore(coachScores, drillId) {
  if (!coachScores) return 0;
  const scores = [];
  Object.values(coachScores).forEach(coach => {
    if (coach && coach[drillId] !== undefined && coach[drillId] !== null) {
      scores.push(coach[drillId]);
    }
  });
  if (scores.length === 0) return 0;
  return scores.reduce((sum, s) => sum + s, 0) / scores.length;
}

function getGrandTotal(player) {
  const c = player.catching || {};
  const b = player.baserunning || {};
  const intang = player.intangibles || {};

  // Catching
  const poptimeScore = calculatePopTimeScore(c.poptime || []);
  const throwAccTotal = sumArray(c.throwaccuracy || []);
  const catchingTotal = poptimeScore + throwAccTotal + (c.blocking || 0) + (c.footwork || 0) + (c.mobility || 0) + (c.explosiveness_throwing || 0) + (c.explosiveness_bunts || 0);

  // Baserunning
  const h1bScore = calculateSpeedScore('h1b', getAdjustedBestH1B(b.h1b || { times: [null, null], missed1b: [false, false] }));
  const tbhScore = calculateSpeedScore('2bh', getAdjustedBest2BH(b['2bh'] || { times: [null, null], missed3b: [false, false] }));
  const h3bScore = calculateSpeedScore('h3b', getAdjustedH3B(b.h3b || { time: null, nostick: false }));
  const hhScore = calculateSpeedScore('hh', getAdjustedHH(b.hh || { time: null, missedbase: false }));
  const proAgilityScore = calculateProAgilityScore(b.proagility || []);
  const broadJumpScore = calculateBroadJumpScore(b.broadjump || []);

  const scrimmage = b.scrimmage || {};
  const scrimmageTotal = calculateAverageScore(scrimmage, 'chopstep') + calculateAverageScore(scrimmage, 'rounding') + calculateAverageScore(scrimmage, 'sliding') + calculateAverageScore(scrimmage, 'softballiq') + calculateAverageScore(scrimmage, 'aggressiveness');

  const baserunningTotal = h1bScore + tbhScore + h3bScore + hhScore + proAgilityScore + broadJumpScore + scrimmageTotal;

  // Intangibles
  const intangiblesTotal = calculateAverageScore(intang, 'awareness') + calculateAverageScore(intang, 'leadership') + calculateAverageScore(intang, 'enthusiasm');

  return catchingTotal + baserunningTotal + intangiblesTotal;
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1).setValue('Player Data (JSON)');
    sheet.getRange(1, 2).setValue('Last Updated');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function setupSheet() {
  const sheet = getOrCreateSheet();
  Logger.log('Sheet created: ' + sheet.getName());
  return 'Setup complete!';
}
