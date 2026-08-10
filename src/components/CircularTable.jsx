import React from 'react';
import { motion } from 'framer-motion';
import { HERALDRY_COLORS, calculateRoundScore } from '../types/game';
import { Plus, Minus, Target, Trophy, Coins } from 'lucide-react';
import { HeraldryIcon } from './HeraldryIcon';

export const CircularTable = ({
  players,
  bids = {},
  actuals = {},
  onIncrement,
  onDecrement,
  centerContent,
}) => {
  const playerCount = players.length;

  // Circle diameter shrinks as more players share the ring, to avoid overlap
  const circleSizeClasses =
    playerCount >= 6
      ? 'w-32 h-32 sm:w-40 sm:h-40'
      : playerCount === 5
        ? 'w-36 h-36 sm:w-44 sm:h-44'
        : 'w-44 h-44 sm:w-52 sm:h-52';

  // +/- controls hug the heraldry icon tighter as more players share the ring,
  // so the tangential control group doesn't collide with a neighboring seat's controls
  const controlsGapClass = playerCount >= 6 ? 'gap-0' : playerCount >= 4 ? 'gap-0.5' : 'gap-1.5';
  const controlButtonSizeClasses = playerCount >= 4 ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-7 h-7 sm:w-8 sm:h-8';
  const incrementButtonSizeClasses = playerCount >= 4 ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-9 sm:h-9';
  const heraldrySize = playerCount >= 4 ? 32 : 40;

  return (
    <div className="relative w-full max-w-[520px] sm:max-w-[620px] aspect-square mx-auto flex items-center justify-center">
      {/* Center Content Slot (e.g. Round / Tricks Indicator) */}
      {centerContent && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto">{centerContent}</div>
        </div>
      )}

      {/* Circular Player Buttons */}
      {players.map((player, index) => {
        // Trigonometry calculation
        const angleDeg = (index * (360 / playerCount)) - 90;
        const angleRad = (angleDeg * Math.PI) / 180;

        // Radius for positioning — pushed close to the outer edge
        const radiusPercent = 42;
        const xPercent = radiusPercent * Math.cos(angleRad);
        const yPercent = radiusPercent * Math.sin(angleRad);

        // Rotation of content element so text faces outward to player sitting at that side
        const rotationDeg = angleDeg - 90;

        // Point on the circle's own edge facing the table's center, where the +/- controls sit
        const innerEdgePercent = 50;
        const innerX = 50 + innerEdgePercent * Math.cos(angleRad + Math.PI);
        const innerY = 50 + innerEdgePercent * Math.sin(angleRad + Math.PI);

        // Tangent rotation so the +/- pair sits orthogonal to the radius at every seat
        const tangentDeg = angleDeg + 90;

        const heraldry = HERALDRY_COLORS.find(c => c.hex === player.color) || HERALDRY_COLORS[0];
        const bid = bids[player.id] !== undefined ? bids[player.id] : 0;
        const actual = actuals[player.id] !== undefined ? actuals[player.id] : 0;

        const currentScoreDelta = calculateRoundScore(bid, actual);
        const isCurrentlyExact = actual === bid;

        return (
          <div
            key={player.id || index}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20 pointer-events-none ${circleSizeClasses}`}
            style={{
              left: `calc(50% + ${xPercent}%)`,
              top: `calc(50% + ${yPercent}%)`,
            }}
          >
            {/* Non-rotated wrapper so the +/- controls stay pinned to the visual top of the circle */}
            <div className="relative w-full h-full">
              {/* Rotated Card Unit */}
              <motion.div
                initial={{ scale: 0, rotate: rotationDeg }}
                animate={{ scale: 1, rotate: rotationDeg }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className={`w-full h-full rounded-full border-4 border-[#D4AF37] shadow-[0_10px_25px_rgba(0,0,0,0.6)] p-2 sm:p-2.5 flex flex-col items-center justify-center gap-1 text-white relative transition-all duration-300 ${
                  isCurrentlyExact ? 'ring-4 ring-emerald-500/90 shadow-[0_0_30px_rgba(34,139,34,0.7)]' : ''
                }`}
                style={{
                  backgroundColor: player.color,
                }}
              >
                {/* Header: Name */}
                <div className="text-center w-full truncate px-1 -mt-1.5 sm:-mt-2.5">
                  <span className="text-xl sm:text-3xl font-extrabold font-cinzel truncate drop-shadow-md">
                    {player.name}
                  </span>
                </div>

                {/* Stats Row: Bid, Actual, Points together */}
                <div className="flex items-center justify-center gap-1 sm:gap-2 bg-black/40 w-full px-0.5 py-1 sm:py-1.5 rounded-xl border border-white/30 shadow-inner overflow-hidden">
                  <div className="flex flex-col items-center gap-0.5 min-w-0" title="Bid">
                    <Target className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37]/80 shrink-0" />
                    <span className="text-2xl sm:text-3xl font-black font-cinzel text-[#D4AF37] leading-none text-center tabular-nums">{bid}</span>
                  </div>
                  <div className="h-6 sm:h-7 w-[1.5px] bg-white/30 shrink-0" />
                  <div className="flex flex-col items-center gap-0.5 min-w-0" title="Actual">
                    <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/80 shrink-0" />
                    <span className="text-2xl sm:text-3xl font-black font-cinzel text-white leading-none text-center tabular-nums">{actual}</span>
                  </div>
                  <div className="h-6 sm:h-7 w-[1.5px] bg-white/30 shrink-0" />
                  <div className="flex flex-col items-center gap-0.5 min-w-0" title="Points">
                    <Coins className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${isCurrentlyExact ? 'text-emerald-300' : 'text-red-300'}`} />
                    <span className={`text-2xl sm:text-3xl font-black font-cinzel leading-none text-center tabular-nums ${
                      isCurrentlyExact ? 'text-emerald-300' : 'text-red-300'
                    }`}>
                      {currentScoreDelta >= 0 ? `+${currentScoreDelta}` : currentScoreDelta}
                    </span>
                  </div>
                </div>

                {/* Tap to Increment Main Area Overlay */}
                <button
                  type="button"
                  onClick={() => onIncrement(player.id)}
                  className="absolute inset-0 rounded-full cursor-pointer opacity-0 hover:opacity-10 active:opacity-25 bg-white transition-opacity pointer-events-auto"
                  style={{ clipPath: 'circle(50%)' }}
                  aria-label={`Increment tricks won for ${player.name}`}
                />
              </motion.div>

              {/* +/- controls, anchored on the circle's edge facing the table center, orthogonal to the radius */}
              <div
                className={`absolute flex items-center ${controlsGapClass} z-30`}
                style={{
                  left: `${innerX}%`,
                  top: `${innerY}%`,
                  transform: `translate(-50%, -50%) rotate(${tangentDeg}deg)`,
                }}
              >
                <button
                  type="button"
                  onClick={() => onIncrement(player.id)}
                  className={`${incrementButtonSizeClasses} rounded-full bg-gradient-to-r from-[#8B0000] to-[#5C0A0A] text-[#F3E8D2] border-2 border-[#D4AF37] flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 font-bold shrink-0 pointer-events-auto`}
                  style={{ clipPath: 'circle(50%)' }}
                  title="Tap to Add Won Trick"
                >
                  <Plus
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]"
                    style={{ transform: `rotate(${-tangentDeg}deg)` }}
                  />
                </button>

                {/* Heraldry Icon, between the two controls — matches the card's own outward-facing orientation */}
                <HeraldryIcon
                  id={heraldry.id}
                  color={player.color}
                  size={heraldrySize}
                  style={{ transform: `rotate(${rotationDeg - tangentDeg}deg)` }}
                />

                <button
                  type="button"
                  onClick={() => onDecrement(player.id)}
                  disabled={actual <= 0}
                  className={`${controlButtonSizeClasses} rounded-full bg-[#3E2723] text-[#F3E8D2] border-2 border-[#D4AF37]/60 flex items-center justify-center shadow-lg transition-all shrink-0 pointer-events-auto ${
                    actual <= 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 active:scale-95 text-red-300'
                  }`}
                  style={{ clipPath: 'circle(50%)' }}
                  title="Undo / Decrement Trick"
                >
                  <Minus
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    style={{ transform: `rotate(${-tangentDeg}deg)` }}
                  />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
