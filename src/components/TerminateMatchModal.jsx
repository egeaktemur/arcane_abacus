import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, ShieldAlert } from 'lucide-react';

export const TerminateMatchModal = ({ isOpen, onCancel, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="parchment-bg rounded-2xl p-6 medieval-border shadow-2xl max-w-sm w-full text-center"
          >
            <ShieldAlert className="w-10 h-10 text-[#8B0000] mx-auto mb-3" />
            <h2 className="text-xl font-bold font-cinzel text-[#2C1810] mb-2">
              Abandon Current Match?
            </h2>
            <p className="text-sm font-cinzel text-[#3E2723]/90 mb-6 leading-relaxed">
              This will permanently reset all player scores and the current round's bids. This action cannot be undone.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={onCancel}
                className="w-full py-3 rounded-xl bg-[#3E2723] hover:bg-[#2A1810] text-[#F3E8D2] border border-[#D4AF37]/50 font-cinzel font-bold text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95"
              >
                Resume Gameplay
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B0000] via-[#5C0A0A] to-[#8B0000] text-[#F3E8D2] hover:brightness-110 border border-[#D4AF37]/60 font-cinzel font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
              >
                <XCircle className="w-4 h-4 text-[#D4AF37]" />
                Terminate & Start New Game
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
