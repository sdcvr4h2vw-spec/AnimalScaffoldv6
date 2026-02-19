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
 * 30% Horizontally, 30% Vertically, 40% Blank
 */
const getOrientation = (): string => {
  const roll = Math.random() * 100;
  if (roll < 30) return 'Horizontally';
  if (roll < 60) return 'Vertically';
  return ''; // Blank (player chooses)
};

/**
 * HELPER: Get Placement Modifier
 * 10% Highest piece, 90% Different piece
 */
const getPlacement = (): string => {
  const roll = Math.random() * 100;
  if (roll < 10) return 'on your highest piece';
  return 'on a different piece';
};

export const generateInstruction = (totalTurns: number, progress: number): Instruction => {
  // 1. Define the Pool of potential types
  const pool: { type: InstructionType; weight: number }[] = [
    { type: 'BUILD', weight: 80 }
  ];

  // 2. Add restricted cards if conditions are met
  // Restriction: MOVE only after 5 total turns
  if (totalTurns >= 5) {
    pool.push({ type: 'MOVE', weight: 10 });
  }

  // Restriction: REMOVE only after 50% game progress
  if (progress > 0.5) {
    pool.push({ type: 'REMOVE', weight: 10 });
  }

  // 3. Pick the type
  const selectedType = getWeightedRandom(pool);

  // 4. Build the specific instruction object
  switch (selectedType) {
    case 'MOVE': {
      const orientation = getOrientation();
      const orientationText = orientation ? ` positioning it ${orientation}` : '';
      return {
        type: 'MOVE',
        text: `Move 1 of your animals${orientationText}`,
        secondaryText: 'If all your animals are in the pen, place a new one on a scaffold',
        pieces: 1 // For timer calculation
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
      const pieces = Math.floor(Math.random() * 4) + 1; // 1-4 pieces
      const orientation = getOrientation();
      const placement = getPlacement();
      
      // Construct sentence: Build using [X] pieces [positioned orientation] [placement]
      let text = `Build using ${pieces} ${pieces === 1 ? 'piece' : 'pieces'}`;
      if (orientation) text += ` positioned ${orientation}`;
      text += ` ${placement}`;

      return {
        type: 'BUILD',
        text: text,
        secondaryText: 'You may choose to play animals as pieces',
        pieces: pieces
      };
    }
  }
};