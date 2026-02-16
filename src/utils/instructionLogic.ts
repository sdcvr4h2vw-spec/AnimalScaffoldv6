
import { Instruction, InstructionType } from '../types';

// Helper to get a random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// --- RANDOMIZER HELPERS ---

const getRandomOrientation = (): string => {
  const rand = Math.random();
  if (rand < 0.30) return 'horizontally';
  if (rand < 0.60) return 'vertically';
  return ''; // 40% blank (player choice)
};

const getRandomPlacement = (): string => {
  const rand = Math.random();
  if (rand < 0.10) return 'on your highest piece';
  return 'on a different piece'; // 90%
};

// --- CARD GENERATORS ---

const createBuildInstruction = (): Instruction => {
  const pieces = getRandomInt(1, 4);
  const orientation = getRandomOrientation();
  
  let text = `Build using ${pieces} ${pieces === 1 ? 'piece' : 'pieces'}`;
  if (orientation) {
    text += ` positioned ${orientation}`;
  }

  return {
    type: 'BUILD',
    pieces,
    text,
    secondaryText: 'You may choose to play animals as pieces',
    orientation
  };
};

const createMoveInstruction = (): Instruction => {
  const count = getRandomInt(1, 2);
  const orientation = getRandomOrientation();
  const placement = getRandomPlacement();

  let text = `Move ${count} of your animals`;
  if (orientation) text += ` positioning ${count === 1 ? 'it' : 'them'} ${orientation}`;
  text += `, placing ${count === 1 ? 'it' : 'them'} ${placement}`;

  return {
    type: 'MOVE',
    pieces: 1, // Logic treats as 1 piece for timer, but we hardcode 15s anyway
    text,
    secondaryText: 'If all your animals are in the pen, place a new one on a scaffold'
  };
};

const createRemoveInstruction = (): Instruction => {
  return {
    type: 'REMOVE',
    pieces: 1,
    text: 'Take one of your animals back to the pen.',
    secondaryText: 'If all your animals are in the pen, skip this turn'
  };
};

/**
 * Generates a single instruction for Game Variant A.
 * @param turnCount - Current total turns taken
 * @param gameProgress - 0.0 to 1.0 representing percentage of game complete
 */
export const generateInstruction = (
  turnCount: number,
  gameProgress: number
): Instruction => {

  // Eligibility Check
  const options: { type: InstructionType; weight: number }[] = [];

  // 1. BUILD: Always available. Base Weight 70.
  options.push({ type: 'BUILD', weight: 70 });

  // 2. MOVE: Available after 3 turns. Base Weight 20.
  if (turnCount >= 3) {
    options.push({ type: 'MOVE', weight: 20 });
  }

  // 3. REMOVE: Available after 50% time. Base Weight 10.
  if (gameProgress > 0.5) {
    options.push({ type: 'REMOVE', weight: 10 });
  }

  // Select based on weights
  const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
  let random = Math.random() * totalWeight;
  
  let selectedType: InstructionType = 'BUILD';
  for (const opt of options) {
    if (random < opt.weight) {
      selectedType = opt.type;
      break;
    }
    random -= opt.weight;
  }

  // Create Card
  switch (selectedType) {
    case 'MOVE': return createMoveInstruction();
    case 'REMOVE': return createRemoveInstruction();
    default: return createBuildInstruction();
  }
};
