// Google Apps Script Code for GC Softball Tryouts 2026
// This code runs on Google's servers and connects your app to Google Sheets

// INSTRUCTIONS:
// 1. Open your Google Spreadsheet
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
    var players;
    if (e.parameter && e.parameter.data) {
      players = JSON.parse(e.parameter.data);
    } else if (e.postData && e.postData.contents) {
      var formData = e.postData.contents;
      var params = formData.split('&').reduce(function(acc, pair) {
        var parts = pair.split('=');
        acc[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1] || '');
        return acc;
      }, {});
      players = JSON.parse(params.data || '[]');
    } else {
      throw new Error('No data received');
    }

    var sheet = getOrCreateSheet();

    // Clear existing data instead of deleting rows (avoids frozen row issues)
    if (sheet.getLastRow() > 1) {
      var numRowsToClear = sheet.getLastRow() - 1;
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
    var sheet = getOrCreateSheet();
    var data = sheet.getDataRange().getValues();

    var result = '[]';
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var readableSheet = ss.getSheetByName(READABLE_SHEET_NAME);

  if (!readableSheet) {
    readableSheet = ss.insertSheet(READABLE_SHEET_NAME);
  }

  readableSheet.clear();

  // Headers match CSV export ALL PLAYERS section exactly
  var headers = [
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
    'Awareness', 'Leadership', 'Enthusiasm', 'Intangibles Total'
  ];

  readableSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  readableSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  readableSheet.setFrozenRows(1);

  if (players.length === 0) return;

  var rows = [];
  for (var p = 0; p < players.length; p++) {
    var player = players[p];

    // Calculate totals (matches CSV export logic exactly)
    var baserunningTotal = calculateBaserunningTotal(player);
    var hittingTotal = calculateHittingTotal(player);
    var infieldTotal = calculateInfieldTotal(player);
    var outfieldTotal = calculateOutfieldTotal(player);
    var throwingTotal = calculateThrowingTotal(player);
    var intangiblesTotal = calculateIntangiblesTotal(player);
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
    var proAgAvg = getAverageTime(proAgility);
    var proAgScore = calculateProAgilityScore(proAgility);
    var broadJump = b.broadjump || [null, null];
    var bjAvg = getAverageBroadJump(broadJump);
    var bjScore = calculateBroadJumpScore(broadJump);

    // Hitting details
    var h = player.hitting || {};
    var batSpeed = h.batSpeed || [null, null];
    var bsAvg = getAverageBatSpeed(batSpeed);
    var bsScore = calculateBatSpeedScore(batSpeed);
    var hitEval = h.evaluation || {};
    var hitBalance = calculateAverageScore(hitEval, 'balance');
    var hitBatPath = calculateAverageScore(hitEval, 'batPath');
    var hitContact = calculateAverageScore(hitEval, 'contact');
    var hitTiming = calculateAverageScore(hitEval, 'timing');
    var hitHighMotor = calculateAverageScore(hitEval, 'highMotor');

    // Infield details
    var inf = player.infield || {};
    var infEval = inf.evaluation || {};
    var infFieldingMech = calculateAverageScore(infEval, 'fieldingMechanics');
    var infArmStr = calculateAverageScore(infEval, 'armStrength');
    var infReceiving = calculateAverageScore(infEval, 'receivingMechanics');
    var infMiFeed = calculateAverageScore(infEval, 'miFeed');
    var infAgility = calculateAverageScore(infEval, 'agility');
    var infHighMotor = calculateAverageScore(infEval, 'highMotor');

    // Outfield details
    var outf = player.outfield || {};
    var outfEval = outf.evaluation || {};
    var outfFieldingMech = calculateAverageScore(outfEval, 'fieldingMechanics');
    var outfArmStr = calculateAverageScore(outfEval, 'armStrength');
    var outfRange = calculateAverageScore(outfEval, 'rangeAgility');
    var outfFlyBall = calculateAverageScore(outfEval, 'flyBallMechanics');
    var outfHighMotor = calculateAverageScore(outfEval, 'highMotor');

    // Throwing details
    var t = player.throwing || {};
    var velocity = t.velocity || [null, null];
    var vAvg = getAverageVelocity(velocity);

    // Intangibles details
    var intang = player.intangibles || {};
    var awareness = calculateAverageScore(intang, 'awareness');
    var leadership = calculateAverageScore(intang, 'leadership');
    var enthusiasm = calculateAverageScore(intang, 'enthusiasm');

    rows.push([
      0, // placeholder for rank
      player.name,
      roundTo1(grandTotal),
      // Baserunning
      h1bAvg || 'N/A',
      h1bScore,
      tbhAvg || 'N/A',
      tbhScore,
      proAgAvg || '',
      proAgScore,
      bjAvg || '',
      bjScore,
      roundTo1(baserunningTotal),
      // Hitting
      bsAvg !== null ? bsAvg : '',
      bsScore,
      roundTo1(hitBalance),
      roundTo1(hitBatPath),
      roundTo1(hitContact),
      roundTo1(hitTiming),
      roundTo1(hitHighMotor),
      roundTo1(hittingTotal),
      // Infield
      roundTo1(infFieldingMech),
      roundTo1(infArmStr),
      roundTo1(infReceiving),
      roundTo1(infMiFeed),
      roundTo1(infAgility),
      roundTo1(infHighMotor),
      roundTo1(infieldTotal),
      // Outfield
      roundTo1(outfFieldingMech),
      roundTo1(outfArmStr),
      roundTo1(outfRange),
      roundTo1(outfFlyBall),
      roundTo1(outfHighMotor),
      roundTo1(outfieldTotal),
      // Throwing
      vAvg !== null ? vAvg : '',
      throwingTotal,
      // Intangibles
      roundTo1(awareness),
      roundTo1(leadership),
      roundTo1(enthusiasm),
      roundTo1(intangiblesTotal)
    ]);
  }

  // Sort by grand total descending
  rows.sort(function(a, b) {
    return b[2] - a[2];
  });

  // Set rank numbers
  for (var i = 0; i < rows.length; i++) {
    rows[i][0] = i + 1;
  }

  if (rows.length > 0) {
    readableSheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }

  // Auto-resize columns
  for (var col = 1; col <= headers.length; col++) {
    readableSheet.autoResizeColumn(col);
  }
}

