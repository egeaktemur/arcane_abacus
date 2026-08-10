import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HERALDRY_COLORS, calculateMaxRounds } from '../types/game';
import { Shield, Plus, Trash2, Scroll, Sparkles, Check, AlertCircle } from 'lucide-react';

export const SetupScreen = ({ gameState, updatePlayer, addPlayer, removePlayer, startGame }) => {
  const { players } = gameState;
  const playerCount = players.length;
  const maxRounds = calculateMaxRounds(playerCount);

  // Set of selected color hexes to implement the Duplication Lock
  const selectedColorHexes = new Set(players.map(p => p.color));

  // Validation checks
  const emptyNames = players.some(p => !p.name.trim());
  const isValidCount = playerCount >= 3 && playerCount <= 6;
  const isFormValid = isValidCount && !emptyNames;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#2A1810] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl z-10"
      >
        {/* Medieval Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-2 px-4 py-1 rounded-full bg-[#3E2723]/80 border border-[#D4AF37]/40 shadow-inner">
            <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            <span className="text-xs font-cinzel tracking-widest text-[#D4AF37] uppercase">Wizard Companion App</span>
            <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#F3E8D2] gold-text-glow tracking-wide mb-1">
            Arcane Abacus
          </h1>
          <p className="text-sm sm:text-base text-[#D4AF37]/90 font-cinzel italic">
            Gather your company & choose your Heraldry
          </p>
        </div>

        {/* Main Parchment Card */}
        <div className="parchment-bg rounded-2xl p-6 sm:p-8 medieval-border relative shadow-2xl">
          {/* Top Decorative Banner */}
          <div className="flex items-center justify-between border-b-2 border-[#3E2723]/30 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Scroll className="w-5 h-5 text-[#8B0000]" />
              <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-[#2C1810]">
                Player Roster ({playerCount}/6)
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-cinzel text-[#3E2723]/70 uppercase block">Total Rounds</span>
              <span className="text-lg font-bold text-[#8B0000] font-cinzel">{maxRounds} Rounds</span>
            </div>
          </div>

          {/* Player Input List */}
          <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto pr-1">
            <AnimatePresence>
              {players.map((player, index) => {
                const activeColor = HERALDRY_COLORS.find(c => c.hex === player.color) || HERALDRY_COLORS[0];

                return (
                  <motion.div
                    key={player.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="p-3 sm:p-4 rounded-xl bg-[#E5D3B3]/60 border border-[#3E2723]/20 shadow-sm flex flex-col gap-3"
                  >
                    {/* Top line: Player Label & Delete button */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#3E2723] text-[#F3E8D2] text-xs flex items-center justify-center font-bold font-cinzel shadow-inner">
                          {index + 1}
                        </span>
                        <span className="text-xs font-cinzel font-semibold text-[#3E2723]/80 uppercase">
                          Wizard {index + 1}
                        </span>
                      </div>

                      {playerCount > 3 && (
                        <button
                          type="button"
                          onClick={() => removePlayer(index)}
                          className="p-1.5 rounded-lg text-[#8B0000] hover:bg-[#8B0000]/10 transition-colors"
                          title="Remove Player"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Name Input & Selected Heraldry Badge */}
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={player.name}
                          onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                          placeholder={`Enter Wizard Name...`}
                          maxLength={16}
                          className="w-full px-3 py-2.5 rounded-lg bg-[#FFFDF5] border border-[#3E2723]/40 text-[#2C1810] font-semibold text-base focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent placeholder-[#3E2723]/40 shadow-inner"
                        />
                        {!player.name.trim() && (
                          <AlertCircle className="w-4 h-4 text-[#8B0000] absolute right-3 top-3" />
                        )}
                      </div>

                      {/* Active Color Preview Badge */}
                      <div 
                        className="px-3 py-2 rounded-lg text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all duration-300 min-w-[100px] justify-center"
                        style={{ backgroundColor: activeColor.hex }}
                      >
                        <span>{activeColor.icon}</span>
                        <span className="truncate">{activeColor.name}</span>
                      </div>
                    </div>

                    {/* Color Selector Bar (Duplication Lock Enforced) */}
                    <div>
                      <div className="text-[11px] font-cinzel text-[#3E2723]/70 mb-1.5 font-semibold">
                        Choose Heraldry Color:
                      </div>
                      <div className="grid grid-cols-6 gap-2">
                        {HERALDRY_COLORS.map(colorOption => {
                          const isSelected = player.color === colorOption.hex;
                          // Duplication Lock: Color is disabled if selected by ANOTHER player
                          const isTakenByOther = selectedColorHexes.has(colorOption.hex) && !isSelected;

                          return (
                            <button
                              key={colorOption.id}
                              type="button"
                              disabled={isTakenByOther}
                              onClick={() => updatePlayer(index, 'color', colorOption.hex)}
                              title={isTakenByOther ? `${colorOption.name} (Claimed by another player)` : colorOption.name}
                              className={`h-9 rounded-lg flex items-center justify-center transition-all relative border ${
                                isSelected 
                                  ? 'ring-2 ring-[#2C1810] ring-offset-1 scale-105 shadow-md border-white/60' 
                                  : isTakenByOther 
                                    ? 'opacity-20 cursor-not-allowed grayscale border-transparent' 
                                    : 'hover:scale-105 border-black/20 shadow-sm'
                              }`}
                              style={{ backgroundColor: colorOption.hex }}
                            >
                              <span className="text-sm">{colorOption.icon}</span>
                              {isSelected && (
                                <span className="absolute -top-1 -right-1 bg-[#2C1810] text-[#D4AF37] p-0.5 rounded-full shadow">
                                  <Check className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Add Player Control */}
          {playerCount < 6 && (
            <button
              type="button"
              onClick={addPlayer}
              className="w-full py-3 rounded-xl border-2 border-dashed border-[#3E2723]/40 hover:border-[#8B0000] bg-[#FFFDF5]/40 hover:bg-[#FFFDF5] text-[#3E2723] hover:text-[#8B0000] font-cinzel font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm mb-6"
            >
              <Plus className="w-4 h-4" />
              <span>Add Wizard ({playerCount}/6)</span>
            </button>
          )}

          {/* Validation Notice */}
          {!isFormValid && (
            <div className="mb-4 p-3 rounded-lg bg-[#8B0000]/10 border border-[#8B0000]/30 text-[#8B0000] text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {playerCount < 3 
                  ? 'Minimum 3 players required for Wizard.' 
                  : 'Please enter names for all players before commencing.'}
              </span>
            </div>
          )}

          {/* Begin Game Action Button */}
          <button
            type="button"
            disabled={!isFormValid}
            onClick={startGame}
            className={`w-full py-4 rounded-xl font-cinzel font-bold text-lg tracking-wider uppercase flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
              isFormValid
                ? 'bg-gradient-to-r from-[#8B0000] via-[#5C0A0A] to-[#8B0000] text-[#F3E8D2] hover:brightness-110 active:scale-[0.98] border border-[#D4AF37]/50'
                : 'bg-gray-400/50 text-gray-600 cursor-not-allowed border border-gray-400/20'
            }`}
          >
            <Shield className="w-5 h-5 text-[#D4AF37]" />
            <span>Seal & Begin Game</span>
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-xs font-cinzel text-[#D4AF37]/70">
          Medieval Card Game Companion • Rules: 3-6 Players • Auto-saves to local storage
        </div>
      </motion.div>
    </div>
  );
};
