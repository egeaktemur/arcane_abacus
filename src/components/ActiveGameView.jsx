import React from 'react';
import { motion } from 'framer-motion';
import { HERALDRY_COLORS } from '../types/game';
import { RotateCcw, Shield, Award, Users, BookOpen } from 'lucide-react';

export const ActiveGameView = ({ gameState, resetGame }) => {
  const { players, currentRound, maxRounds } = gameState;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#2A1810] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl z-10"
      >
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-[#F3E8D2] gold-text-glow font-fraktur mb-1">
            The Battle Begins!
          </h1>
          <p className="text-sm font-cinzel text-[#D4AF37]">
            Phase 1 Core Logic & Storage Active
          </p>
        </div>

        <div className="parchment-bg rounded-2xl p-6 sm:p-8 medieval-border shadow-2xl relative">
          <div className="flex items-center justify-between border-b-2 border-[#3E2723]/30 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#8B0000]" />
              <span className="font-cinzel font-bold text-lg text-[#2C1810]">
                Round {currentRound} of {maxRounds}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-[#3E2723] text-[#D4AF37] px-3 py-1 rounded-full text-xs font-cinzel font-bold shadow-inner">
              <Users className="w-3.5 h-3.5" />
              <span>{players.length} Wizards</span>
            </div>
          </div>

          {/* Player Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {players.map((player, idx) => {
              const heraldry = HERALDRY_COLORS.find(c => c.hex === player.color) || HERALDRY_COLORS[0];

              return (
                <div 
                  key={player.id || idx}
                  className="p-3.5 rounded-xl border border-black/20 text-white shadow-lg flex items-center justify-between"
                  style={{ backgroundColor: player.color }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{heraldry.icon}</span>
                    <div>
                      <h3 className="font-bold text-sm leading-tight drop-shadow">{player.name}</h3>
                      <span className="text-[10px] uppercase font-cinzel text-white/80">{heraldry.name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-cinzel block text-white/70">Score</span>
                    <span className="font-bold text-base font-cinzel">{player.totalScore || 0} pts</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-[#E5D3B3]/80 border border-[#3E2723]/20 mb-6 text-xs text-[#3E2723] font-cinzel leading-relaxed">
            <div className="flex items-center gap-2 font-bold mb-1 text-[#8B0000]">
              <Shield className="w-4 h-4" />
              <span>State Persistence Verified</span>
            </div>
            All player data & heraldry assignments are automatically synchronized with browser <code className="bg-[#FFFDF5] px-1 py-0.5 rounded font-mono text-[11px]">localStorage</code>.
          </div>

          {/* Reset Action Button */}
          <button
            type="button"
            onClick={resetGame}
            className="w-full py-3.5 rounded-xl bg-[#3E2723] hover:bg-[#2A1810] text-[#F3E8D2] border border-[#D4AF37]/50 font-cinzel font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-[#D4AF37]" />
            <span>Return to Setup & Edit Roster</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
