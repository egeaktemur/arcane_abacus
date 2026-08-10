import React from 'react';
import { motion } from 'framer-motion';
import { HERALDRY_COLORS, calculateRoundScore } from '../types/game';
import { Plus, Minus, CheckCircle, ShieldAlert } from 'lucide-react';

export const CircularTable = ({
  players,
  bids = {},
  actuals = {},
  onIncrement,
  onDecrement,
}) => {
  const playerCount = players.length;

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-square mx-auto flex items-center justify-center">
      {/* Center Table Compass / Seal */}
      <div className="w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-[#3E2723] border-4 border-[#D4AF37] shadow-2xl flex flex-col items-center justify-center z-10 text-center p-2">
        <div className="w-full h-full rounded-full border border-[#D4AF37]/40 flex flex-col items-center justify-center parchment-bg shadow-inner">
          <span className="text-xl sm:text-2xl">🔮</span>
          <span className="text-[10px] sm:text-xs font-bold font-cinzel text-[#2C1810] uppercase tracking-wider">
            Round Table
          </span>
          <span className="text-[9px] font-cinzel text-[#8B0000] font-semibold">
            {playerCount} Wizards
          </span>
        </div>
      </div>

      {/* Circular Player Buttons */}
      {players.map((player, index) => {
        // Trigonometry calculation
        // Angle in radians: angleRad = (index * (360 / playerCount) - 90) * (PI / 180)
        const angleDeg = (index * (360 / playerCount)) - 90;
        const angleRad = (angleDeg * Math.PI) / 180;

        // Radius for positioning (50% is center, offset by radius)
        // Responsive radius: ~38% of container size
        const radiusPercent = 38;
        const xPercent = radiusPercent * Math.cos(angleRad);
        const yPercent = radiusPercent * Math.sin(angleRad);

        // Rotation of content element so text faces outward to player sitting at that side
        const rotationDeg = angleDeg + 90;

        const heraldry = HERALDRY_COLORS.find(c => c.hex === player.color) || HERALDRY_COLORS[0];
        const bid = bids[player.id] !== undefined ? bids[player.id] : 0;
        const actual = actuals[player.id] !== undefined ? actuals[player.id] : 0;

        // Potential Win/Loss score preview
        const winPoints = calculateRoundScore(bid, bid); // if actual == bid
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
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex flex-col items-center justify-center"
            >
              {/* Circular Main Player Button */}
              <div 
                className={`w-28 sm:w-32 h-28 sm:h-32 rounded-full border-3 border-[#D4AF37] shadow-xl p-2 flex flex-col items-center justify-between text-white relative transition-all duration-300 ${
                  isCurrentlyExact ? 'ring-4 ring-emerald-500/80 scale-105' : 'hover:scale-102'
                }`}
                style={{ 
                  backgroundColor: player.color,
                  boxShadow: isCurrentlyExact 
                    ? '0 0 20px rgba(34,139,34,0.6)' 
                    : '0 8px 20px rgba(0,0,0,0.5)',
                }}
              >
                {/* Header: Heraldry Icon & Name */}
                <div className="text-center w-full truncate px-1">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xs">{heraldry.icon}</span>
                    <span className="text-xs font-bold font-cinzel truncate drop-shadow">
                      {player.name}
                    </span>
                  </div>
                </div>

                {/* Center Stats Display: Bid vs Actual */}
                <div className="flex items-center justify-center gap-2 bg-black/30 w-full py-1 rounded-lg border border-white/20">
                  <div className="text-center">
                    <span className="text-[9px] uppercase font-cinzel text-white/70 block leading-tight">Bid</span>
                    <span className="text-sm font-extrabold font-cinzel text-[#D4AF37]">{bid}</span>
                  </div>
                  <div className="h-5 w-[1px] bg-white/20" />
                  <div className="text-center">
                    <span className="text-[9px] uppercase font-cinzel text-white/70 block leading-tight">Actual</span>
                    <span className="text-base font-extrabold font-cinzel text-white">{actual}</span>
                  </div>
                </div>

                {/* Footer: Potential Score Indicator */}
                <div className="text-center">
                  <span className={`text-[10px] font-bold font-cinzel px-2 py-0.5 rounded-full ${
                    isCurrentlyExact 
                      ? 'bg-emerald-900/90 text-emerald-200 border border-emerald-400/40' 
                      : 'bg-red-950/80 text-red-200 border border-red-500/40'
                  }`}>
                    {currentScoreDelta >= 0 ? `+${currentScoreDelta} pts` : `${currentScoreDelta} pts`}
                  </span>
                </div>

                {/* Tap to Increment Main Area Overlay */}
                <button
                  type="button"
                  onClick={() => onIncrement(player.id)}
                  className="absolute inset-0 rounded-full cursor-pointer opacity-0 hover:opacity-10 active:opacity-20 bg-white transition-opacity"
                  aria-label={`Increment tricks won for ${player.name}`}
                />
              </div>

              {/* Controls: Plus & Undo/Minus Buttons below/near button */}
              <div className="flex items-center gap-2 mt-1.5 z-30">
                <button
                  type="button"
                  onClick={() => onDecrement(player.id)}
                  disabled={actual <= 0}
                  className={`w-7 h-7 rounded-full bg-[#3E2723] text-[#F3E8D2] border border-[#D4AF37]/50 flex items-center justify-center shadow transition-all ${
                    actual <= 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 active:scale-95 text-red-300'
                  }`}
                  title="Undo / Decrement Trick"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onIncrement(player.id)}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8B0000] to-[#5C0A0A] text-[#F3E8D2] border border-[#D4AF37] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 font-bold"
                  title="Tap to Add Won Trick"
                >
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                </button>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};
