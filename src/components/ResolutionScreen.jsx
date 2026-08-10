import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CircularTable } from './CircularTable';
import { TerminateMatchModal } from './TerminateMatchModal';
import { ScoreTableModal } from './ScoreTableModal';
import { Scroll, CheckCircle2, XCircle, Table2 } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col items-center justify-between p-3 sm:p-5 bg-[#2A1810] relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Header Info */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl z-10"
      >
        <div className="flex items-center justify-between bg-[#3E2723]/95 border border-[#D4AF37]/40 rounded-2xl px-4 py-2.5 shadow-xl">
          <div className="flex items-center gap-2">
            <Scroll className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-xs font-cinzel text-[#D4AF37]/80 uppercase">Phase III • Round Table</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowScoreTable(true)}
              title="View Score Ledger"
              className="w-9 h-9 rounded-lg bg-[#2A1810] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all active:scale-95 shrink-0"
            >
              <Table2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowTerminateModal(true)}
              title="Terminate Match"
              className="w-9 h-9 rounded-lg bg-[#2A1810] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] hover:bg-[#8B0000]/40 transition-all active:scale-95 shrink-0"
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
      <div className="my-auto w-full max-w-2xl z-10 flex flex-col items-center justify-center py-2 gap-9 sm:gap-11">
        {/* Compact Round / Tricks Indicator */}
        <div className="flex items-center gap-2 bg-[#3E2723]/95 border border-[#D4AF37]/40 rounded-full px-4 py-1.5 shadow-lg">
          <span className="text-xs sm:text-sm font-bold font-cinzel text-[#F3E8D2]">
            Round {currentRound}/{maxRounds}
          </span>
          <span className="w-px h-3.5 bg-[#D4AF37]/40" />
          <span className={`text-xs sm:text-sm font-bold font-cinzel px-2 py-0.5 rounded-full ${
            isValidRoundResolution
              ? 'bg-emerald-900/90 text-emerald-200'
              : 'bg-amber-950/80 text-amber-300'
          }`}>
            Tricks {totalActuals}/{currentRound}
          </span>
        </div>

        <CircularTable
          players={players}
          bids={bids}
          actuals={actuals}
          onIncrement={incrementActual}
          onDecrement={decrementActual}
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
              ? 'bg-gradient-to-r from-[#8B0000] via-[#5C0A0A] to-[#8B0000] text-[#F3E8D2] hover:brightness-110 active:scale-[0.98] border-2 border-[#D4AF37]'
              : 'bg-gray-500/30 text-gray-400 cursor-not-allowed border border-gray-500/20'
          }`}
        >
          <CheckCircle2 className={`w-6 h-6 ${isValidRoundResolution ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
          <span>{currentRound === maxRounds ? 'Finalize & Reveal Endgame' : 'Finalize Round & Score'}</span>
        </button>
      </motion.div>
    </div>
  );
};
