import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { HERALDRY_COLORS } from '../types/game';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  RotateCcw, 
  Play, 
  Pause, 
  Scroll, 
  ChevronDown, 
  ChevronUp, 
  Skull, 
  Award,
  ShieldAlert
} from 'lucide-react';

export const EndgameScreen = ({ gameState, resetGame }) => {
  const { players = [], history = [] } = gameState;

  // Sort players by totalScore ascending (Last Place at index 0, Winner at last index)
  const sortedPlayersAsc = [...players].sort((a, b) => (a.totalScore || 0) - (b.totalScore || 0));
  const totalCount = sortedPlayersAsc.length;

  // Tracking how many places from bottom have been revealed so far (0 to totalCount)
  const [revealedCount, setRevealedCount] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [screenShaking, setScreenShaking] = useState(false);

  const autoTimerRef = useRef(null);

  // Trigger confetti coins when the Winner (1st place) is revealed
  const triggerWinnerConfetti = (winnerHex) => {
    try {
      // Gold and Heraldry colors confetti burst
      const end = Date.now() + 3.5 * 1000;
      const colors = ['#D4AF37', '#FFD700', winnerHex || '#8B0000', '#F3E8D2'];

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  };

  // Step forward reveal logic
  const advanceReveal = () => {
    setRevealedCount(prev => {
      if (prev >= totalCount) return prev;
      const nextCount = prev + 1;

      // Visual effect check
      if (nextCount === 1) {
        // Last Place revealed: trigger screen shake
        setScreenShaking(true);
        setTimeout(() => setScreenShaking(false), 600);
      }

      if (nextCount === totalCount) {
        // Winner revealed!
        const winner = sortedPlayersAsc[totalCount - 1];
        triggerWinnerConfetti(winner?.color);
      }

      return nextCount;
    });
  };

  // Timer loop for automatic 3.5s pacing delay
  useEffect(() => {
    if (isAutoPlaying && revealedCount < totalCount) {
      // 3.5 second delay per reveal as required by specification (3-5 sec)
      autoTimerRef.current = setTimeout(() => {
        advanceReveal();
      }, 3500);
    }

    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, [isAutoPlaying, revealedCount, totalCount]);

  const isAllRevealed = revealedCount >= totalCount;

  return (
    <div className={`h-full flex flex-col items-center justify-between p-4 sm:p-6 bg-[#2A1810] relative overflow-hidden select-none ${
      screenShaking ? 'animate-shake' : ''
    }`}>
      {/* Dark Ambient Background with Gold Particles */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 my-2"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#3E2723]/90 border border-[#D4AF37]/50 shadow-lg mb-2">
          <Trophy className="w-4 h-4 text-[#D4AF37] animate-bounce" />
          <span className="text-xs font-cinzel text-[#D4AF37] uppercase tracking-widest font-bold">
            The Endgame Reveal
          </span>
          <Trophy className="w-4 h-4 text-[#D4AF37] animate-bounce" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#F3E8D2] gold-text-glow font-fraktur">
          {isAllRevealed ? 'Grand Wizard Tournament Champion' : 'Revealing Final Scores...'}
        </h1>
        <p className="text-xs sm:text-sm font-cinzel text-[#D4AF37]/80 italic mt-1">
          {isAllRevealed ? 'All scores unsealed! All hail the victor!' : 'Pacing from lowest score up to champion'}
        </p>
      </motion.div>

      {/* Main Reveal Container */}
      <div className="w-full max-w-xl my-auto z-10 space-y-4">
        {/* Reveal Progress Control Bar */}
        {!isAllRevealed && (
          <div className="flex items-center justify-between bg-[#3E2723]/90 border border-[#D4AF37]/40 rounded-xl px-4 py-2 text-xs font-cinzel text-[#D4AF37] shadow-lg">
            <span>Revealed: <strong>{revealedCount}</strong> of <strong>{totalCount}</strong> Wizards</span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="p-1.5 rounded-lg bg-[#2A1810] hover:bg-black/40 text-[#D4AF37] border border-[#D4AF37]/40 transition-all flex items-center gap-1"
                title={isAutoPlaying ? 'Pause Auto Reveal' : 'Resume Auto Reveal'}
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isAutoPlaying ? 'Pacing Active (3.5s)' : 'Paused'}</span>
              </button>

              <button
                type="button"
                onClick={advanceReveal}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#8B0000] to-[#5C0A0A] text-[#F3E8D2] font-bold border border-[#D4AF37] hover:brightness-110 active:scale-95 transition-all shadow"
              >
                Reveal Next
              </button>
            </div>
          </div>
        )}

        {/* Players Reveal Banners Stack (Sorted from 1st place top to Last place bottom when fully revealed) */}
        <div className="touch-scroll space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {/* Display in Descending Rank Order (1st place at top) */}
          {[...sortedPlayersAsc].reverse().map((player, reverseIndex) => {
            const placeFromBottom = totalCount - reverseIndex; // 1 = Last place, totalCount = 1st place
            const actualRank = reverseIndex + 1; // 1 = Winner, 2 = 2nd place, etc.
            const isRevealed = placeFromBottom <= revealedCount;
            const isWinner = actualRank === 1;
            const isLastPlace = actualRank === totalCount;

            const heraldry = HERALDRY_COLORS.find(c => c.hex === player.color) || HERALDRY_COLORS[0];

            return (
              <AnimatePresence key={player.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className={`rounded-2xl p-4 border-2 shadow-2xl relative transition-all duration-500 overflow-hidden ${
                    !isRevealed
                      ? 'bg-[#3E2723]/60 border-[#D4AF37]/20 text-[#D4AF37]/50'
                      : isWinner
                        ? 'animate-unfurl bg-gradient-to-r from-[#D4AF37] via-[#FBC02D] to-[#D4AF37] border-white text-[#2C1810] ring-4 ring-[#D4AF37]/70 scale-105 shadow-[0_0_30px_rgba(212,175,55,0.8)]'
                        : isLastPlace
                          ? 'bg-[#1A0C08] border-red-900/60 text-red-200'
                          : 'bg-[#3E2723] border-[#D4AF37]/60 text-white'
                  }`}
                  style={isRevealed && !isWinner && !isLastPlace ? { backgroundColor: player.color } : {}}
                >
                  {/* Unrevealed Cover Seal */}
                  {!isRevealed ? (
                    <div className="flex items-center justify-between px-2 py-1">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-black/40 border border-[#D4AF37]/30 flex items-center justify-center font-cinzel font-bold text-sm">
                          #{actualRank}
                        </div>
                        <span className="font-cinzel text-sm italic">
                          Rank #{actualRank} Sealed Under Wax...
                        </span>
                      </div>
                      <Sparkles className="w-4 h-4 text-[#D4AF37]/40 animate-pulse" />
                    </div>
                  ) : (
                    /* Revealed Player Banner */
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 z-10">
                        {/* Rank Badge */}
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-extrabold font-cinzel text-lg shadow-lg border ${
                          isWinner 
                            ? 'bg-[#2C1810] text-[#D4AF37] border-[#D4AF37]' 
                            : isLastPlace 
                              ? 'bg-red-950 text-red-400 border-red-800' 
                              : 'bg-black/40 text-white border-white/40'
                        }`}>
                          {isWinner ? <Crown className="w-6 h-6 text-[#D4AF37]" /> : `#${actualRank}`}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className={`text-lg sm:text-xl font-bold font-cinzel drop-shadow ${
                              isWinner ? 'text-[#2C1810]' : 'text-white'
                            }`}>
                              {player.name}
                            </h3>
                            {isWinner && (
                              <span className="px-2 py-0.5 rounded-full bg-[#2C1810] text-[#D4AF37] text-[10px] font-extrabold font-cinzel uppercase shadow">
                                👑 Tournament Champion
                              </span>
                            )}
                            {isLastPlace && (
                              <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-300 text-[10px] font-extrabold font-cinzel uppercase border border-red-800">
                                💀 Last Place
                              </span>
                            )}
                          </div>
                          <span className={`text-xs font-cinzel uppercase block ${
                            isWinner ? 'text-[#2C1810]/80' : 'text-white/80'
                          }`}>
                            {heraldry.icon} {heraldry.name}
                          </span>
                        </div>
                      </div>

                      {/* Final Score */}
                      <div className="text-right z-10">
                        <span className={`text-[10px] uppercase font-cinzel block ${
                          isWinner ? 'text-[#2C1810]/70' : 'text-white/70'
                        }`}>
                          Final Score
                        </span>
                        <span className={`text-2xl sm:text-3xl font-extrabold font-cinzel drop-shadow ${
                          isWinner ? 'text-[#2C1810]' : 'text-white'
                        }`}>
                          {player.totalScore || 0} pts
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            );
          })}
        </div>

        {/* Expandable Match History Table Toggle */}
        {isAllRevealed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-2"
          >
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#3E2723] hover:bg-[#2A1810] text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-cinzel font-bold flex items-center justify-between transition-all shadow-md"
            >
              <div className="flex items-center gap-2">
                <Scroll className="w-4 h-4" />
                <span>{showHistory ? 'Hide Full Match Breakdown' : 'View Round-by-Round History'}</span>
              </div>
              {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Match History Table */}
            {showHistory && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="touch-scroll mt-3 parchment-bg rounded-xl p-4 border border-[#3E2723]/30 overflow-x-auto max-h-60 shadow-inner"
              >
                <table className="w-full text-xs font-cinzel text-[#2C1810]">
                  <thead>
                    <tr className="border-b border-[#3E2723]/30">
                      <th className="py-1 px-2 text-left">Round</th>
                      {players.map(p => (
                        <th key={p.id} className="py-1 px-2 text-center" style={{ color: p.color }}>
                          {p.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record, rIdx) => (
                      <tr key={rIdx} className="border-b border-[#3E2723]/10 hover:bg-black/5">
                        <td className="py-1.5 px-2 font-bold">R{record.roundNumber}</td>
                        {players.map(p => {
                          const bid = record.bids[p.id] !== undefined ? record.bids[p.id] : '-';
                          const actual = record.actuals[p.id] !== undefined ? record.actuals[p.id] : '-';
                          const score = record.scores[p.id] !== undefined ? record.scores[p.id] : 0;

                          return (
                            <td key={p.id} className="py-1.5 px-2 text-center">
                              <span className="font-semibold">{actual}/{bid}</span>
                              <span className={`block text-[10px] font-bold ${
                                score >= 0 ? 'text-emerald-800' : 'text-red-800'
                              }`}>
                                {score >= 0 ? `+${score}` : `${score}`}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Restart Tournament Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl z-10 my-2"
      >
        <button
          type="button"
          onClick={resetGame}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8B0000] via-[#5C0A0A] to-[#8B0000] text-[#F3E8D2] font-cinzel font-bold text-base sm:text-lg uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-[#D4AF37] hover:brightness-110 active:scale-95 shadow-2xl transition-all"
        >
          <RotateCcw className="w-5 h-5 text-[#D4AF37]" />
          <span>Return to Setup & Play Again</span>
        </button>
      </motion.div>
    </div>
  );
};
