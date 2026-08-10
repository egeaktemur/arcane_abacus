import React from 'react';
import { useGameState } from './hooks/useGameState';
import { SetupScreen } from './components/SetupScreen';
import { BiddingScreen } from './components/BiddingScreen';
import { ActiveGameView } from './components/ActiveGameView';
import { GAME_STATES } from './types/game';

export default function App() {
  const { 
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
    resetGame 
  } = useGameState();

  return (
    <div className="app-container min-h-screen bg-[#2A1810]">
      {gameState.gameState === GAME_STATES.SETUP && (
        <SetupScreen
          gameState={gameState}
          updatePlayer={updatePlayer}
          addPlayer={addPlayer}
          removePlayer={removePlayer}
          startGame={startGame}
        />
      )}

      {gameState.gameState === GAME_STATES.BIDDING && (
        <BiddingScreen
          gameState={gameState}
          setBid={setBid}
          nextBidder={nextBidder}
          prevBidder={prevBidder}
          setBidStep={setBidStep}
          finalizeBids={finalizeBids}
        />
      )}

      {gameState.gameState !== GAME_STATES.SETUP && gameState.gameState !== GAME_STATES.BIDDING && (
        <ActiveGameView
          gameState={gameState}
          resetGame={resetGame}
        />
      )}
    </div>
  );
}
