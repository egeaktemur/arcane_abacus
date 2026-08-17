import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  HERALDRY_COLORS,
  getBiddingOrder,
  calculateForbiddenBid
} from '../types/game';
import { SlotMachineWheel } from './SlotMachineWheel';
import { TerminateMatchModal } from './TerminateMatchModal';
import { HeraldryIcon } from './HeraldryIcon';
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Scroll,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export const BiddingScreen = ({
  gameState,
  setBid,
  nextBidder,
  prevBidder,
  setBidStep,
  finalizeBids,
  resetGame,
}) => {
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const { players, currentRound, maxRounds, roundData } = gameState;
  const playerCount = players.length;
  const { currentBidStep = 0, bids = {} } = roundData;

  // Calculate turn sequence for this round
  const biddingOrder = getBiddingOrder(currentRound, playerCount);
  const currentPlayerIndex = biddingOrder[currentBidStep];
  const currentWizard = players[currentPlayerIndex];

  // Heraldry color for current wizard
  const wizardColor = HERALDRY_COLORS.find(c => c.hex === currentWizard.color) || HERALDRY_COLORS[0];

  // Forbidden bid calculation for last bidder
  const forbiddenBid = calculateForbiddenBid(
    currentRound,
    bids,
    players,
    biddingOrder,
    currentBidStep
  );

  // Current selected bid (default to 0 or existing bid)
  const currentBidVal = bids[currentWizard.id] !== undefined ? bids[currentWizard.id] : 0;

  // Auto-initialize bid for current player if undefined
  useEffect(() => {
    if (bids[currentWizard.id] === undefined) {
      let defaultVal = 0;
      if (defaultVal === forbiddenBid) {
        defaultVal = 1 <= currentRound ? 1 : 0;
      }
      setBid(currentWizard.id, defaultVal);
    }
  }, [currentWizard.id, bids, forbiddenBid, currentRound, setBid]);

  // Is this the last player in the round sequence?
  const isLastBidder = currentBidStep === biddingOrder.length - 1;
  const isFirstBidder = currentBidStep === 0;

  const handleConfirmBid = () => {
    // Ensure bid is not forbidden
    if (currentBidVal === forbiddenBid) return;

    if (isLastBidder) {
      finalizeBids();
    } else {
      nextBidder();
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-between p-4 sm:p-6 medieval-bg relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-gold)_1px,transparent_1px)] [background-size:24px_24px] [background-position:center] opacity-10 pointer-events-none" />

      {/* Header Info Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg z-10"
      >
        <div className="flex items-center justify-between bg-wood/90 border border-gold/40 rounded-xl px-4 py-2.5 shadow-lg">
          <div className="flex items-center gap-2">
            <Scroll className="w-5 h-5 text-gold" />
            <div>
              <span className="text-xs font-cinzel text-gold/80 uppercase block">Phase II</span>
              <span className="text-sm sm:text-base font-bold font-cinzel text-parchment">
                Round {currentRound} of {maxRounds}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowTerminateModal(true)}
              title="Terminate Match"
              className="w-9 h-9 rounded-lg bg-wood-dark border border-gold/50 flex items-center justify-center text-gold hover:bg-crimson/40 transition-all active:scale-95 shrink-0"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      <TerminateMatchModal
        isOpen={showTerminateModal}
        onCancel={() => setShowTerminateModal(false)}
        onConfirm={() => {
          setShowTerminateModal(false);
          resetGame();
        }}
      />

      {/* Main Bidding Card */}
      <motion.div 
        key={currentWizard.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg my-auto z-10"
      >
        <div className="parchment-bg pattern-dragon rounded-3xl p-5 sm:p-7 medieval-border shadow-2xl relative">
          {/* Active Wizard Banner (Colored in Heraldry Color) */}
          <div 
            className="rounded-2xl p-4 mb-6 shadow-xl border-2 border-gold/70 flex items-center justify-between text-white relative overflow-hidden"
            style={{ backgroundColor: currentWizard.color }}
          >
            {/* Background Glow */}
            <div className="absolute -right-6 -bottom-6 opacity-20">
              <HeraldryIcon id={wizardColor.id} color="#FFFFFF" size={96} bare />
            </div>

            <div className="flex items-center gap-3 z-10">
              <HeraldryIcon id={wizardColor.id} color={wizardColor.hex} size={44} />
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xl sm:text-2xl font-bold font-cinzel drop-shadow-md">
                    {currentWizard.name}
                  </h2>
                  {currentBidStep === 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-gold text-ink text-[10px] font-extrabold font-cinzel flex items-center gap-1 shadow">
                      <Crown className="w-3 h-3 fill-current" /> Lead
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Slot Machine 3D Number Wheel Selector */}
          <div className="my-2">
            <SlotMachineWheel
              value={currentBidVal}
              onChange={(newVal) => setBid(currentWizard.id, newVal)}
              maxVal={currentRound}
              forbiddenVal={forbiddenBid}
              playerColor={currentWizard.color}
            />
          </div>

          {/* Perfectly Centered Action Controls Container */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 mt-6">
            {/* Left Slot: Previous Bidder Button */}
            <button
              type="button"
              disabled={isFirstBidder}
              onClick={prevBidder}
              className={`w-12 h-12 rounded-xl border font-cinzel flex items-center justify-center transition-all ${
                isFirstBidder
                  ? 'opacity-30 cursor-not-allowed bg-gray-200 border-gray-400 text-gray-500'
                  : 'bg-wood hover:bg-wood-dark text-parchment border-gold/50 shadow-md active:scale-95'
              }`}
              title="Previous Wizard Bid"
            >
              <ChevronLeft className="w-6 h-6 text-gold" />
            </button>

            {/* Center Slot: Confirm & Next / Seal All Bids Button */}
            <button
              type="button"
              disabled={currentBidVal === forbiddenBid}
              onClick={handleConfirmBid}
              className={`w-full py-4 rounded-xl font-cinzel font-bold text-base sm:text-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl text-center ${
                currentBidVal === forbiddenBid
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed border border-gray-500'
                  : 'bg-gradient-to-r from-crimson via-crimson-dark to-crimson text-parchment hover:brightness-110 active:scale-[0.98] border border-gold/60'
              }`}
            >
              <span>{isLastBidder ? 'Seal All Bids' : 'Confirm'}</span>
              {isLastBidder ? (
                <CheckCircle2 className="w-5 h-5 text-gold" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gold" />
              )}
            </button>

            {/* Right Slot: Equal w-12 Spacer ensuring 100% exact center alignment */}
            <div className="w-12 h-12 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Round Bids Summary Footer Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg z-10 mt-4"
      >
        <div className="bg-wood/95 border border-gold/40 rounded-2xl p-3 shadow-xl">
          {/* Player Bids Badges Row(s) */}
          <div className="flex flex-wrap justify-center gap-1.5 py-1">
            {biddingOrder.map((playerIdx, stepIdx) => {
              const p = players[playerIdx];
              const pBid = bids[p.id];
              const isCurrentStep = stepIdx === currentBidStep;
              const hasBid = pBid !== undefined;
              const cols = playerCount >= 3 ? Math.ceil(playerCount / 2) : playerCount;

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setBidStep(stepIdx)}
                  className={`py-1.5 px-2 rounded-xl text-center transition-all border flex flex-col items-center justify-center ${
                    isCurrentStep
                      ? 'ring-2 ring-gold scale-105 shadow-md border-white/60'
                      : 'opacity-80 hover:opacity-100 border-black/30'
                  }`}
                  style={{
                    backgroundColor: p.color,
                    flex: `0 1 calc(${100 / cols}% - 0.375rem)`
                  }}
                >
                  <span className="text-[10px] font-cinzel font-bold text-white truncate max-w-[60px]">
                    {p.name}
                  </span>
                  <span className="text-xs font-extrabold text-white font-cinzel mt-0.5">
                    {hasBid ? pBid : '?'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
