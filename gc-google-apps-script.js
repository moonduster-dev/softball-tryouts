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

  // Headers match CSV export exactly
  const headers = [
    'Rank', 'Name', 'Grand Total',
    // Baserunning
    'H-1B Avg', 'H-1B Score', '2B-H Avg', '2B-H Score', 'Pro Agility Avg', 'Pro Agility Score', 'Broad Jump Avg', 'Broad Jump Score', 'Baserunning Total',
    // Hitting
    'Bat Speed Avg', 'Bat Speed Score', 'Balance', 'Bat Path', 'Contact', 'Timing', 'Hit High Motor', 'Hitting Total',
    // Infield
    'IF Fielding Mech', 'IF Arm Str/Acc', 'Receiving Mech', 'MI Feed Mech', 'IF Agility/Expl', 'IF High Motor', 'Infield Total',
    // Outfield
    'OF Fielding Mech', 'OF Arm Str/Acc', 'Range/Agility', 'Fly Ball Pos/Trans', 'OF High Motor', 'Outfield Total',
    // Throwing
    'Velocity Avg', 'Throwing Score',
    // Intangibles
    'Awareness', 'Leadership', 'Enthusiasm', 'Intangibles Total',
    // Catching
    'Pop Time Avg', 'Pop Time Score', 'Setup/Stance', 'Arm Str/Acc', 'Block/Popups', 'Framing', 'Foot/Agility', 'Catch High Motor', 'Catching Total'
  ];

  readableSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  readableSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  readableSheet.setFrozenRows(1);

  if (players.length === 0) return;

  const rows = players.map(function(player) {
    // Calculate totals first (matches CSV export logic exactly)
    var baserunningTotal = calculateBaserunningTotal(player);
    var hittingTotal = calculateHittingTotal(player);
    var infieldTotal = calculateInfieldTotal(player);
    var outfieldTotal = calculateOutfieldTotal(player);
    var throwingTotal = calculateThrowingTotal(player);
    var intangiblesTotal = calculateIntangiblesTotal(player);
    var catchingTotal = calculateCatchingTotal(player);
    var grandTotal = baserunningTotal + hittingTotal + infieldTotal + outfieldTotal + throwingTotal + intangiblesTotal;

    // Baserunning details
    var b = player.baserunning || {};
    var h1b = b.h1b || { times: [null, null], missed1b: [false, false] };
    var tbh = b['2bh'] || { times: [null, null], missed3b: [false, false] };
    var h1bAvg = getAdjustedAvgH1B(h1b);
    var h1bScore = calculateSpeedScore('h1b', h1bAvg);
    var tbhAvg = getAdjustedAvg2BH(tbh);
    var tbhScore = calculateSpeedScore('2bh', tbhAvg);
    var proAgility = b.proagility || [null, null];
    var proAgAvg = getAverageTime(proAgility) || '';
    var proAgScore = calculateProAgilityScore(proAgility);
    var broadJump = b.broadjump || [null, null];
    var bjAvg = getAverageBroadJump(broadJump);
    var bjAvgStr = bjAvg || '';
    var bjScore = calculateBroadJumpScore(broadJump);

    // Hitting details
    var h = player.hitting || {};
    var batSpeed = h.batSpeed || [null, null];
    var bsAvg = getAverageBatSpeed(batSpeed);
    var bsAvgStr = bsAvg !== null ? bsAvg.toFixed(1) : '';
    var bsScore = calculateBatSpeedScore(batSpeed);
    var hitBalance = calculateAverageScore(h.evaluation || {}, 'balance').toFixed(1);
    var hitBatPath = calculateAverageScore(h.evaluation || {}, 'batPath').toFixed(1);
    var hitContact = calculateAverageScore(h.evaluation || {}, 'contact').toFixed(1);
    var hitTiming = calculateAverageScore(h.evaluation || {}, 'timing').toFixed(1);
    var hitHighMotor = calculateAverageScore(h.evaluation || {}, 'highMotor').toFixed(1);

    // Infield details
    var inf = player.infield || {};
    var infFieldingMech = calculateAverageScore(inf.evaluation || {}, 'fieldingMechanics').toFixed(1);
    var infArmStr = calculateAverageScore(inf.evaluation || {}, 'armStrength').toFixed(1);
    var infReceiving = calculateAverageScore(inf.evaluation || {}, 'receivingMechanics').toFixed(1);
    var infMiFeed = calculateAverageScore(inf.evaluation || {}, 'miFeed').toFixed(1);
    var infAgility = calculateAverageScore(inf.evaluation || {}, 'agility').toFixed(1);
    var infHighMotor = calculateAverageScore(inf.evaluation || {}, 'highMotor').toFixed(1);

    // Outfield details
    var outf = player.outfield || {};
    var outfFieldingMech = calculateAverageScore(outf.evaluation || {}, 'fieldingMechanics').toFixed(1);
    var outfArmStr = calculateAverageScore(outf.evaluation || {}, 'armStrength').toFixed(1);
    var outfRange = calculateAverageScore(outf.evaluation || {}, 'rangeAgility').toFixed(1);
    var outfFlyBall = calculateAverageScore(outf.evaluation || {}, 'flyBallMechanics').toFixed(1);
    var outfHighMotor = calculateAverageScore(outf.evaluation || {}, 'highMotor').toFixed(1);

    // Throwing details
    var t = player.throwing || {};
    var velocity = t.velocity || [null, null];
    var vAvg = getAverageVelocity(velocity);
    var vAvgStr = vAvg !== null ? vAvg.toFixed(1) : '';

    // Intangibles details
    var intang = player.intangibles || {};
    var awareness = calculateAverageScore(intang, 'awareness').toFixed(1);
    var leadership = calculateAverageScore(intang, 'leadership').toFixed(1);
    var enthusiasm = calculateAverageScore(intang, 'enthusiasm').toFixed(1);

    // Catching details
    var c = player.catching || {};
    var popTimeAvg = getAverageTime(c.poptime || []) || '';
    var popTimeScore = calculatePopTimeScore(c.poptime || []);
    var setupStance = calculateAverageScore(c.evaluation || {}, 'setupStance').toFixed(1);
    var armStrength = calculateAverageScore(c.evaluation || {}, 'armStrength').toFixed(1);
    var blockingPopups = calculateAverageScore(c.evaluation || {}, 'blockingPopups').toFixed(1);
    var framing = calculateAverageScore(c.evaluation || {}, 'framing').toFixed(1);
    var footworkAgility = calculateAverageScore(c.evaluation || {}, 'footworkAgility').toFixed(1);
    var catchHighMotor = calculateAverageScore(c.evaluation || {}, 'highMotor').toFixed(1);

    return [
      0, // placeholder for rank, will be set after sorting
      player.name,
      grandTotal.toFixed(1),
      // Baserunning
      h1bAvg || '',
      h1bScore,
      tbhAvg || '',
      tbhScore,
      proAgAvg,
      proAgScore,
      bjAvgStr,
      bjScore,
      baserunningTotal.toFixed(1),
      // Hitting
      bsAvgStr,
      bsScore,
      hitBalance,
      hitBatPath,
      hitContact,
      hitTiming,
      hitHighMotor,
      hittingTotal.toFixed(1),
      // Infield
      infFieldingMech,
      infArmStr,
      infReceiving,
      infMiFeed,
      infAgility,
      infHighMotor,
      infieldTotal.toFixed(1),
      // Outfield
      outfFieldingMech,
      outfArmStr,
      outfRange,
      outfFlyBall,
      outfHighMotor,
      outfieldTotal.toFixed(1),
      // Throwing
      vAvgStr,
      throwingTotal.toFixed(1),
      // Intangibles
      awareness,
      leadership,
      enthusiasm,
      intangiblesTotal.toFixed(1),
      // Catching
      popTimeAvg,
      popTimeScore,
      setupStance,
      armStrength,
      blockingPopups,
      framing,
      footworkAgility,
      catchHighMotor,
      catchingTotal.toFixed(1)
    ];
  });

  // Sort by grand total (column index 2) descending
  rows.sort(function(a, b) {
    return parseFloat(b[2]) - parseFloat(a[2]);
  });

  // Set rank numbers after sorting
  for (var i = 0; i < rows.length; i++) {
    rows[i][0] = i + 1;
  }

  if (rows.length > 0) {
    readableSheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }

  for (var i = 1; i <= headers.length; i++) {
    readableSheet.autoResizeColumn(i);
  }
}

