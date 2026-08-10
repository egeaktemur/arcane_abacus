/**
 * Arcane Abacus Game Types & Constants
 * Medieval German Wizard Companion
 */

export const HERALDRY_COLORS = [
  { id: 'crimson', name: 'Crimson Red', hex: '#8B0000', icon: '🩸', border: '#D32F2F' },
  { id: 'forest', name: 'Forest Green', hex: '#228B22', icon: '🌲', border: '#388E3C' },
  { id: 'sapphire', name: 'Royal Sapphire', hex: '#0F52BA', icon: '🛡️', border: '#1976D2' },
  { id: 'gold', name: 'Imperial Gold', hex: '#D4AF37', icon: '👑', border: '#FBC02D' },
  { id: 'amethyst', name: 'Amethyst Purple', hex: '#4B0082', icon: '🔮', border: '#7B1FA2' },
  { id: 'copper', name: 'Copper Rust', hex: '#B7410E', icon: '⚔️', border: '#E65100' },
];

export const GAME_STATES = {
  SETUP: 'SETUP',
  BIDDING: 'BIDDING',
  RESOLUTION: 'RESOLUTION',
  ENDGAME: 'ENDGAME',
};

export const DEFAULT_PLAYER_PRESETS = [
  { name: 'Heinrich', color: '#8B0000' },
  { name: 'Hildegard', color: '#228B22' },
  { name: 'Siegfried', color: '#0F52BA' },
  { name: 'Brunhild', color: '#D4AF37' },
  { name: 'Gottfried', color: '#4B0082' },
  { name: 'Walburga', color: '#B7410E' },
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
  // Only the last player in the bidding order faces the restriction rule
  if (stepIndex !== biddingOrder.length - 1) {
    return null;
  }

  // Sum prior bids
  let sumPrior = 0;
  for (let i = 0; i < stepIndex; i++) {
    const playerIdx = biddingOrder[i];
    const playerId = players[playerIdx]?.id;
    if (playerId !== undefined && bids[playerId] !== undefined) {
      sumPrior += bids[playerId];
    }
  }

  const forbidden = currentRound - sumPrior;

  // Only forbidden if it falls within valid bid range [0, currentRound]
  if (forbidden >= 0 && forbidden <= currentRound) {
    return forbidden;
  }

  return null;
};

export const INITIAL_GAME_STATE = {
  gameState: GAME_STATES.SETUP,
  players: [
    { id: 'p1', name: 'Heinrich', color: '#8B0000', totalScore: 0 },
    { id: 'p2', name: 'Hildegard', color: '#228B22', totalScore: 0 },
    { id: 'p3', name: 'Siegfried', color: '#0F52BA', totalScore: 0 },
    { id: 'p4', name: 'Brunhild', color: '#D4AF37', totalScore: 0 },
  ],
  playerCount: 4,
  currentRound: 1,
  maxRounds: 15,
  roundData: {
    startingPlayerIndex: 0,
    currentBidStep: 0, // step index (0 to playerCount - 1) in bidding sequence
    bids: {},
    actuals: {},
  },
  history: [],
};
