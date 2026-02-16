
import { Instruction, InstructionType } from '../types';
import { generateInstruction as generateGameA } from './instructionLogic';

const createFoxInstruction = (): Instruction => {
  return {
    type: 'FOX',
    pieces: 1, // Flat 15s
    text: 'Fox!',
    secondaryText: 'Take control of the fox. You may play this by giving it another player. On their next turn they must move any animals in their pen onto their scaffold before starting their turn as normal'
  };
};

/**
 * Generates instruction for Game B.
 * Includes Fox card mixed with Game A cards.
 */
export const generateExperimentalInstruction = (
  turnCount: number,
  gameProgress: number
): Instruction => {
  
  // FOX: Available after 33% time. Weight 7%.
  // If Fox is eligible, we roll for it first against the rest of the deck.
  // The prompt asks to redistribute weights, but a simple probabilistic check is cleaner.
  
  if (gameProgress > 0.33) {
    // 7% chance for Fox
    if (Math.random() < 0.07) {
      return createFoxInstruction();
    }
  }

  // If not Fox, generate Game A logic
  // (Weights are naturally distributed by the Game A generator)
  return generateGameA(turnCount, gameProgress);
};