// ============================================
// CALCULATION FUNCTIONS (match HTML app exactly)
// ============================================

function calculateBaserunningTotal(player) {
  var b = player.baserunning || {};
  var total = 0;

  // Speed metrics
  total += calculateSpeedScore('h1b', getAdjustedAvgH1B(b.h1b || { times: [null, null], missed1b: [false, false] }));
  total += calculateSpeedScore('2bh', getAdjustedAvg2BH(b['2bh'] || { times: [null, null], missed3b: [false, false] }));

  // Explosiveness
  total += calculateProAgilityScore(b.proagility || []);
  total += calculateBroadJumpScore(b.broadjump || []);

  // Evaluation (highmotor, intangibles)
  var evaluation = b.evaluation || {};
  total += calculateAverageScore(evaluation, 'highmotor');
  total += calculateAverageScore(evaluation, 'intangibles');

  return Math.round(total * 10) / 10;
}

function calculateHittingTotal(player) {
  var h = player.hitting || {};
  var total = 0;

  // Bat speed score
  total += calculateBatSpeedScore(h.batSpeed);

  // Evaluation categories
  var hittingCategories = ['balance', 'batPath', 'contact', 'timing', 'highMotor'];
  total += calculateFieldingDrillAverage(h.evaluation || {}, hittingCategories);

  return Math.round(total * 10) / 10;
}

