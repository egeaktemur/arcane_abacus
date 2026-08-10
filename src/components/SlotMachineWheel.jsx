import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Lock, AlertTriangle } from 'lucide-react';

export const SlotMachineWheel = ({
  value,
  onChange,
  maxVal,
  forbiddenVal,
  playerColor = '#8B0000',
}) => {
  const containerRef = useRef(null);

  // Generate array of numbers from 0 to maxVal (current round number)
  const numberOptions = Array.from({ length: maxVal + 1 }, (_, i) => i);

  const handleIncrement = () => {
    let next = value + 1;
    if (next > maxVal) next = 0;
    // Skip forbidden value if incrementing lands on it
    if (next === forbiddenVal) {
      next = (next + 1) <= maxVal ? next + 1 : 0;
      if (next === forbiddenVal) next = value; // fallback
    }
    onChange(next);
  };

  const handleDecrement = () => {
    let prev = value - 1;
    if (prev < 0) prev = maxVal;
    // Skip forbidden value if decrementing lands on it
    if (prev === forbiddenVal) {
      prev = (prev - 1) >= 0 ? prev - 1 : maxVal;
      if (prev === forbiddenVal) prev = value; // fallback
    }
    onChange(prev);
  };

  return (
    <div className="flex flex-col items-center justify-center select-none py-2">
      {/* Up Button */}
      <button
        type="button"
        onClick={handleIncrement}
        className="w-14 h-12 rounded-t-2xl bg-[#3E2723] hover:bg-[#2A1810] text-[#D4AF37] border-t-2 border-x-2 border-[#D4AF37]/50 flex items-center justify-center transition-all shadow-md active:scale-95 z-10"
        aria-label="Increase Bid"
      >
        <ChevronUp className="w-8 h-8" />
      </button>

      {/* Main Wheel Viewport Frame */}
      <div 
        ref={containerRef}
        className="w-48 sm:w-56 h-40 sm:h-48 parchment-bg border-4 border-[#3E2723] rounded-2xl relative shadow-2xl overflow-hidden flex items-center justify-center"
      >
        {/* Inner Gold Frame Border */}
        <div className="absolute inset-1 border-2 border-[#D4AF37]/60 rounded-xl pointer-events-none z-20" />
        
        {/* Central Selection Highlight Bar */}
        <div 
          className="absolute inset-x-0 h-16 sm:h-20 bg-[#3E2723]/10 border-y-2 border-[#8B0000] pointer-events-none z-10 flex items-center justify-between px-3"
          style={{ boxShadow: 'inset 0 0 15px rgba(62,39,35,0.2)' }}
        >
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
        </div>

        {/* Scrollable / Interactive Options Wheel List */}
        <div className="w-full flex flex-col items-center justify-center gap-2 py-4">
          {numberOptions.map((num) => {
            const isSelected = num === value;
            const isForbidden = num === forbiddenVal;

            return (
              <motion.button
                key={num}
                type="button"
                disabled={isForbidden}
                onClick={() => {
                  if (!isForbidden) onChange(num);
                }}
                whileHover={!isForbidden ? { scale: isSelected ? 1.05 : 1.02 } : {}}
                whileTap={!isForbidden ? { scale: 0.95 } : {}}
                className={`w-36 sm:w-44 py-1.5 sm:py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'scale-110 shadow-lg border-2 z-20 font-bold'
                    : isForbidden
                      ? 'opacity-40 cursor-not-allowed bg-red-950/20 text-red-900 border border-red-800/40'
                      : 'opacity-50 hover:opacity-90 hover:scale-100 text-[#2C1810]'
                }`}
                style={
                  isSelected && !isForbidden
                    ? {
                        backgroundColor: playerColor,
                        color: '#F3E8D2',
                        borderColor: '#D4AF37',
                        textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                      }
                    : {}
                }
              >
                {isForbidden && (
                  <Lock className="w-4 h-4 text-red-700 animate-bounce" />
                )}
                
                <span 
                  className={`font-cinzel tracking-wider text-2xl sm:text-3xl ${
                    isForbidden ? 'line-through text-red-900' : ''
                  }`}
                >
                  {num}
                </span>

                {isForbidden && (
                  <span className="text-[10px] uppercase font-bold font-cinzel text-red-800 bg-red-100/80 px-1.5 py-0.5 rounded border border-red-800/40">
                    Restricted
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Down Button */}
      <button
        type="button"
        onClick={handleDecrement}
        className="w-14 h-12 rounded-b-2xl bg-[#3E2723] hover:bg-[#2A1810] text-[#D4AF37] border-b-2 border-x-2 border-[#D4AF37]/50 flex items-center justify-center transition-all shadow-md active:scale-95 z-10"
        aria-label="Decrease Bid"
      >
        <ChevronDown className="w-8 h-8" />
      </button>

      {/* Restriction Rule Explanation Warning */}
      {forbiddenVal !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-cinzel flex items-center gap-2 max-w-xs text-center shadow-lg"
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
