import { Instruction, InstructionType } from '../types';

/**
 * HELPER: Weighted Random Selection
 * Picks an item from a list based on its weight.
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
 * 30% Horizontally, 30% Vertically, 40% Blank (player choice)
 */
const getOrientation = (): string => {
  const roll = Math.random() * 100;
  if (roll < 30) return 'Horizontally';
  if (roll < 60) return 'Vertically';
  return ''; 
};

export const generateInstruction = (totalTurns: number, progress: number): Instruction => {
  // 1. Define the Pool of potential card types
  const pool: { type: InstructionType; weight: number }[] = [
    { type: 'BUILD', weight: 80 }
  ];

  // 2. Add restricted cards based on game progress
  // MOVE only appears after 5 total turns have passed
  if (totalTurns >= 5) {
    pool.push({ type: 'MOVE', weight: 10 });
  }

  // REMOVE only appears after the game is 50% finished
  if (progress > 0.5) {
    pool.push({ type: 'REMOVE', weight: 10 });
  }

  // 3. Select the type from the currently eligible pool
  const selectedType = getWeightedRandom(pool);

  // 4. Build the instruction object
  switch (selectedType) {
    case 'MOVE': {
      const orientation = getOrientation();
      // "Move 1 of your animals" OR "Move 1 of your animals positioning it Vertically"
      const orientationText = orientation ? ` positioning it ${orientation}` : '';
      
      return {
        type: 'MOVE',
        text: `Move 1 of your animals${orientationText}`,
        secondaryText: 'If all your animals are in the pen, place a new one on a scaffold',
        pieces: 1 // Default for timer
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
      
      // "Build using 3 pieces" OR "Build using 3 pieces positioned Horizontally"
      let text = `Build using ${pieces} ${pieces === 1 ? 'piece' : 'pieces'}`;
      if (orientation) {
        text += ` positioned ${orientation}`;
      }

      return {
        type: 'BUILD',
        text: text,
        secondaryText: 'You may choose to play animals as pieces',
        pieces: pieces
      };
    }
  }
};