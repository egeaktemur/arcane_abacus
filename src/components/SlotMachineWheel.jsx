import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, AlertTriangle, MoveVertical } from 'lucide-react';

export const SlotMachineWheel = ({
  value,
  onChange,
  maxVal,
  forbiddenVal,
  playerColor = '#8B0000',
}) => {
  const containerRef = useRef(null);
  const [accumulatedDelta, setAccumulatedDelta] = useState(0);

  // Generate array of numbers from 0 to maxVal (current round number)
  const numberOptions = Array.from({ length: maxVal + 1 }, (_, i) => i);

  const handleIncrement = () => {
    let next = value + 1;
    if (next > maxVal) next = 0;
    if (next === forbiddenVal) {
      next = (next + 1) <= maxVal ? next + 1 : 0;
      if (next === forbiddenVal) next = value;
    }
    onChange(next);
  };

  const handleDecrement = () => {
    let prev = value - 1;
    if (prev < 0) prev = maxVal;
    if (prev === forbiddenVal) {
      prev = (prev - 1) >= 0 ? prev - 1 : maxVal;
      if (prev === forbiddenVal) prev = value;
    }
    onChange(prev);
  };

  // Handle Desktop Mouse Wheel Scrolling
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY > 10) {
      handleDecrement();
    } else if (e.deltaY < -10) {
      handleIncrement();
    }
  };

  // Handle Touch Pan / Drag Gesture on 3D Drum
  const handlePan = (event, info) => {
    const threshold = 20; // Sensitivity threshold for step change
    const currentDelta = accumulatedDelta + info.delta.y;

    if (currentDelta < -threshold) {
      handleIncrement();
      setAccumulatedDelta(0);
    } else if (currentDelta > threshold) {
      handleDecrement();
      setAccumulatedDelta(0);
    } else {
      setAccumulatedDelta(currentDelta);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center select-none py-2">
      {/* 3D Raffle Drum / Cylinder Viewport Frame (No Arrow Buttons) */}
      <div 
        ref={containerRef}
        onWheel={handleWheel}
        className="w-60 sm:w-72 h-56 sm:h-64 parchment-bg border-4 border-[#3E2723] rounded-3xl relative shadow-[0_20px_40px_rgba(0,0,0,0.85)] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          perspective: '850px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* Brass Raffle Drum Side Rivets & Mechanical Detailing */}
        <div className="absolute left-2.5 inset-y-0 w-3.5 flex flex-col justify-around py-4 z-30 pointer-events-none">
          <div className="w-3 h-3 rounded-full bg-[#D4AF37] border border-black/70 shadow-inner" />
          <div className="w-3 h-3 rounded-full bg-[#D4AF37] border border-black/70 shadow-inner" />
          <div className="w-3 h-3 rounded-full bg-[#D4AF37] border border-black/70 shadow-inner" />
          <div className="w-3 h-3 rounded-full bg-[#D4AF37] border border-black/70 shadow-inner" />
        </div>
        <div className="absolute right-2.5 inset-y-0 w-3.5 flex flex-col justify-around py-4 z-30 pointer-events-none">
          <div className="w-3 h-3 rounded-full bg-[#D4AF37] border border-black/70 shadow-inner" />
          <div className="w-3 h-3 rounded-full bg-[#D4AF37] border border-black/70 shadow-inner" />
          <div className="w-3 h-3 rounded-full bg-[#D4AF37] border border-black/70 shadow-inner" />
          <div className="w-3 h-3 rounded-full bg-[#D4AF37] border border-black/70 shadow-inner" />
        </div>

        {/* 3D Cylindrical Lighting Overlay (Top & Bottom Curve Shadows) */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#1A0C08]/95 via-[#2A1810]/70 to-transparent z-20 pointer-events-none flex items-start justify-center pt-2">
          <span className="text-[10px] uppercase font-cinzel tracking-widest text-[#D4AF37]/60 flex items-center gap-1">
            <MoveVertical className="w-3 h-3" /> Swipe / Scroll
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#1A0C08]/95 via-[#2A1810]/70 to-transparent z-20 pointer-events-none" />

        {/* Outer Metallic Gold Frame Rim */}
        <div className="absolute inset-2 border-2 border-[#D4AF37]/70 rounded-2xl pointer-events-none z-20" />

        {/* Central 3D Selection Lens Highlight */}
        <div 
          className="absolute inset-x-4 h-18 sm:h-22 bg-[#3E2723]/20 border-y-2 border-[#D4AF37] pointer-events-none z-20 flex items-center justify-between px-3 rounded-xl shadow-[inset_0_0_20px_rgba(212,175,55,0.35)]"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]" />
        </div>

        {/* Interactive 3D Raffle Cylinder Stage */}
        <motion.div 
          onPan={handlePan}
          className="w-full h-full relative flex items-center justify-center touch-none select-none"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {numberOptions.map((num) => {
            const offset = num - value;
            const isSelected = num === value;
            const isForbidden = num === forbiddenVal;

            // Render numbers within range of 3 steps
            if (Math.abs(offset) > 3) return null;

            // 3D Cylinder Math
            const rotateXDeg = -offset * 30; // Curved rotation around drum axis
            const translateZPx = 115 - Math.abs(offset) * 22; // 3D depth extrusion
            const translateYPx = offset * 50; // Vertical position along curve
            const scale = Math.max(0.65, 1 - Math.abs(offset) * 0.15);
            const opacity = Math.max(0.2, 1 - Math.abs(offset) * 0.35);

            return (
              <motion.div
                key={num}
                onClick={() => {
                  if (!isForbidden) onChange(num);
                }}
                animate={{
                  rotateX: rotateXDeg,
                  translateZ: translateZPx,
                  translateY: translateYPx,
                  scale: scale,
                  opacity: opacity,
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                className={`absolute w-48 sm:w-56 py-2.5 rounded-2xl flex items-center justify-center gap-2 border-2 transition-colors cursor-pointer ${
                  isSelected
                    ? 'z-30 shadow-[0_12px_30px_rgba(0,0,0,0.7)] font-extrabold border-[#D4AF37]'
                    : isForbidden
                      ? 'bg-red-950/40 text-red-900 border-red-800/40 cursor-not-allowed'
                      : 'bg-[#E5D3B3]/80 text-[#2C1810] border-[#3E2723]/30 hover:bg-[#F3E8D2]'
                }`}
                style={
                  isSelected && !isForbidden
                    ? {
                        backgroundColor: playerColor,
                        color: '#F3E8D2',
                        boxShadow: `0 0 25px ${playerColor}90, inset 0 0 12px rgba(255,255,255,0.35)`,
                      }
                    : {}
                }
              >
                {isForbidden && (
                  <Lock className="w-5 h-5 text-red-600 animate-pulse" />
                )}

                <span 
                  className={`font-cinzel tracking-wider text-3xl sm:text-4xl ${
                    isForbidden ? 'line-through text-red-800' : ''
                  }`}
                  style={{
                    textShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.8)' : 'none',
                  }}
                >
                  {num}
                </span>

                {isForbidden && (
                  <span className="text-[10px] uppercase font-extrabold font-cinzel text-red-200 bg-red-950 px-2 py-0.5 rounded border border-red-700 shadow">
                    Forbidden
                  </span>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Restriction Rule Explanation Warning */}
      {forbiddenVal !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 px-3 py-1.5 rounded-xl bg-red-950/90 border border-red-500/50 text-red-200 text-xs font-cinzel flex items-center gap-2 max-w-xs text-center shadow-xl"
        >
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>
            <strong>Wizard Restriction:</strong> You cannot bid <strong>{forbiddenVal}</strong> (Total bids must not equal {maxVal}).
          </span>
        </motion.div>
      )}
    </div>
  );
};
