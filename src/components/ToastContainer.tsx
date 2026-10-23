import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePortfolio();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-warm-text text-warm-bg dark:bg-espresso-text dark:text-espresso-bg shadow-warm-lg dark:shadow-dark-lg border border-warm-accent/40"
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'info' ? (
                <Info className="w-4 h-4 text-warm-accent shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-medium tracking-tight">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:opacity-75 transition-opacity"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5 opacity-60" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
