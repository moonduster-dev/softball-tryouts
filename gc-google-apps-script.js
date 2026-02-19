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

    // Clear existing data instead of deleting rows (avoids frozen row issues)
    if (sheet.getLastRow() > 1) {
      const numRowsToClear = sheet.getLastRow() - 1;
      sheet.getRange(2, 1, numRowsToClear, 2).clearContent();
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
    // Baserunning (matches CSV export)
    'H-1B Avg', 'H-1B Score', '2B-H Avg', '2B-H Score', 'Pro Agility Avg', 'Pro Agility Score', 'Broad Jump Avg', 'Broad Jump Score', 'Baserunning Total',
    // Hitting (matches CSV export)
    'Bat Speed Avg', 'Bat Speed Score', 'Balance', 'Bat Path', 'Contact', 'Timing', 'Hit High Motor', 'Hitting Total',
    // Infield (matches CSV export)
    'IF Fielding Mech', 'IF Arm Str/Acc', 'Receiving Mech', 'MI Feed Mech', 'IF Agility/Expl', 'IF High Motor', 'Infield Total',
    // Outfield (matches CSV export)
    'OF Fielding Mech', 'OF Arm Str/Acc', 'Range/Agility', 'Fly Ball Pos/Trans', 'OF High Motor', 'Outfield Total',
    // Throwing (matches CSV export)
    'Velocity Avg', 'Throwing Score',
    // Intangibles (matches CSV export)
    'Awareness', 'Leadership', 'Enthusiasm', 'Intangibles Total',
    // Catching (new structure - matches CSV export)
    'Pop Time Avg', 'Pop Time Score', 'Setup/Stance', 'Arm Str/Acc', 'Block/Popups', 'Framing', 'Foot/Agility', 'Catch High Motor', 'Catching Total',
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
    const inf = player.infield || {};
    const outf = player.outfield || {};
    const h = player.hitting || {};
    const t = player.throwing || {};

    // Baserunning calculations (no h3b/hh - matches current app)
    const h1bAvg = getAdjustedAvgH1B(b.h1b || { times: [null, null], missed1b: [false, false] });
    const h1bScore = calculateSpeedScore('h1b', h1bAvg);
    const tbhAvg = getAdjustedAvg2BH(b['2bh'] || { times: [null, null], missed3b: [false, false] });
    const tbhScore = calculateSpeedScore('2bh', tbhAvg);
    const proAgilityAvg = getAverageTime(b.proagility || []);
    const proAgilityScore = calculateProAgilityScore(b.proagility || []);
    const broadJumpAvg = getAverageBroadJump(b.broadjump || []);
    const broadJumpScore = calculateBroadJumpScore(b.broadjump || []);
    const baserunningTotal = h1bScore + tbhScore + proAgilityScore + broadJumpScore;

    // Hitting calculations
    const batSpeedAvg = getAverageBatSpeed(h.batSpeed || []);
    const batSpeedScore = calculateBatSpeedScore(h.batSpeed || []);
    const hitEval = h.evaluation || {};
    const hitBalanceAvg = calculateAverageScore(hitEval, 'balance');
    const hitBatPathAvg = calculateAverageScore(hitEval, 'batPath');
    const hitContactAvg = calculateAverageScore(hitEval, 'contact');
    const hitTimingAvg = calculateAverageScore(hitEval, 'timing');
    const hitHighMotorAvg = calculateAverageScore(hitEval, 'highMotor');
    const hittingTotal = batSpeedScore + hitBalanceAvg + hitBatPathAvg + hitContactAvg + hitTimingAvg + hitHighMotorAvg;

    // Infield calculations
    const infEval = inf.evaluation || {};
    const ifFieldingMechAvg = calculateAverageScore(infEval, 'fieldingMechanics');
    const ifArmStrengthAvg = calculateAverageScore(infEval, 'armStrength');
    const ifReceivingMechAvg = calculateAverageScore(infEval, 'receivingMechanics');
    const ifMiFeedAvg = calculateAverageScore(infEval, 'miFeed');
    const ifAgilityAvg = calculateAverageScore(infEval, 'agility');
    const ifHighMotorAvg = calculateAverageScore(infEval, 'highMotor');
    const infieldTotal = ifFieldingMechAvg + ifArmStrengthAvg + ifReceivingMechAvg + ifMiFeedAvg + ifAgilityAvg + ifHighMotorAvg;

    // Outfield calculations
    const outfEval = outf.evaluation || {};
    const ofFieldingMechAvg = calculateAverageScore(outfEval, 'fieldingMechanics');
    const ofArmStrengthAvg = calculateAverageScore(outfEval, 'armStrength');
    const ofRangeAgilityAvg = calculateAverageScore(outfEval, 'rangeAgility');
    const ofFlyBallAvg = calculateAverageScore(outfEval, 'flyBallMechanics');
    const ofHighMotorAvg = calculateAverageScore(outfEval, 'highMotor');
    const outfieldTotal = ofFieldingMechAvg + ofArmStrengthAvg + ofRangeAgilityAvg + ofFlyBallAvg + ofHighMotorAvg;

    // Throwing calculations
    const velocityAvg = getAverageVelocity(t.velocity || []);
    const throwingScore = calculateThrowingScore(t.velocity || []);

    // Intangibles calculations (coach-keyed directly on intang object)
    const awarenessAvg = calculateAverageScore(intang, 'awareness');
    const leadershipAvg = calculateAverageScore(intang, 'leadership');
    const enthusiasmAvg = calculateAverageScore(intang, 'enthusiasm');
    const intangiblesTotal = awarenessAvg + leadershipAvg + enthusiasmAvg;

    // Catching calculations (new structure with evaluation object)
    const poptimeAvg = getAverageTime(c.poptime || []);
    const poptimeScore = calculatePopTimeScore(c.poptime || []);
    const catchEval = c.evaluation || {};
    const setupStanceAvg = calculateAverageScore(catchEval, 'setupStance');
    const catchArmStrengthAvg = calculateAverageScore(catchEval, 'armStrength');
    const blockingPopupsAvg = calculateAverageScore(catchEval, 'blockingPopups');
    const framingAvg = calculateAverageScore(catchEval, 'framing');
    const footworkAgilityAvg = calculateAverageScore(catchEval, 'footworkAgility');
    const catchHighMotorAvg = calculateAverageScore(catchEval, 'highMotor');
    const catchingTotal = poptimeScore + setupStanceAvg + catchArmStrengthAvg + blockingPopupsAvg + framingAvg + footworkAgilityAvg + catchHighMotorAvg;

    const grandTotal = baserunningTotal + hittingTotal + infieldTotal + outfieldTotal + throwingScore + intangiblesTotal + catchingTotal;

    return [
      index + 1,
      player.name,
      player.number || '',
      // Baserunning
      h1bAvg || '',
      h1bScore,
      tbhAvg || '',
      tbhScore,
      proAgilityAvg || '',
      proAgilityScore,
      broadJumpAvg || '',
      broadJumpScore,
      baserunningTotal.toFixed(1),
      // Hitting
      batSpeedAvg !== null ? batSpeedAvg.toFixed(1) : '',
      batSpeedScore,
      hitBalanceAvg.toFixed(1),
      hitBatPathAvg.toFixed(1),
      hitContactAvg.toFixed(1),
      hitTimingAvg.toFixed(1),
      hitHighMotorAvg.toFixed(1),
      hittingTotal.toFixed(1),
      // Infield
      ifFieldingMechAvg.toFixed(1),
      ifArmStrengthAvg.toFixed(1),
      ifReceivingMechAvg.toFixed(1),
      ifMiFeedAvg.toFixed(1),
      ifAgilityAvg.toFixed(1),
      ifHighMotorAvg.toFixed(1),
      infieldTotal.toFixed(1),
      // Outfield
      ofFieldingMechAvg.toFixed(1),
      ofArmStrengthAvg.toFixed(1),
      ofRangeAgilityAvg.toFixed(1),
      ofFlyBallAvg.toFixed(1),
      ofHighMotorAvg.toFixed(1),
      outfieldTotal.toFixed(1),
      // Throwing
      velocityAvg !== null ? velocityAvg.toFixed(1) : '',
      throwingScore.toFixed(1),
      // Intangibles
      awarenessAvg.toFixed(1),
      leadershipAvg.toFixed(1),
      enthusiasmAvg.toFixed(1),
      intangiblesTotal.toFixed(1),
      // Catching
      poptimeAvg || '',
      poptimeScore,
      setupStanceAvg.toFixed(1),
      catchArmStrengthAvg.toFixed(1),
      blockingPopupsAvg.toFixed(1),
      framingAvg.toFixed(1),
      footworkAgilityAvg.toFixed(1),
      catchHighMotorAvg.toFixed(1),
      catchingTotal.toFixed(1),
      // Grand Total
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

function getAverageTime(times) {
  if (!times || !Array.isArray(times)) return null;
  const valid = times.filter(t => t !== null && !isNaN(t));
  if (valid.length === 0) return null;
  const avg = valid.reduce((sum, t) => sum + t, 0) / valid.length;
  return avg.toFixed(2);
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

function getAverageBroadJumpInFeet(jumps) {
  if (!jumps || !Array.isArray(jumps)) return null;
  const valid = [];

  jumps.forEach(function(jump) {
    if (jump && typeof jump === 'object' && jump.feet !== null && jump.feet !== undefined) {
      valid.push(jump.feet + ((jump.inches || 0) / 12));
    } else if (typeof jump === 'number') {
      valid.push(jump);
    }
  });

  if (valid.length === 0) return null;
  return valid.reduce((sum, v) => sum + v, 0) / valid.length;
}

function getAverageBroadJump(jumps) {
  const avgFeet = getAverageBroadJumpInFeet(jumps);
  if (avgFeet === null) return null;
  const feet = Math.floor(avgFeet);
  const inches = Math.round((avgFeet - feet) * 12);
  return feet + "' " + inches + '"';
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

function getAdjustedAvgH1B(data) {
  if (!data || !data.times) return null;
  const adjusted = [];
  for (let i = 0; i < 2; i++) {
    if (data.times[i] !== null && data.times[i] !== undefined) {
      adjusted.push(parseFloat(data.times[i]) + (data.missed1b && data.missed1b[i] ? 0.5 : 0));
    }
  }
  if (adjusted.length === 0) return null;
  const avg = adjusted.reduce((sum, t) => sum + t, 0) / adjusted.length;
  return avg.toFixed(2);
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

function getAdjustedAvg2BH(data) {
  if (!data || !data.times) return null;
  const adjusted = [];
  for (let i = 0; i < 2; i++) {
    if (data.times[i] !== null && data.times[i] !== undefined) {
      adjusted.push(parseFloat(data.times[i]) + (data.missed3b && data.missed3b[i] ? 1 : 0));
    }
  }
  if (adjusted.length === 0) return null;
  const avg = adjusted.reduce((sum, t) => sum + t, 0) / adjusted.length;
  return avg.toFixed(2);
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
  const avg = getAverageTime(times);
  if (!avg) return 0;
  return calculateSpeedScore('poptime', avg);
}

function calculateProAgilityScore(times) {
  const avg = getAverageTime(times);
  if (!avg) return 0;
  const t = parseFloat(avg);
  if (t < 4.3) return 5;
  if (t <= 4.6) return 4;
  if (t <= 5.0) return 3;
  if (t <= 5.5) return 2;
  return 1;
}

function calculateBroadJumpScore(jumps) {
  const avg = getAverageBroadJumpInFeet(jumps);
  if (!avg) return 0;
  const d = avg;
  if (d < 4) return 1;
  if (d < 5) return 2;
  if (d < 6) return 3;
  if (d < 7) return 4;
  return 5;
}

function getAverageBatSpeed(batSpeed) {
  if (!batSpeed || !Array.isArray(batSpeed)) return null;
  const valid = batSpeed.filter(v => v !== null && v !== undefined);
  if (valid.length === 0) return null;
  const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
  return Math.round(avg);
}

function calculateBatSpeedScore(batSpeed) {
  const avg = getAverageBatSpeed(batSpeed);
  if (avg === null) return 0;
  if (avg >= 70) return 5;
  if (avg >= 63) return 4;
  if (avg >= 55) return 3;
  if (avg >= 48) return 2;
  return 1;
}

function getAverageVelocity(velocity) {
  if (!velocity || !Array.isArray(velocity)) return null;
  const valid = velocity.filter(v => v !== null && v !== undefined && !isNaN(v));
  if (valid.length === 0) return null;
  return valid.reduce((sum, v) => sum + v, 0) / valid.length;
}

function calculateThrowingScore(velocity) {
  const avg = getAverageVelocity(velocity);
  if (avg === null) return 0;
  // Scoring based on velocity thresholds
  if (avg >= 65) return 5;
  if (avg >= 58) return 4;
  if (avg >= 50) return 3;
  if (avg >= 43) return 2;
  return 1;
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
  const inf = player.infield || {};
  const outf = player.outfield || {};
  const h = player.hitting || {};
  const t = player.throwing || {};

  // Baserunning (no h3b/hh - matches current app)
  const h1bScore = calculateSpeedScore('h1b', getAdjustedAvgH1B(b.h1b || { times: [null, null], missed1b: [false, false] }));
  const tbhScore = calculateSpeedScore('2bh', getAdjustedAvg2BH(b['2bh'] || { times: [null, null], missed3b: [false, false] }));
  const proAgilityScore = calculateProAgilityScore(b.proagility || []);
  const broadJumpScore = calculateBroadJumpScore(b.broadjump || []);
  const baserunningTotal = h1bScore + tbhScore + proAgilityScore + broadJumpScore;

  // Hitting (bat speed + 5 evaluation categories)
  const hitEval = h.evaluation || {};
  const hittingTotal = calculateBatSpeedScore(h.batSpeed || []) + calculateAverageScore(hitEval, 'balance') + calculateAverageScore(hitEval, 'batPath') + calculateAverageScore(hitEval, 'contact') + calculateAverageScore(hitEval, 'timing') + calculateAverageScore(hitEval, 'highMotor');

  // Infield (6 categories)
  const infEval = inf.evaluation || {};
  const infieldTotal = calculateAverageScore(infEval, 'fieldingMechanics') + calculateAverageScore(infEval, 'armStrength') + calculateAverageScore(infEval, 'receivingMechanics') + calculateAverageScore(infEval, 'miFeed') + calculateAverageScore(infEval, 'agility') + calculateAverageScore(infEval, 'highMotor');

  // Outfield (5 categories)
  const outfEval = outf.evaluation || {};
  const outfieldTotal = calculateAverageScore(outfEval, 'fieldingMechanics') + calculateAverageScore(outfEval, 'armStrength') + calculateAverageScore(outfEval, 'rangeAgility') + calculateAverageScore(outfEval, 'flyBallMechanics') + calculateAverageScore(outfEval, 'highMotor');

  // Throwing
  const throwingScore = calculateThrowingScore(t.velocity || []);

  // Intangibles (coach-keyed directly on intang object)
  const intangiblesTotal = calculateAverageScore(intang, 'awareness') + calculateAverageScore(intang, 'leadership') + calculateAverageScore(intang, 'enthusiasm');

  // Catching (new structure with evaluation object)
  const poptimeScore = calculatePopTimeScore(c.poptime || []);
  const catchEval = c.evaluation || {};
  const catchingTotal = poptimeScore + calculateAverageScore(catchEval, 'setupStance') + calculateAverageScore(catchEval, 'armStrength') + calculateAverageScore(catchEval, 'blockingPopups') + calculateAverageScore(catchEval, 'framing') + calculateAverageScore(catchEval, 'footworkAgility') + calculateAverageScore(catchEval, 'highMotor');

  return baserunningTotal + hittingTotal + infieldTotal + outfieldTotal + throwingScore + intangiblesTotal + catchingTotal;
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
