import React from 'react';
import { motion } from 'framer-motion';
import { CircularTable } from './CircularTable';
import { Scroll, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

export const ResolutionScreen = ({
  gameState,
  incrementActual,
  decrementActual,
  finalizeRound,
}) => {
  const { players, currentRound, maxRounds, roundData } = gameState;
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
            <div>
              <span className="text-xs font-cinzel text-[#D4AF37]/80 uppercase block">Phase III • Round Table</span>
              <span className="text-base sm:text-lg font-bold font-cinzel text-[#F3E8D2]">
                Round {currentRound} of {maxRounds}
              </span>
            </div>
          </div>

          <div className="text-center">
            <span className="text-xs font-cinzel text-[#D4AF37]/80 uppercase block">Tricks Accounted For</span>
            <span className={`text-base font-extrabold font-cinzel px-2.5 py-0.5 rounded-full ${
              isValidRoundResolution 
                ? 'bg-emerald-900/90 text-emerald-200 border border-emerald-400/50' 
                : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
            }`}>
              {totalActuals} / {currentRound}
            </span>
          </div>

          {/* Cumulative Score Hiding Note */}
          <div className="text-right">
            <span className="text-[10px] font-cinzel text-[#D4AF37]/70 uppercase block">Scores</span>
            <span className="text-xs font-cinzel font-semibold text-white/80 bg-black/40 px-2 py-0.5 rounded">
              🔒 Hidden
            </span>
          </div>
        </div>
      </motion.div>

      {/* Center Table Layout */}
      <div className="my-auto w-full max-w-2xl z-10 flex flex-col items-center justify-center py-2">
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
        {!isValidRoundResolution && (
          <div className="mb-3 p-2.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs font-cinzel flex items-center justify-center gap-2 text-center shadow-lg">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {totalActuals < currentRound 
                ? `Account for ${currentRound - totalActuals} more trick(s) before finalizing.` 
                : `Over-allocated by ${totalActuals - currentRound} trick(s). Use minus button to adjust.`}
            </span>
          </div>
        )}

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
