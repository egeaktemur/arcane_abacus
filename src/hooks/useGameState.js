import { useState, useEffect, useCallback } from 'react';
import { 
  INITIAL_GAME_STATE, 
  GAME_STATES, 
  calculateMaxRounds, 
  HERALDRY_COLORS,
  getStartingPlayerIndex,
  calculateRoundScore
} from '../types/game';

const LOCAL_STORAGE_KEY = 'arcane_abacus_game_state_v1';

export const useGameState = () => {
  const [gameState, setGameState] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.players && Array.isArray(parsed.players)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to read game state from localStorage:', e);
    }
    return INITIAL_GAME_STATE;
  });

  // Sync to localStorage whenever gameState changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
      console.error('Failed to save game state to localStorage:', e);
    }
  }, [gameState]);

  // Update a specific player's field (name, color, score)
  const updatePlayer = useCallback((index, field, value) => {
    setGameState(prev => {
      const updatedPlayers = [...prev.players];
      updatedPlayers[index] = {
        ...updatedPlayers[index],
        [field]: value,
      };
      return {
        ...prev,
        players: updatedPlayers,
      };
    });
  }, []);

  // Add a new player (max 6)
  const addPlayer = useCallback(() => {
    setGameState(prev => {
      if (prev.players.length >= 6) return prev;

      const usedColors = new Set(prev.players.map(p => p.color));
      const availableColor = HERALDRY_COLORS.find(c => !usedColors.has(c.hex)) || HERALDRY_COLORS[0];
      
      const newId = `p${Date.now()}`;
      const defaultNames = ['Gandalf', 'Saruman', 'Radagast', 'Alatar', 'Pallando', 'Olórin'];
      const nextName = defaultNames[prev.players.length] || `Wizard ${prev.players.length + 1}`;

      const newPlayers = [
        ...prev.players,
        { id: newId, name: nextName, color: availableColor.hex, totalScore: 0 }
      ];

      return {
        ...prev,
        players: newPlayers,
        playerCount: newPlayers.length,
        maxRounds: calculateMaxRounds(newPlayers.length),
      };
    });
  }, []);

  // Remove a player (min 3)
  const removePlayer = useCallback((index) => {
    setGameState(prev => {
      if (prev.players.length <= 3) return prev;
      const newPlayers = prev.players.filter((_, i) => i !== index);
      return {
        ...prev,
        players: newPlayers,
        playerCount: newPlayers.length,
        maxRounds: calculateMaxRounds(newPlayers.length),
      };
    });
  }, []);

  // Start the game (validate & change gameState to BIDDING)
  const startGame = useCallback(() => {
    setGameState(prev => {
      if (prev.players.length < 3 || prev.players.length > 6) return prev;
      
      const namesValid = prev.players.every(p => p.name.trim().length > 0);
      const uniqueColors = new Set(prev.players.map(p => p.color));
      if (!namesValid || uniqueColors.size !== prev.players.length) return prev;

      const totalRounds = calculateMaxRounds(prev.players.length);
      const startingIndex = getStartingPlayerIndex(1, prev.players.length);

      return {
        ...prev,
        gameState: GAME_STATES.BIDDING,
        currentRound: 1,
        maxRounds: totalRounds,
        roundData: {
          startingPlayerIndex: startingIndex,
          currentBidStep: 0,
          bids: {},
          actuals: {},
        },
        history: [],
      };
    });
  }, []);

  // Set a player's bid
  const setBid = useCallback((playerId, bidValue) => {
    setGameState(prev => ({
      ...prev,
      roundData: {
        ...prev.roundData,
        bids: {
          ...prev.roundData.bids,
          [playerId]: bidValue,
        },
      },
    }));
  }, []);

  // Navigate to next bidder
  const nextBidder = useCallback(() => {
    setGameState(prev => {
      const currentStep = prev.roundData.currentBidStep || 0;
      if (currentStep < prev.players.length - 1) {
        return {
          ...prev,
          roundData: {
            ...prev.roundData,
            currentBidStep: currentStep + 1,
          },
        };
      }
      return prev;
    });
  }, []);

  // Navigate to previous bidder
  const prevBidder = useCallback(() => {
    setGameState(prev => {
      const currentStep = prev.roundData.currentBidStep || 0;
      if (currentStep > 0) {
        return {
          ...prev,
          roundData: {
            ...prev.roundData,
            currentBidStep: currentStep - 1,
          },
        };
      }
      return prev;
    });
  }, []);

  // Set specific bid step
  const setBidStep = useCallback((stepIndex) => {
    setGameState(prev => {
      if (stepIndex >= 0 && stepIndex < prev.players.length) {
        return {
          ...prev,
          roundData: {
            ...prev.roundData,
            currentBidStep: stepIndex,
          },
        };
      }
      return prev;
    });
  }, []);

  // Finalize all bids for the round and transition to RESOLUTION phase
  const finalizeBids = useCallback(() => {
    setGameState(prev => {
      // Initialize actuals to 0 for all players if undefined
      const initialActuals = {};
      prev.players.forEach(p => {
        initialActuals[p.id] = prev.roundData.actuals[p.id] || 0;
      });

      return {
        ...prev,
        gameState: GAME_STATES.RESOLUTION,
        roundData: {
          ...prev.roundData,
          actuals: initialActuals,
        },
      };
    });
  }, []);

  // Increment actual tricks won by a player
  const incrementActual = useCallback((playerId) => {
    setGameState(prev => {
      const currentActuals = prev.roundData.actuals || {};
      const currentVal = currentActuals[playerId] || 0;
      const sumActuals = Object.values(currentActuals).reduce((acc, curr) => acc + (curr || 0), 0);

      // Total actual tricks cannot exceed current round number
      if (sumActuals >= prev.currentRound) return prev;

      return {
        ...prev,
        roundData: {
          ...prev.roundData,
          actuals: {
            ...currentActuals,
            [playerId]: currentVal + 1,
          },
        },
      };
    });
  }, []);

  // Decrement actual tricks won by a player (Undo)
  const decrementActual = useCallback((playerId) => {
    setGameState(prev => {
      const currentActuals = prev.roundData.actuals || {};
      const currentVal = currentActuals[playerId] || 0;
      if (currentVal <= 0) return prev;

      return {
        ...prev,
        roundData: {
          ...prev.roundData,
          actuals: {
            ...currentActuals,
            [playerId]: currentVal - 1,
          },
        },
      };
    });
  }, []);

  // Finalize the current round, update scores, and advance to next round
  const finalizeRound = useCallback(() => {
    setGameState(prev => {
      const { players, currentRound, maxRounds, roundData, history = [] } = prev;
      const { bids = {}, actuals = {} } = roundData;

      // Calculate score changes for each player
      const roundScores = {};
      const updatedPlayers = players.map(p => {
        const bid = bids[p.id] || 0;
        const actual = actuals[p.id] || 0;
        const scoreChange = calculateRoundScore(bid, actual);
        roundScores[p.id] = scoreChange;

        return {
          ...p,
          totalScore: (p.totalScore || 0) + scoreChange,
        };
      });

      // Record round in history
      const roundRecord = {
        roundNumber: currentRound,
        bids: { ...bids },
        actuals: { ...actuals },
        scores: roundScores,
      };

      const nextRound = currentRound + 1;
      const isGameOver = nextRound > maxRounds;

      if (isGameOver) {
        return {
          ...prev,
          gameState: GAME_STATES.ENDGAME,
          players: updatedPlayers,
          history: [...history, roundRecord],
        };
      }

      const nextStartingIndex = getStartingPlayerIndex(nextRound, players.length);

      return {
        ...prev,
        gameState: GAME_STATES.BIDDING,
        currentRound: nextRound,
        players: updatedPlayers,
        history: [...history, roundRecord],
        roundData: {
          startingPlayerIndex: nextStartingIndex,
          currentBidStep: 0,
          bids: {},
          actuals: {},
        },
      };
    });
  }, []);

  // Reset complete game state back to Setup
  const resetGame = useCallback(() => {
    setGameState(INITIAL_GAME_STATE);
  }, []);

  return {
    gameState,
    updatePlayer,
    addPlayer,
    removePlayer,
    startGame,
    setBid,
    nextBidder,
    prevBidder,
    setBidStep,
    finalizeBids,
    incrementActual,
    decrementActual,
    finalizeRound,
    resetGame,
  };
};
