import { Instruction, InstructionType } from '../types';

/**
 * HELPER: Weighted Random Selection
 */
const getWeightedRandom = <T>(items: { value: T; weight: number }[]): T => {
  const totalWeight = items.reduce((acc, item) => acc + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of items) {
    if (random < item.weight) return item.value;
    random -= item.weight;
  }
  return items[0].value;
};

/**
 * HELPER: Get Orientation Modifier
 */
const getOrientation = (): string => {
  const roll = Math.random() * 100;
  if (roll < 30) return 'horizontally';
  if (roll < 60) return 'vertically';
  return ''; 
};


/**
 * HELPER: Generate Mixed Build Text
 * Rolls orientation for each piece, caps horizontals at 2, and formats the grammar.
 */
const generateBuildText = (pieces: number): string => {
  let horizontals = 0;
  let verticals = 0;
  let anys = 0;

  // Roll for each piece individually
  for (let i = 0; i < pieces; i++) {
    const roll = Math.random() * 100;
    
    // Cap horizontals at 2. If it rolls horizontal but we are at the cap, it defaults to 'any'
    if (roll < 30 && horizontals < 2) {
      horizontals++;
    } else if (roll >= 30 && roll < 60) {
      verticals++;
    } else {
      anys++;
    }
  }

  // Grammar for a single piece
  if (pieces === 1) {
    if (horizontals === 1) return 'Build 1 piece horizontally.';
    if (verticals === 1) return 'Build 1 piece vertically.';
    return 'Build 1 piece in any orientation.';
  }

  // Grammar for multiple pieces
  const details = [];
  if (horizontals > 0) details.push(`${horizontals} horizontal`);
  if (verticals > 0) details.push(`${verticals} vertical`);
  if (anys > 0) details.push(`${anys} any orientation`);

  // If all pieces rolled 'any'
  if (details.length === 1 && anys > 0) {
    return `Build ${pieces} pieces in any orientation.`;
  }

  // Join the array cleanly (e.g., "2 vertical and 1 horizontal")
  const detailsString = details.join(' and ');

  return `Build ${pieces} pieces: ${detailsString}.`;
};



export const generateInstruction = (totalTurns: number, progress: number): Instruction => {
  // 1. Define the Pool
  // We've lowered BUILD weight to 60 to give more room for others
  const pool: { type: InstructionType; weight: number }[] = [
    { type: 'BUILD', weight: 60 }
  ];

  // 2. Add restricted cards
  // BUFF: Changed from 5 turns to 3 turns
  if (totalTurns >= 3) {
    pool.push({ type: 'MOVE', weight: 20 }); // BUFF: Increased from 10 to 20
  }

  // BUFF: REMOVE now has a higher chance once the game is half over
  if (progress > 0.5) {
    pool.push({ type: 'REMOVE', weight: 20 }); // BUFF: Increased from 10 to 20
  }

  // 3. Select type
  const selectedType = getWeightedRandom(pool);

  // 4. Build instruction
  switch (selectedType) {
    case 'MOVE': {
      const orientation = getOrientation();
      const orientationText = orientation ? ` positioning it ${orientation}` : '';
      return {
        type: 'MOVE',
        text: `Move 1 of your animals${orientationText}`,
        secondaryText: 'If all your animals are in the pen, place a new one on a scaffold',
        pieces: 1 
      };
    }

    case 'REMOVE': {
      return {
        type: 'REMOVE',
        text: 'Take one of your animals back to the pen.',
        secondaryText: 'If all your animals are in the pen, skip this turn',
        pieces: 1
      };
    }

    case 'BUILD':
    default: {
      const pieces = Math.floor(Math.random() * 4) + 1;
      
      return {
        type: 'BUILD',
        text: generateBuildText(pieces),
        secondaryText: 'You may choose to play animals as pieces.',
        pieces: pieces
      };
    }
  }
};