// ============================================
// HELPER FUNCTION
// ============================================
function roundTo1(num) {
  if (num === null || num === undefined || isNaN(num)) return 0;
  return Math.round(num * 10) / 10;
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
  for (var i = 0; i < drills.length; i++) {
    total += calculateAverageScore(intangibles, drills[i]);
  }
  return total;
}

function calculateFieldingDrillAverage(drillData, categories) {
  if (!drillData || typeof drillData !== 'object') return 0;
  var total = 0;
  for (var i = 0; i < categories.length; i++) {
    total += calculateAverageScore(drillData, categories[i]);
  }
  return total;
}

function calculateAverageScore(coachScores, drillId) {
  if (!coachScores || typeof coachScores !== 'object') return 0;
  if (Array.isArray(coachScores)) return 0;
  var scores = [];
  var keys = Object.keys(coachScores);
  for (var i = 0; i < keys.length; i++) {
    var coach = coachScores[keys[i]];
    if (coach && typeof coach === 'object' && coach[drillId] !== undefined && coach[drillId] !== null) {
      scores.push(coach[drillId]);
    }
  }
  if (scores.length === 0) return 0;
  var sum = 0;
  for (var j = 0; j < scores.length; j++) {
    sum += scores[j];
  }
  return sum / scores.length;
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

function getAverageTime(times) {
  if (!times || !Array.isArray(times)) return null;
  var valid = [];
  for (var i = 0; i < times.length; i++) {
    if (times[i] !== null && !isNaN(times[i])) {
      valid.push(times[i]);
    }
  }
  if (valid.length === 0) return null;
  var sum = 0;
  for (var j = 0; j < valid.length; j++) {
    sum += valid[j];
  }
  var avg = sum / valid.length;
  return avg.toFixed(2);
}

function getAverageBroadJumpInFeet(jumps) {
  if (!jumps || !Array.isArray(jumps)) return null;
  var valid = [];

  for (var i = 0; i < jumps.length; i++) {
    var jump = jumps[i];
    if (jump && typeof jump === 'object' && jump.feet !== null && jump.feet !== undefined) {
      valid.push(jump.feet + ((jump.inches || 0) / 12));
    } else if (typeof jump === 'number') {
      valid.push(jump);
    }
  }

  if (valid.length === 0) return null;
  var sum = 0;
  for (var j = 0; j < valid.length; j++) {
    sum += valid[j];
  }
  return sum / valid.length;
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
  var sum = 0;
  for (var j = 0; j < adjusted.length; j++) {
    sum += adjusted[j];
  }
  var avg = sum / adjusted.length;
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
  var sum = 0;
  for (var j = 0; j < adjusted.length; j++) {
    sum += adjusted[j];
  }
  var avg = sum / adjusted.length;
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
  var valid = [];
  for (var i = 0; i < batSpeed.length; i++) {
    if (batSpeed[i] !== null && batSpeed[i] !== undefined) {
      valid.push(batSpeed[i]);
    }
  }
  if (valid.length === 0) return null;
  var sum = 0;
  for (var j = 0; j < valid.length; j++) {
    sum += valid[j];
  }
  var avg = sum / valid.length;
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
  var valid = [];
  for (var i = 0; i < velocities.length; i++) {
    if (velocities[i] !== null && !isNaN(velocities[i])) {
      valid.push(velocities[i]);
    }
  }
  if (valid.length === 0) return null;
  var sum = 0;
  for (var j = 0; j < valid.length; j++) {
    sum += valid[j];
  }
  return Math.round(sum / valid.length);
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
