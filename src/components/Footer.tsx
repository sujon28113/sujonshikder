import React from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';
import { personalInfo } from '../data/cvData';
import { useDhakaTime } from '../utils/useDhakaTime';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer: React.FC = () => {
  const { timeString } = useDhakaTime();
  const { setIsCmdOpen } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 border-t border-warm-border/60 dark:border-espresso-border bg-warm-card/60 dark:bg-espresso-card/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand & Attribution */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex items-center gap-2 font-bold text-sm text-warm-text dark:text-espresso-text">
              <span className="w-6 h-6 rounded-lg bg-warm-accent flex items-center justify-center text-xs font-black text-warm-text">
                {personalInfo.initials}
              </span>
              <span>{personalInfo.name}</span>
              <span className="text-warm-subtle">&middot;</span>
              <span className="text-xs font-mono text-warm-subtle">
                Dhaka, Bangladesh
              </span>
            </div>
            <p className="mt-1 text-xs text-warm-muted dark:text-espresso-muted">
              BBA in Accounting, University of Dhaka &middot; ICAB CA Professional Level Candidate
            </p>
          </div>

          {/* Quick Actions & Back to top */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCmdOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warm-bg dark:bg-espresso-bg border border-warm-border dark:border-espresso-border text-xs font-mono text-warm-muted dark:text-espresso-muted hover:text-warm-text hover:border-warm-accent transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-warm-accent" />
              <span>Press Cmd+K</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-warm-bg dark:bg-espresso-bg border border-warm-border dark:border-espresso-border text-warm-subtle hover:text-warm-text hover:border-warm-accent transition-colors group"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-dashed border-warm-border/50 dark:border-espresso-border/50 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-warm-subtle gap-2">
          <span>&copy; {new Date().getFullYear()} Md. Sujon Shikder. All rights reserved.</span>
          <span className="tabular-nums">Dhaka Local Time: {timeString || '11:30 AM'} (GMT+6)</span>
        </div>
      </div>
    </footer>
  );
};
