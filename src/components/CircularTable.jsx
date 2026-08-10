import React from 'react';
import { motion } from 'framer-motion';
import { HERALDRY_COLORS, calculateRoundScore } from '../types/game';
import { Plus, Minus } from 'lucide-react';

export const CircularTable = ({
  players,
  bids = {},
  actuals = {},
  onIncrement,
  onDecrement,
}) => {
  const playerCount = players.length;

  return (
    <div className="relative w-full max-w-[440px] sm:max-w-[540px] aspect-square mx-auto flex items-center justify-center">
      {/* Circular Player Buttons */}
      {players.map((player, index) => {
        // Trigonometry calculation
        const angleDeg = (index * (360 / playerCount)) - 90;
        const angleRad = (angleDeg * Math.PI) / 180;

        // Radius for positioning
        const radiusPercent = 38;
        const xPercent = radiusPercent * Math.cos(angleRad);
        const yPercent = radiusPercent * Math.sin(angleRad);

        // Rotation of content element so text faces outward to player sitting at that side
        const rotationDeg = angleDeg + 90;

        const heraldry = HERALDRY_COLORS.find(c => c.hex === player.color) || HERALDRY_COLORS[0];
        const bid = bids[player.id] !== undefined ? bids[player.id] : 0;
        const actual = actuals[player.id] !== undefined ? actuals[player.id] : 0;

        const currentScoreDelta = calculateRoundScore(bid, actual);
        const isCurrentlyExact = actual === bid;

        return (
          <div
            key={player.id || index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20"
            style={{
              left: `calc(50% + ${xPercent}%)`,
              top: `calc(50% + ${yPercent}%)`,
            }}
          >
            {/* Rotated Button Unit */}
            <motion.div
              initial={{ scale: 0, rotate: rotationDeg }}
              animate={{ scale: 1, rotate: rotationDeg }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="flex flex-col items-center justify-center"
            >
              {/* Enlarged Circular Main Player Button */}
              <div 
                className={`w-34 sm:w-42 h-34 sm:h-42 rounded-full border-4 border-[#D4AF37] shadow-[0_10px_25px_rgba(0,0,0,0.6)] p-3 flex flex-col items-center justify-between text-white relative transition-all duration-300 ${
                  isCurrentlyExact ? 'ring-4 ring-emerald-500/90 scale-105 shadow-[0_0_30px_rgba(34,139,34,0.7)]' : 'hover:scale-102'
                }`}
                style={{ 
                  backgroundColor: player.color,
                }}
              >
                {/* Header: Heraldry Icon & Name */}
                <div className="text-center w-full truncate px-1">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-sm sm:text-base">{heraldry.icon}</span>
                    <span className="text-sm sm:text-base font-extrabold font-cinzel truncate drop-shadow-md">
                      {player.name}
                    </span>
                  </div>
                </div>

                {/* Center Stats Display: Bid vs Actual */}
                <div className="flex items-center justify-center gap-3 bg-black/40 w-full py-1.5 sm:py-2 rounded-xl border border-white/30 shadow-inner">
                  <div className="text-center">
                    <span className="text-[10px] sm:text-xs uppercase font-cinzel text-white/80 block leading-tight font-semibold">Bid</span>
                    <span className="text-base sm:text-lg font-black font-cinzel text-[#D4AF37]">{bid}</span>
                  </div>
                  <div className="h-6 w-[1.5px] bg-white/30" />
                  <div className="text-center">
                    <span className="text-[10px] sm:text-xs uppercase font-cinzel text-white/80 block leading-tight font-semibold">Actual</span>
                    <span className="text-lg sm:text-xl font-black font-cinzel text-white">{actual}</span>
                  </div>
                </div>

                {/* Footer: Potential Score Indicator */}
                <div className="text-center">
                  <span className={`text-xs sm:text-sm font-extrabold font-cinzel px-2.5 py-0.5 rounded-full shadow ${
                    isCurrentlyExact 
                      ? 'bg-emerald-900/95 text-emerald-200 border border-emerald-400/50' 
                      : 'bg-red-950/90 text-red-200 border border-red-500/50'
                  }`}>
                    {currentScoreDelta >= 0 ? `+${currentScoreDelta} pts` : `${currentScoreDelta} pts`}
                  </span>
                </div>

                {/* Tap to Increment Main Area Overlay */}
                <button
                  type="button"
                  onClick={() => onIncrement(player.id)}
                  className="absolute inset-0 rounded-full cursor-pointer opacity-0 hover:opacity-10 active:opacity-25 bg-white transition-opacity"
                  aria-label={`Increment tricks won for ${player.name}`}
                />
              </div>

              {/* Controls: Plus & Undo/Minus Buttons */}
              <div className="flex items-center gap-3 mt-2 z-30">
                <button
                  type="button"
                  onClick={() => onDecrement(player.id)}
                  disabled={actual <= 0}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#3E2723] text-[#F3E8D2] border-2 border-[#D4AF37]/60 flex items-center justify-center shadow-lg transition-all ${
                    actual <= 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 active:scale-95 text-red-300'
                  }`}
                  title="Undo / Decrement Trick"
                >
                  <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => onIncrement(player.id)}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-[#8B0000] to-[#5C0A0A] text-[#F3E8D2] border-2 border-[#D4AF37] flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 font-bold"
                  title="Tap to Add Won Trick"
                >
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
                </button>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};
