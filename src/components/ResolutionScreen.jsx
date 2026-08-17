import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CircularTable } from './CircularTable';
import { TerminateMatchModal } from './TerminateMatchModal';
import { ScoreTableModal } from './ScoreTableModal';
import { Scroll, CheckCircle2, AlertCircle, XCircle, Table2 } from 'lucide-react';

export const ResolutionScreen = ({
  gameState,
  incrementActual,
  decrementActual,
  finalizeRound,
  resetGame,
}) => {
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [showScoreTable, setShowScoreTable] = useState(false);
  const { players, currentRound, maxRounds, roundData, history = [] } = gameState;
  const { bids = {}, actuals = {} } = roundData;

  // Total actual tricks entered so far across all players
  const totalActuals = Object.values(actuals).reduce((acc, curr) => acc + (curr || 0), 0);

  // Validation: sum of actual tricks MUST equal current round number
  const isValidRoundResolution = totalActuals === currentRound;

  return (
    <div className="h-full flex flex-col items-center justify-between p-3 sm:p-5 medieval-bg relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-gold)_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Header Info */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl z-10"
      >
        <div className="flex items-center justify-between bg-wood/95 border border-gold/40 rounded-2xl px-4 py-2.5 shadow-xl">
          <div className="flex items-center gap-2">
            <Scroll className="w-5 h-5 text-gold" />
            <span className="text-xs font-cinzel text-gold/80 uppercase">Phase III • Round Table</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowScoreTable(true)}
              title="View Score Ledger"
              className="w-9 h-9 rounded-lg bg-wood-dark border border-gold/50 flex items-center justify-center text-gold hover:bg-gold/20 transition-all active:scale-95 shrink-0"
            >
              <Table2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowTerminateModal(true)}
              title="Terminate Match"
              className="w-9 h-9 rounded-lg bg-wood-dark border border-gold/50 flex items-center justify-center text-gold hover:bg-crimson/40 transition-all active:scale-95 shrink-0"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      <TerminateMatchModal
        isOpen={showTerminateModal}
        onCancel={() => setShowTerminateModal(false)}
        onConfirm={() => {
          setShowTerminateModal(false);
          resetGame();
        }}
      />

      <ScoreTableModal
        isOpen={showScoreTable}
        onClose={() => setShowScoreTable(false)}
        players={players}
        history={history}
      />

      {/* Center Table Layout */}
      <div className="my-auto w-full max-w-2xl z-10 flex flex-col items-center justify-center py-2">
        <CircularTable
          players={players}
          bids={bids}
          actuals={actuals}
          onIncrement={incrementActual}
          onDecrement={decrementActual}
          centerContent={
            <div className="flex items-center justify-center">
              {/* Round progress medallion: conic ring fills as rounds pass, tricks-entered count sits inside */}
              <div
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[3px] shadow-xl"
                style={{
                  background: `conic-gradient(#D4AF37 ${(currentRound / maxRounds) * 360}deg, rgba(212,175,55,0.18) 0deg)`,
                }}
              >
                <div className={`w-full h-full rounded-full bg-wood border flex flex-col items-center justify-center gap-0.5 ${
                  isValidRoundResolution ? 'border-emerald-400/50' : 'border-amber-500/40'
                }`}>
                  {isValidRoundResolution ? (
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
                  )}
                  <span className={`text-base sm:text-lg font-black font-cinzel leading-none ${
                    isValidRoundResolution ? 'text-emerald-200' : 'text-amber-300'
                  }`}>
                    {totalActuals}/{currentRound}
                  </span>
                </div>
              </div>
            </div>
          }
        />
      </div>

      {/* Bottom Action Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl z-10 mt-2"
      >
        <button
          type="button"
          disabled={!isValidRoundResolution}
          onClick={finalizeRound}
          className={`w-full py-4 rounded-2xl font-cinzel font-bold text-base sm:text-lg uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl ${
            isValidRoundResolution
              ? 'bg-gradient-to-r from-crimson via-crimson-dark to-crimson text-parchment hover:brightness-110 active:scale-[0.98] border-2 border-gold'
              : 'bg-gray-500/30 text-gray-400 cursor-not-allowed border border-gray-500/20'
          }`}
        >
          <CheckCircle2 className={`w-6 h-6 ${isValidRoundResolution ? 'text-gold' : 'text-gray-500'}`} />
          <span>{currentRound === maxRounds ? 'Finalize & Reveal Endgame' : 'Finalize Round'}</span>
        </button>
      </motion.div>
    </div>
  );
};