function calculateInfieldTotal(player) {
  var f = player.infield || {};
  var infieldCategories = ['fieldingMechanics', 'armStrength', 'receivingMechanics', 'miFeed', 'agility', 'highMotor'];
  return Math.round(calculateFieldingDrillAverage(f.evaluation || {}, infieldCategories) * 10) / 10;
}

function calculateOutfieldTotal(player) {
  var f = player.outfield || {};
  var outfieldCategories = ['fieldingMechanics', 'armStrength', 'rangeAgility', 'flyBallMechanics', 'highMotor'];
  return Math.round(calculateFieldingDrillAverage(f.evaluation || {}, outfieldCategories) * 10) / 10;
}

function calculateThrowingTotal(player) {
  var t = player.throwing || {};
  return calculateVelocityScore(getAverageVelocity(t.velocity));
}

function calculateIntangiblesTotal(player) {
  var intangibles = player.intangibles || {};
  var drills = ['awareness', 'leadership', 'enthusiasm'];
  var total = 0;
  drills.forEach(function(drill) {
    total += calculateAverageScore(intangibles, drill);
  });
  return total;
}

function calculateCatchingTotal(player) {
  var c = player.catching || {};
  var total = 0;
  // Pop Time score
  total += calculatePopTimeScore(c.poptime || []);
  // Evaluation categories
  var catchingCategories = ['setupStance', 'armStrength', 'blockingPopups', 'framing', 'footworkAgility', 'highMotor'];
  total += calculateCatchingDrillAverage(c.evaluation || {}, catchingCategories);
  return Math.round(total * 10) / 10;
}

function calculateFieldingDrillAverage(drillData, categories) {
  if (!drillData || typeof drillData !== 'object') return 0;
  var total = 0;
  categories.forEach(function(cat) {
    total += calculateAverageScore(drillData, cat);
  });
  return total;
}

function calculateCatchingDrillAverage(drillData, categories) {
  if (!drillData || typeof drillData !== 'object') return 0;
  var total = 0;
  categories.forEach(function(cat) {
    total += calculateAverageScore(drillData, cat);
  });
  return total;
}

function calculateAverageScore(coachScores, drillId) {
  if (!coachScores || typeof coachScores !== 'object') return 0;
  if (Array.isArray(coachScores)) return 0;
  var scores = [];
  Object.keys(coachScores).forEach(function(key) {
    var coach = coachScores[key];
    if (coach && typeof coach === 'object' && coach[drillId] !== undefined && coach[drillId] !== null) {
      scores.push(coach[drillId]);
    }
  });
  if (scores.length === 0) return 0;
  return scores.reduce(function(sum, s) { return sum + s; }, 0) / scores.length;
}

