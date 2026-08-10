/**
 * Arcane Abacus Game Types & Constants
 * Medieval German Wizard Companion
 */

export const HERALDRY_COLORS = [
  { id: 'crimson', name: 'Crimson Red', hex: '#7A1F1F', icon: '🩸', border: '#9C3B3B' },
  { id: 'forest', name: 'Forest Green', hex: '#355E3B', icon: '🌲', border: '#4C7A52' },
  { id: 'sapphire', name: 'Royal Sapphire', hex: '#1F3A5F', icon: '🛡️', border: '#3A5A80' },
  { id: 'gold', name: 'Imperial Gold', hex: '#A9812E', icon: '👑', border: '#C7A250' },
  { id: 'amethyst', name: 'Amethyst Purple', hex: '#3F2352', icon: '🔮', border: '#5C3F70' },
  { id: 'copper', name: 'Copper Rust', hex: '#8B4A20', icon: '⚔️', border: '#A6612F' },
];

export const GAME_STATES = {
  SETUP: 'SETUP',
  BIDDING: 'BIDDING',
  RESOLUTION: 'RESOLUTION',
  ENDGAME: 'ENDGAME',
};

export const DEFAULT_PLAYER_PRESETS = [
  { name: 'Gandalf', color: '#7A1F1F' },
  { name: 'Saruman', color: '#355E3B' },
  { name: 'Radagast', color: '#1F3A5F' },
  { name: 'Alatar', color: '#A9812E' },
  { name: 'Pallando', color: '#3F2352' },
  { name: 'Olórin', color: '#8B4A20' },
];

/**
 * Calculate total rounds based on Wizard rules (60 / playerCount)
 */
export const calculateMaxRounds = (playerCount) => {
  if (!playerCount || playerCount < 3 || playerCount > 6) return 15;
  return Math.floor(60 / playerCount);
};

/**
 * Get starting player (lead/dealer shift) index for a round (0-indexed)
 */
export const getStartingPlayerIndex = (currentRound, playerCount) => {
  if (!playerCount || playerCount === 0) return 0;
  return (currentRound - 1) % playerCount;
};

/**
 * Get sequence of player indices in bidding order for a round
 */
export const getBiddingOrder = (currentRound, playerCount) => {
  const startIndex = getStartingPlayerIndex(currentRound, playerCount);
  const order = [];
  for (let i = 0; i < playerCount; i++) {
    order.push((startIndex + i) % playerCount);
  }
  return order;
};

/**
 * Calculate forbidden bid for the last bidder in the round
 * Formula: sum(prior_bids) + last_bid != currentRound
 * Therefore: last_bid != currentRound - sum(prior_bids)
 */
export const calculateForbiddenBid = (currentRound, bids, players, biddingOrder, stepIndex) => {
  if (stepIndex !== biddingOrder.length - 1) {
    return null;
  }

  let sumPrior = 0;
  for (let i = 0; i < stepIndex; i++) {
    const playerIdx = biddingOrder[i];
    const playerId = players[playerIdx]?.id;
    if (playerId !== undefined && bids[playerId] !== undefined) {
      sumPrior += bids[playerId];
    }
  }

  const forbidden = currentRound - sumPrior;

  if (forbidden >= 0 && forbidden <= currentRound) {
    return forbidden;
  }

  return null;
};

/**
 * Calculate round points using exact project.MD scoring formula:
 * Success (actual == bid): 2 + bid
 * Failure (actual != bid): -Math.abs(bid - actual)
 */
export const calculateRoundScore = (bid, actual) => {
  const b = Number(bid) || 0;
  const a = Number(actual) || 0;

  if (a === b) {
    return 2 + b;
  } else {
    return -Math.abs(b - a);
  }
};

export const INITIAL_GAME_STATE = {
  gameState: GAME_STATES.SETUP,
  players: [
    { id: 'p1', name: 'Gandalf', color: '#7A1F1F', totalScore: 0 },
    { id: 'p2', name: 'Saruman', color: '#355E3B', totalScore: 0 },
    { id: 'p3', name: 'Radagast', color: '#1F3A5F', totalScore: 0 },
    { id: 'p4', name: 'Alatar', color: '#A9812E', totalScore: 0 },
  ],
  playerCount: 4,
  currentRound: 1,
  maxRounds: 15,
  roundData: {
    startingPlayerIndex: 0,
    currentBidStep: 0,
    bids: {},
    actuals: {},
  },
  history: [],
};
