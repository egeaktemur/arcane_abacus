import React from 'react';
import { useGameState } from './hooks/useGameState';
import { SetupScreen } from './components/SetupScreen';
import { ActiveGameView } from './components/ActiveGameView';
import { GAME_STATES } from './types/game';

export default function App() {
  const { 
    gameState, 
    updatePlayer, 
    addPlayer, 
    removePlayer, 
    startGame, 
    resetGame 
  } = useGameState();

  return (
    <div className="app-container min-h-screen bg-[#2A1810]">
      {gameState.gameState === GAME_STATES.SETUP ? (
        <SetupScreen
          gameState={gameState}
          updatePlayer={updatePlayer}
          addPlayer={addPlayer}
          removePlayer={removePlayer}
          startGame={startGame}
        />
      ) : (
        <ActiveGameView
          gameState={gameState}
          resetGame={resetGame}
        />
      )}
    </div>
  );
}
