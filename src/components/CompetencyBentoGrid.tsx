import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileSpreadsheet, 
  ShieldCheck, 
  BarChart3, 
  Laptop, 
  Users, 
  Sparkles, 
  X
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { skillCategories } from '../data/cvData';

export const CompetencyBentoGrid: React.FC = () => {
  const { activeSkill, setActiveSkill, highlightedProjectIds, showToast } = usePortfolio();

  const getDomainIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'Laptop':
        return <Laptop className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'Users':
        return <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
    }
  };

  const handleSkillClick = (skillName: string) => {
    if (activeSkill?.toLowerCase() === skillName.toLowerCase()) {
      setActiveSkill(null);
      showToast('Skill highlight cleared', 'info');
    } else {
      setActiveSkill(skillName);
      showToast(`Highlighting projects using "${skillName}"`, 'info');
    }
  };

  return (
    <section id="skills" className="py-20 border-t border-warm-border/60 dark:border-espresso-border bg-warm-bg dark:bg-espresso-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with active skill highlight status */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-warm-border/60 dark:border-espresso-border">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-warm-accent font-bold mb-2">
              Domain Competencies & Technical Rigor
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-warm-text dark:text-espresso-text">
              Interactive Competency Bento Grid
            </h2>
            <p className="mt-2 text-sm sm:text-base text-warm-muted dark:text-espresso-muted max-w-2xl">
              Click or hover any competency to spotlight which case studies, financial models, and career milestones utilize that specific skill.
            </p>
          </div>

          {/* Active Highlight Banner */}
          {activeSkill && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-warm-accent/20 border border-warm-accent/50 text-xs font-medium text-warm-text dark:text-espresso-text self-start md:self-auto"
            >
              <div className="flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-warm-accent animate-pulse" />
                <span>Spotlighting: <strong>{activeSkill}</strong></span>
                <span className="text-warm-subtle">({highlightedProjectIds.length} case studies linked)</span>
              </div>
              <button
                onClick={() => setActiveSkill(null)}
                className="p-1 rounded-full hover:bg-warm-accent/30 text-warm-text transition-colors"
                title="Clear filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Bento Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((cat, idx) => {
            // Bento sizing: first 2 are larger, 3rd is standard, 4th & 5th span nicely
            const isLarge = idx === 0 || idx === 1;

            return (
              <motion.div
                key={cat.domain}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`p-6 rounded-3xl bg-warm-card dark:bg-espresso-card border border-warm-border dark:border-espresso-border shadow-warm-sm dark:shadow-dark-sm hover:shadow-warm-md hover:border-warm-accent transition-all duration-200 flex flex-col justify-between ${
                  isLarge ? 'lg:col-span-1' : ''
                }`}
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-warm-bg dark:bg-espresso-bg border border-warm-border/60 dark:border-espresso-border shadow-xs">
                      {getDomainIcon(cat.iconName)}
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-warm-bg dark:bg-espresso-bg border border-warm-border/60 text-warm-subtle">
                      {cat.skills.length} Competencies
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-warm-text dark:text-espresso-text tracking-tight">
                    {cat.domain}
                  </h3>
                  <p className="mt-1 text-xs text-warm-muted dark:text-espresso-muted leading-relaxed mb-6">
                    {cat.description}
                  </p>

                  {/* Skills Tag Pills */}
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map(skill => {
                      const isActive = activeSkill?.toLowerCase() === skill.name.toLowerCase();
                      const hasProjects = skill.relatedProjectIds.length > 0;

                      return (
                        <button
                          key={skill.name}
                          onClick={() => handleSkillClick(skill.name)}
                          className={`group/skill relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-150 ${
                            isActive
                              ? 'bg-warm-accent text-warm-text font-bold shadow-warm-sm scale-105 border border-warm-accent'
                              : 'bg-warm-bg dark:bg-espresso-bg text-warm-text dark:text-espresso-text border border-warm-border/70 dark:border-espresso-border/80 hover:border-warm-accent hover:bg-warm-hover/30'
                          }`}
                        >
                          <span>{skill.name}</span>
                          {skill.level && (
                            <span className="text-[10px] text-warm-subtle opacity-75">
                              &middot; {skill.level}
                            </span>
                          )}
                          {hasProjects && (
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-warm-text' : 'bg-warm-accent'}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-dashed border-warm-border/60 dark:border-espresso-border/60 flex items-center justify-between text-[11px] font-mono text-warm-subtle">
                  <span>Interactive highlight</span>
                  <span className="text-warm-accent">Click to spotlight</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
