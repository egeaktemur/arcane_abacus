import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HERALDRY_COLORS } from '../types/game';
import { Shield, Plus, Trash2, Check, AlertCircle } from 'lucide-react';

export const SetupScreen = ({ gameState, updatePlayer, addPlayer, removePlayer, startGame }) => {
  const { players } = gameState;
  const playerCount = players.length;

  // Set of selected color hexes to implement the Duplication Lock
  const selectedColorHexes = new Set(players.map(p => p.color));

  // Validation checks
  const emptyNames = players.some(p => !p.name.trim());
  const isValidCount = playerCount >= 3 && playerCount <= 6;
  const isFormValid = isValidCount && !emptyNames;

  return (
    <div className="h-full flex flex-col items-center justify-center p-3 sm:p-6 medieval-bg relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-gold)_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl h-full flex flex-col z-10"
      >
        {/* Medieval Header */}
        <div className="text-center mb-3 shrink-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-parchment gold-text-glow tracking-wide">
            Arcane Abacus
          </h1>
        </div>

        {/* Main Parchment Card */}
        <div className="parchment-bg pattern-lion rounded-2xl p-3 sm:p-5 medieval-border relative shadow-2xl flex-1 min-h-0 flex flex-col">
          {/* Player Input List: 6 fixed-height slots (card-height / 6) so rows never resize as players are added/removed */}
          <div
            className="flex-1 min-h-0 grid gap-1.5 sm:gap-2"
            style={{ gridTemplateRows: 'repeat(6, minmax(0, 1fr))' }}
          >
            <AnimatePresence>
              {players.map((player, index) => {
                return (
                  <motion.div
                    key={player.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-parchment-dim/60 border border-wood/20 shadow-sm flex flex-col justify-center gap-1.5"
                  >
                    {/* Row 1: index, name, delete */}
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 shrink-0 rounded-full bg-wood text-parchment text-sm flex items-center justify-center font-bold font-cinzel shadow-inner">
                        {index + 1}
                      </span>

                      <div className="relative flex-1 min-w-0">
                        <input
                          type="text"
                          value={player.name}
                          onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                          placeholder="Wizard Name..."
                          maxLength={16}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#FFFDF5] border border-wood/40 text-ink font-semibold text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent placeholder-wood/40 shadow-inner"
                        />
                        {!player.name.trim() && (
                          <AlertCircle className="w-4 h-4 text-crimson absolute right-3 top-2" />
                        )}
                      </div>

                      {playerCount > 3 && (
                        <button
                          type="button"
                          onClick={() => removePlayer(index)}
                          className="p-1.5 shrink-0 rounded-lg text-crimson hover:bg-crimson/10 transition-colors"
                          title="Remove Player"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* Row 2: color swatches (Duplication Lock Enforced) */}
                    <div className="flex items-center gap-2 pl-[38px]">
                      {HERALDRY_COLORS.map(colorOption => {
                        const isSelected = player.color === colorOption.hex;
                        const isTakenByOther = selectedColorHexes.has(colorOption.hex) && !isSelected;

                        return (
                          <button
                            key={colorOption.id}
                            type="button"
                            disabled={isTakenByOther}
                            onClick={() => updatePlayer(index, 'color', colorOption.hex)}
                            title={isTakenByOther ? `${colorOption.name} (Claimed)` : colorOption.name}
                            className={`flex-1 h-10 sm:h-11 rounded-lg flex items-center justify-center transition-all relative border ${
                              isSelected
                                ? 'ring-2 ring-ink ring-offset-1 scale-105 shadow-md border-white/60'
                                : isTakenByOther
                                  ? 'opacity-20 cursor-not-allowed grayscale border-transparent'
                                  : 'hover:scale-105 border-black/20 shadow-sm'
                            }`}
                            style={{ backgroundColor: colorOption.hex }}
                          >
                            {isSelected && (
                              <Check className="w-4 h-4 text-white" strokeWidth={3} />
                            )}
                          </button>
                        );
                      })}
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
              className="mt-2 w-full py-2 rounded-xl border-2 border-dashed border-wood/40 hover:border-crimson bg-[#FFFDF5]/40 hover:bg-[#FFFDF5] text-wood hover:text-crimson font-cinzel font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Wizard ({playerCount}/6)</span>
            </button>
          )}

          {/* Validation Notice */}
          {!isFormValid && (
            <div className="mt-2 p-2 rounded-lg bg-crimson/10 border border-crimson/30 text-crimson text-xs font-semibold flex items-center gap-2 shrink-0">
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
            className={`mt-3 w-full py-3 sm:py-4 rounded-xl font-cinzel font-bold text-base sm:text-lg tracking-wider uppercase flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shrink-0 ${
              isFormValid
                ? 'bg-gradient-to-r from-crimson via-crimson-dark to-crimson text-parchment hover:brightness-110 active:scale-[0.98] border border-gold/50'
                : 'bg-gray-400/50 text-gray-600 cursor-not-allowed border border-gray-400/20'
            }`}
          >
            <Shield className="w-5 h-5 text-gold" />
            <span>Begin Game</span>
          </button>
        </div>
      </motion.div>

      <p className="mt-2 text-center text-[9px] text-parchment/30 z-10">
        Heraldic icons by Lorc &amp; Delapouite, game-icons.net (CC BY 3.0)
      </p>
    </div>
  );
};
