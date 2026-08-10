import { useState, useEffect, useCallback } from 'react';
import { 
  INITIAL_GAME_STATE, 
  GAME_STATES, 
  calculateMaxRounds, 
  HERALDRY_COLORS 
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

      // Find first unused color
      const usedColors = new Set(prev.players.map(p => p.color));
      const availableColor = HERALDRY_COLORS.find(c => !usedColors.has(c.hex)) || HERALDRY_COLORS[0];
      
      const newId = `p${Date.now()}`;
      const defaultNames = ['Gottfried', 'Walburga', 'Roland', 'Kriemhild', 'Parzival'];
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
      // Validate 3 to 6 players
      if (prev.players.length < 3 || prev.players.length > 6) {
        return prev;
      }
      
      // Ensure all player names non-empty and colors distinct
      const namesValid = prev.players.every(p => p.name.trim().length > 0);
      const uniqueColors = new Set(prev.players.map(p => p.color));
      if (!namesValid || uniqueColors.size !== prev.players.length) {
        return prev;
      }

      const totalRounds = calculateMaxRounds(prev.players.length);

      return {
        ...prev,
        gameState: GAME_STATES.BIDDING,
        currentRound: 1,
        maxRounds: totalRounds,
        roundData: {
          startingPlayerIndex: 0,
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

  // Clear localStorage and reset
  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
    setGameState(INITIAL_GAME_STATE);
  }, []);

  return {
    gameState,
    updatePlayer,
    addPlayer,
    removePlayer,
    startGame,
    resetGame,
    clearStorage,
  };
};
