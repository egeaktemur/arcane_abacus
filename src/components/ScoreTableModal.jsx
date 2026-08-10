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
            className="parchment-bg rounded-2xl p-4 sm:p-5 medieval-border shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-[#8B0000]" />
                <h2 className="text-lg font-bold font-cinzel text-[#2C1810]">Round Score Ledger</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#3E2723] hover:bg-[#3E2723]/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {history.length === 0 ? (
              <p className="text-sm font-cinzel text-[#3E2723]/70 text-center py-6">
                No rounds finalized yet.
              </p>
            ) : (
              <div className="overflow-auto rounded-lg border border-[#3E2723]/20">
                <table className="w-full text-sm border-collapse">
                  <thead className="sticky top-0 bg-[#3E2723] text-[#F3E8D2]">
                    <tr>
                      <th className="px-2 py-2 text-left font-cinzel text-xs uppercase">Round</th>
                      {players.map(p => (
                        <th key={p.id} className="px-2 py-2 text-center font-cinzel text-xs uppercase truncate max-w-[70px]">
                          {p.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record, rIdx) => (
                      <tr
                        key={record.roundNumber}
                        className={rIdx % 2 === 0 ? 'bg-[#FFFDF5]/50' : 'bg-[#E5D3B3]/40'}
                      >
                        <td className="px-2 py-2 font-cinzel font-bold text-[#2C1810]">{record.roundNumber}</td>
                        {players.map(p => {
                          const delta = record.scores?.[p.id];
                          const isPositive = (delta || 0) >= 0;
                          return (
                            <td
                              key={p.id}
                              className={`px-2 py-2 text-center font-cinzel font-semibold ${
                                delta === undefined ? 'text-[#3E2723]/30' : isPositive ? 'text-emerald-700' : 'text-[#8B0000]'
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
