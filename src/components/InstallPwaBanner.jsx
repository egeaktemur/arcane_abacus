import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, X, Share, PlusSquare } from 'lucide-react';

export const InstallPwaBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) return;

    // Check if iOS Safari
    const ua = window.navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua);
    setIsIos(ios);

    // Show prompt banner once per session
    const dismissed = sessionStorage.getItem('pwa_prompt_dismissed');
    if (!dismissed) {
      setShowBanner(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto bg-[#3E2723] border-2 border-[#D4AF37] text-[#F3E8D2] rounded-2xl p-4 shadow-2xl backdrop-blur-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B0000] border border-[#D4AF37] flex items-center justify-center text-xl shrink-0 shadow">
              🔮
            </div>
            <div>
              <h4 className="font-bold text-sm font-cinzel text-[#D4AF37]">
                Add Arcane Abacus to Home Screen
              </h4>
              <p className="text-xs text-white/80 font-cinzel mt-0.5">
                {isIos 
                  ? 'Tap Share button below, then "Add to Home Screen" for full-screen tabletop play!' 
                  : 'Install this app to use offline at your game table!'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 rounded-lg text-[#D4AF37] hover:bg-black/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isIos && (
          <div className="mt-2.5 pt-2 border-t border-[#D4AF37]/30 flex items-center justify-center gap-3 text-[11px] font-cinzel text-[#D4AF37]/90">
            <span className="flex items-center gap-1">1. Tap <Share className="w-3.5 h-3.5 inline text-[#D4AF37]" /></span>
            <span>➔</span>
            <span className="flex items-center gap-1">2. Select <PlusSquare className="w-3.5 h-3.5 inline text-[#D4AF37]" /> Add to Home Screen</span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
