import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ScrollText } from 'lucide-react';

export const ScoreTableModal = ({ isOpen, onClose, players, history }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="parchment-bg pattern-griffin rounded-2xl p-4 sm:p-5 medieval-border shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-crimson" />
                <h2 className="text-lg font-bold font-cinzel text-ink">Round Score Ledger</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-wood hover:bg-wood/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {history.length === 0 ? (
              <p className="text-sm font-cinzel text-wood/70 text-center py-6">
                No rounds finalized yet.
              </p>
            ) : (
              <div className="touch-scroll overflow-auto rounded-lg border border-wood/25">
                <table className="w-full text-sm border-collapse">
                  <thead className="sticky top-0 bg-wood text-parchment z-10">
                    <tr>
                      <th
                        className="w-9 p-0 relative border-b-2 border-r border-parchment/20"
                        style={{
                          backgroundImage:
                            'linear-gradient(to top right, transparent calc(50% - 1px), rgba(243,232,210,0.3) 50%, transparent calc(50% + 1px))',
                        }}
                      />
                      {players.map(p => (
                        <th
                          key={p.id}
                          className="p-0 h-16 border-b-2 border-l border-parchment/20 align-bottom"
                        >
                          <div className="flex h-full items-end justify-center pb-1.5">
                            <span className="inline-block origin-bottom-left -rotate-45 whitespace-nowrap font-cinzel text-xs uppercase tracking-wide">
                              {p.name}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record) => (
                      <tr
                        key={record.roundNumber}
                        className="border-b border-wood/15 last:border-b-0"
                      >
                        <td className="px-2 py-2 text-center font-cinzel font-bold text-ink/60 border-r border-wood/15">
                          {record.roundNumber}
                        </td>
                        {players.map(p => {
                          const delta = record.scores?.[p.id];
                          const isPositive = (delta || 0) >= 0;
                          return (
                            <td
                              key={p.id}
                              className={`px-2 py-2 text-center font-cinzel font-semibold ${
                                delta === undefined ? 'text-wood/30' : isPositive ? 'text-emerald-700' : 'text-crimson'
                              }`}
                            >
                              {delta === undefined ? '—' : isPositive ? `+${delta}` : delta}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
