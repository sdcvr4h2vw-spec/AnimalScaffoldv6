
import { InstructionType } from '../types';

/**
 * Calculates the time allocated for a specific turn.
 * 
 * Rules:
 * - Base Time: 15 Seconds.
 * - BUILD Card Modifier: +3 Seconds for every piece above 1.
 *   - Formula: 15 + ((pieces - 1) * 3)
 * - MOVE/REMOVE/FOX: Flat 15 seconds (pieces value is ignored or treated as 1).
 */
export const calculateTurnTime = (
  type: InstructionType,
  pieces: number
): number => {
  const BASE_TIME = 15;
  
  if (type === 'BUILD') {
    // Ensure we don't subtract if pieces is 0 or 1 (though logic dictates 1-4)
    const additionalPieces = Math.max(0, pieces - 1);
    return BASE_TIME + (additionalPieces * 3);
  }

  // All other types (MOVE, REMOVE, FOX) are flat base time
  return BASE_TIME;
};
