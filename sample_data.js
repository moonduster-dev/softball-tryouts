// Sample Data for Softball Tryouts
// Copy this array and paste it into your browser console, then run uploadToSheets()

const samplePlayers = [
  {
    id: 1,
    name: "Emily Rodriguez",
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
  },
  {
    id: 2,
    name: "Sarah Chen",
    number: "7",
    hustleEnergy: { attitude: 5, runsonoff: 4, cheers: 5, dives: 4, baserunning: 5 },
    fieldingData: { flyball: 6, throwspeed: [2.05, 1.98, 2.10], throwaccuracy: [1, 1, 0] },
    hittingData: {
      batspeed: [58, 60, 59],
      exitvelocity: [64, 66, 65],
      bunt1b: [1, 1, 0],
      buntp: [1, 0, 1],
      bunt3b: [1, 1, 1],
      pitchrecog: [1, 1, 0, 1, 1],
      strikerecog: [1, 1, 1, 0, 1]
    },
    speedTimes: {
      h1b: [3.5, 3.4, 3.6],
      h2b: [6.1, 6.3, 6.2],
      hh: [12.8, 13.0, 12.7],
      broadjump: [6.2, 6.5, 6.3]
    },
    catcherData: {
      poptime: [2.65, 2.58, 2.62],
      throwaccuracy: [1, 0, 1],
      throwspeed: [52, 54, 53],
      popfly: [1, 1, 0],
      blocking: 3,
      buntfielding: 4
    },
    pitchingData: {
      fastballspeed: [51, 53, 52],
      accuracy: 3,
      movement: 3,
      mechanics: 4
    }
  },
  {
    id: 3,
    name: "Madison Taylor",
    number: "23",
    hustleEnergy: { attitude: 4, runsonoff: 5, cheers: 5, dives: 3, baserunning: 4 },
    fieldingData: { flyball: 8, throwspeed: [1.65, 1.70, 1.68], throwaccuracy: [1, 1, 1] },
    hittingData: {
      batspeed: [66, 68, 67],
      exitvelocity: [71, 74, 72],
      bunt1b: [1, 1, 1],
      buntp: [1, 1, 1],
      bunt3b: [1, 0, 1],
      pitchrecog: [1, 1, 1, 1, 1],
      strikerecog: [1, 1, 1, 1, 0]
    },
    speedTimes: {
      h1b: [2.9, 3.0, 2.8],
      h2b: [5.6, 5.7, 5.5],
      hh: [11.5, 11.7, 11.4],
      broadjump: [7.3, 7.5, 7.4]
    },
    catcherData: {
      poptime: [2.28, 2.25, 2.30],
      throwaccuracy: [1, 1, 1],
      throwspeed: [66, 68, 67],
      popfly: [1, 1, 1],
      blocking: 5,
      buntfielding: 5
    },
    pitchingData: {
      fastballspeed: [60, 62, 61],
      accuracy: 5,
      movement: 4,
      mechanics: 5
    }
  },
  {
    id: 4,
    name: "Olivia Martinez",
    number: "15",
    hustleEnergy: { attitude: 5, runsonoff: 3, cheers: 4, dives: 4, baserunning: 3 },
    fieldingData: { flyball: 5, throwspeed: [2.20, 2.15, 2.18], throwaccuracy: [1, 0, 1] },
    hittingData: {
      batspeed: [54, 56, 55],
      exitvelocity: [60, 62, 61],
      bunt1b: [1, 0, 1],
      buntp: [0, 1, 1],
      bunt3b: [1, 1, 0],
      pitchrecog: [1, 0, 1, 1, 0],
      strikerecog: [1, 1, 0, 1, 1]
    },
    speedTimes: {
      h1b: [3.9, 3.7, 3.8],
      h2b: [6.5, 6.7, 6.6],
      hh: [13.5, 13.8, 13.6],
      broadjump: [5.8, 6.0, 5.9]
    },
    catcherData: {
      poptime: [2.85, 2.92, 2.88],
      throwaccuracy: [0, 1, 1],
      throwspeed: [48, 50, 49],
      popfly: [1, 0, 1],
      blocking: 3,
      buntfielding: 3
    },
    pitchingData: {
      fastballspeed: [48, 50, 49],
      accuracy: 3,
      movement: 2,
      mechanics: 3
    }
  },
  {
    id: 5,
    name: "Ava Johnson",
    number: "9",
    hustleEnergy: { attitude: 4, runsonoff: 4, cheers: 3, dives: 5, baserunning: 5 },
    fieldingData: { flyball: 7, throwspeed: [1.75, 1.80, 1.78], throwaccuracy: [1, 1, 1] },
    hittingData: {
      batspeed: [61, 63, 62],
      exitvelocity: [67, 69, 68],
      bunt1b: [1, 1, 1],
      buntp: [1, 1, 0],
      bunt3b: [1, 1, 1],
      pitchrecog: [1, 1, 1, 0, 1],
      strikerecog: [1, 1, 1, 1, 1]
    },
    speedTimes: {
      h1b: [3.0, 3.2, 3.1],
      h2b: [5.9, 6.0, 5.8],
      hh: [12.0, 12.2, 11.9],
      broadjump: [7.0, 7.2, 7.1]
    },
    catcherData: {
      poptime: [2.50, 2.48, 2.52],
      throwaccuracy: [1, 1, 0],
      throwspeed: [62, 64, 63],
      popfly: [1, 1, 1],
      blocking: 4,
      buntfielding: 4
    },
    pitchingData: {
      fastballspeed: [54, 56, 55],
      accuracy: 4,
      movement: 3,
      mechanics: 4
    }
  },
  {
    id: 6,
    name: "Sophia Anderson",
    number: "3",
    hustleEnergy: { attitude: 3, runsonoff: 4, cheers: 4, dives: 4, baserunning: 4 },
    fieldingData: { flyball: 6, throwspeed: [2.00, 1.95, 1.98], throwaccuracy: [1, 1, 1] },
    hittingData: {
      batspeed: [57, 59, 58],
      exitvelocity: [63, 65, 64],
      bunt1b: [1, 1, 0],
      buntp: [1, 0, 1],
      bunt3b: [0, 1, 1],
      pitchrecog: [1, 1, 1, 1, 0],
      strikerecog: [1, 0, 1, 1, 1]
    },
    speedTimes: {
      h1b: [3.6, 3.5, 3.7],
      h2b: [6.3, 6.4, 6.2],
      hh: [13.0, 13.2, 12.9],
      broadjump: [6.4, 6.6, 6.5]
    },
    catcherData: {
      poptime: [2.70, 2.68, 2.72],
      throwaccuracy: [1, 1, 0],
      throwspeed: [55, 57, 56],
      popfly: [0, 1, 1],
      blocking: 4,
      buntfielding: 3
    },
    pitchingData: {
      fastballspeed: [52, 54, 53],
      accuracy: 3,
      movement: 4,
      mechanics: 3
    }
  },
  {
    id: 7,
    name: "Isabella Brown",
    number: "18",
    hustleEnergy: { attitude: 5, runsonoff: 5, cheers: 5, dives: 4, baserunning: 5 },
    fieldingData: { flyball: 7, throwspeed: [1.55, 1.60, 1.58], throwaccuracy: [1, 1, 1] },
    hittingData: {
      batspeed: [64, 66, 65],
      exitvelocity: [70, 72, 71],
      bunt1b: [1, 1, 1],
      buntp: [1, 1, 1],
      bunt3b: [1, 1, 0],
      pitchrecog: [1, 1, 1, 1, 1],
      strikerecog: [1, 1, 1, 1, 1]
    },
    speedTimes: {
      h1b: [3.1, 3.0, 3.2],
      h2b: [5.7, 5.8, 5.6],
      hh: [11.8, 12.0, 11.7],
      broadjump: [7.2, 7.4, 7.3]
    },
    catcherData: {
      poptime: [2.35, 2.32, 2.38],
      throwaccuracy: [1, 1, 1],
      throwspeed: [64, 66, 65],
      popfly: [1, 1, 1],
      blocking: 5,
      buntfielding: 5
    },
    pitchingData: {
      fastballspeed: [58, 60, 59],
      accuracy: 5,
      movement: 5,
      mechanics: 4
    }
  },
  {
    id: 8,
    name: "Mia Wilson",
    number: "21",
    hustleEnergy: { attitude: 4, runsonoff: 3, cheers: 3, dives: 3, baserunning: 3 },
    fieldingData: { flyball: 4, throwspeed: [2.35, 2.40, 2.38], throwaccuracy: [0, 1, 0] },
    hittingData: {
      batspeed: [50, 52, 51],
      exitvelocity: [56, 58, 57],
      bunt1b: [1, 0, 1],
      buntp: [0, 1, 0],
      bunt3b: [1, 0, 1],
      pitchrecog: [1, 0, 1, 0, 1],
      strikerecog: [1, 1, 0, 1, 0]
    },
    speedTimes: {
      h1b: [4.3, 4.5, 4.4],
      h2b: [7.2, 7.4, 7.3],
      hh: [14.5, 14.8, 14.6],
      broadjump: [5.2, 5.4, 5.3]
    },
    catcherData: {
      poptime: [3.10, 3.15, 3.12],
      throwaccuracy: [0, 0, 1],
      throwspeed: [42, 44, 43],
      popfly: [0, 1, 0],
      blocking: 2,
      buntfielding: 2
    },
    pitchingData: {
      fastballspeed: [44, 46, 45],
      accuracy: 2,
      movement: 2,
      mechanics: 2
    }
  },
  {
    id: 9,
    name: "Charlotte Davis",
    number: "5",
    hustleEnergy: { attitude: 5, runsonoff: 4, cheers: 5, dives: 5, baserunning: 4 },
    fieldingData: { flyball: 8, throwspeed: [1.48, 1.52, 1.50], throwaccuracy: [1, 1, 1] },
    hittingData: {
      batspeed: [67, 69, 68],
      exitvelocity: [73, 75, 74],
      bunt1b: [1, 1, 1],
      buntp: [1, 1, 1],
      bunt3b: [1, 1, 1],
      pitchrecog: [1, 1, 1, 1, 1],
      strikerecog: [1, 1, 1, 1, 1]
    },
    speedTimes: {
      h1b: [2.8, 2.9, 2.7],
      h2b: [5.4, 5.5, 5.3],
      hh: [11.2, 11.4, 11.1],
      broadjump: [7.6, 7.8, 7.7]
    },
    catcherData: {
      poptime: [2.20, 2.18, 2.22],
      throwaccuracy: [1, 1, 1],
      throwspeed: [70, 72, 71],
      popfly: [1, 1, 1],
      blocking: 5,
      buntfielding: 5
    },
    pitchingData: {
      fastballspeed: [62, 64, 63],
      accuracy: 5,
      movement: 5,
      mechanics: 5
    }
  },
  {
    id: 10,
    name: "Amelia Garcia",
    number: "11",
    hustleEnergy: { attitude: 4, runsonoff: 4, cheers: 4, dives: 4, baserunning: 4 },
    fieldingData: { flyball: 6, throwspeed: [1.90, 1.88, 1.92], throwaccuracy: [1, 1, 0] },
    hittingData: {
      batspeed: [59, 61, 60],
      exitvelocity: [65, 67, 66],
      bunt1b: [1, 1, 1],
      buntp: [1, 0, 1],
      bunt3b: [1, 1, 1],
      pitchrecog: [1, 1, 0, 1, 1],
      strikerecog: [1, 1, 1, 1, 0]
    },
    speedTimes: {
      h1b: [3.3, 3.4, 3.2],
      h2b: [6.0, 6.1, 5.9],
      hh: [12.5, 12.7, 12.4],
      broadjump: [6.7, 6.9, 6.8]
    },
    catcherData: {
      poptime: [2.55, 2.52, 2.58],
      throwaccuracy: [1, 1, 1],
      throwspeed: [60, 62, 61],
      popfly: [1, 1, 0],
      blocking: 4,
      buntfielding: 4
    },
    pitchingData: {
      fastballspeed: [56, 58, 57],
      accuracy: 4,
      movement: 4,
      mechanics: 4
    }
  }
];

// Instructions:
// 1. Open your softball tryouts page in the browser
// 2. Open the browser console (F12)
// 3. Copy and paste this entire file contents into the console
// 4. Run: players = samplePlayers;
// 5. Run: saveData();
// 6. Run: uploadToSheets();
// 7. You should see the sample data appear in your spreadsheet!

console.log('Sample data loaded! Run these commands:');
console.log('1. players = samplePlayers;');
console.log('2. saveData();');
console.log('3. uploadToSheets();');
