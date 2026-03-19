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
      const orientation = getOrientation();
      let text = `Build using ${pieces} ${pieces === 1 ? 'piece' : 'pieces'}`;
      if (orientation) text += ` positioned ${orientation}`;

      return {
        type: 'BUILD',
        text: text,
        secondaryText: 'You may choose to play animals as pieces',
        pieces: pieces
      };
    }
  }
};