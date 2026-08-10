import React from 'react';
import { useGameState } from './hooks/useGameState';
import { SetupScreen } from './components/SetupScreen';
import { BiddingScreen } from './components/BiddingScreen';
import { ResolutionScreen } from './components/ResolutionScreen';
import { EndgameScreen } from './components/EndgameScreen';
import { InstallPwaBanner } from './components/InstallPwaBanner';
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
    incrementActual,
    decrementActual,
    finalizeRound,
    resetGame 
  } = useGameState();

  return (
    <div
      className="app-container h-dvh box-border medieval-bg relative"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      <InstallPwaBanner />

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
          resetGame={resetGame}
        />
      )}

      {gameState.gameState === GAME_STATES.RESOLUTION && (
        <ResolutionScreen
          gameState={gameState}
          incrementActual={incrementActual}
          decrementActual={decrementActual}
          finalizeRound={finalizeRound}
          resetGame={resetGame}
        />
      )}

      {gameState.gameState === GAME_STATES.ENDGAME && (
        <EndgameScreen
          gameState={gameState}
          resetGame={resetGame}
        />
      )}
    </div>
  );
}