function calculateVelocityScore(velocity) {
  if (velocity === null || velocity === undefined || velocity === '') return 0;
  var v = parseFloat(velocity);
  if (isNaN(v)) return 0;
  if (v >= 63) return 5;
  if (v >= 59) return 4;
  if (v >= 53) return 3;
  if (v >= 48) return 2;
  return 1;
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

function getAverageTime(times) {
  if (!times || !Array.isArray(times)) return null;
  var valid = times.filter(function(t) { return t !== null && !isNaN(t); });
  if (valid.length === 0) return null;
  var avg = valid.reduce(function(sum, t) { return sum + t; }, 0) / valid.length;
  return avg.toFixed(2);
}

function getAverageBroadJumpInFeet(jumps) {
  if (!jumps || !Array.isArray(jumps)) return null;
  var valid = [];

  jumps.forEach(function(jump) {
    if (jump && typeof jump === 'object' && jump.feet !== null && jump.feet !== undefined) {
      valid.push(jump.feet + ((jump.inches || 0) / 12));
    } else if (typeof jump === 'number') {
      valid.push(jump);
    }
  });

  if (valid.length === 0) return null;
  return valid.reduce(function(sum, v) { return sum + v; }, 0) / valid.length;
}

function getAverageBroadJump(jumps) {
  var avgFeet = getAverageBroadJumpInFeet(jumps);
  if (avgFeet === null) return null;
  var feet = Math.floor(avgFeet);
  var inches = Math.round((avgFeet - feet) * 12);
  return feet + "' " + inches + '"';
}

function getAdjustedAvgH1B(data) {
  if (!data || !data.times) return null;
  var adjusted = [];
  for (var i = 0; i < 2; i++) {
    if (data.times[i] !== null && data.times[i] !== undefined) {
      adjusted.push(parseFloat(data.times[i]) + (data.missed1b && data.missed1b[i] ? 0.5 : 0));
    }
  }
  if (adjusted.length === 0) return null;
  var avg = adjusted.reduce(function(sum, t) { return sum + t; }, 0) / adjusted.length;
  return avg.toFixed(2);
}

function getAdjustedAvg2BH(data) {
  if (!data || !data.times) return null;
  var adjusted = [];
  for (var i = 0; i < 2; i++) {
    if (data.times[i] !== null && data.times[i] !== undefined) {
      adjusted.push(parseFloat(data.times[i]) + (data.missed3b && data.missed3b[i] ? 1 : 0));
    }
  }
  if (adjusted.length === 0) return null;
  var avg = adjusted.reduce(function(sum, t) { return sum + t; }, 0) / adjusted.length;
  return avg.toFixed(2);
}

function calculateSpeedScore(drill, time) {
  if (time === null || time === undefined || time === 'N/A') return 0;
  var t = parseFloat(time);

  var thresholds = {
    'h1b': { t5: 3.1, t4: 3.8, t3: 4.6, t2: 5.2 },
    '2bh': { t5: 5.75, t4: 6.25, t3: 7, t2: 8 },
    'poptime': { t5: 2.3, t4: 2.5, t3: 2.7, t2: 3.0 }
  };

  var config = thresholds[drill];
  if (!config) return 0;

  if (t < config.t5) return 5;
  if (t < config.t4) return 4;
  if (t < config.t3) return 3;
  if (t < config.t2) return 2;
  return 1;
}

function calculatePopTimeScore(times) {
  var avg = getAverageTime(times);
  if (!avg) return 0;
  return calculateSpeedScore('poptime', avg);
}

function calculateProAgilityScore(times) {
  var avg = getAverageTime(times);
  if (!avg) return 0;
  var t = parseFloat(avg);
  if (t < 4.3) return 5;
  if (t <= 4.6) return 4;
  if (t <= 5.0) return 3;
  if (t <= 5.5) return 2;
  return 1;
}

function calculateBroadJumpScore(jumps) {
  var avg = getAverageBroadJumpInFeet(jumps);
  if (!avg) return 0;
  if (avg < 4) return 1;
  if (avg < 5) return 2;
  if (avg < 6) return 3;
  if (avg < 7) return 4;
  return 5;
}

function getAverageBatSpeed(batSpeed) {
  if (!batSpeed || !Array.isArray(batSpeed)) return null;
  var valid = batSpeed.filter(function(v) { return v !== null && v !== undefined; });
  if (valid.length === 0) return null;
  var avg = valid.reduce(function(a, b) { return a + b; }, 0) / valid.length;
  return Math.round(avg);
}

function calculateBatSpeedScore(batSpeed) {
  var avg = getAverageBatSpeed(batSpeed);
  if (avg === null) return 0;
  if (avg >= 70) return 5;
  if (avg >= 63) return 4;
  if (avg >= 55) return 3;
  if (avg >= 48) return 2;
  return 1;
}

function getAverageVelocity(velocities) {
  if (!velocities || !Array.isArray(velocities)) return null;
  var valid = velocities.filter(function(v) { return v !== null && !isNaN(v); });
  if (valid.length === 0) return null;
  return Math.round(valid.reduce(function(sum, v) { return sum + v; }, 0) / valid.length);
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1).setValue('Player Data (JSON)');
    sheet.getRange(1, 2).setValue('Last Updated');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function setupSheet() {
  var sheet = getOrCreateSheet();
  Logger.log('Sheet created: ' + sheet.getName());
  return 'Setup complete!';
}
