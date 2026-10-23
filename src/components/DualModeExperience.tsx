import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitCommit, 
  Table as TableIcon, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  GraduationCap, 
  Briefcase, 
  Award, 
  CheckCircle2,
  Tag,
  ArrowUpDown
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { educationList, experienceList } from '../data/cvData';

type ViewMode = 'timeline' | 'table';

interface CombinedRecord {
  id: string;
  category: 'Education' | 'Professional' | 'Leadership' | 'Competition';
  period: string;
  title: string;
  organization: string;
  statusOrMetric: string;
  summary: string;
  details: string[];
  courseworkOrModules?: string[];
  skills: string[];
}

export const DualModeExperience: React.FC = () => {
  const { activeSkill, setActiveSkill } = usePortfolio();
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'icab-ca': true,
    'bba-du': true,
    'audit-trainee-hm': true
  });
  
  // Table view search & filter state
  const [tableSearch, setTableSearch] = useState('');
  const [tableFilter, setTableFilter] = useState<'All' | 'Education' | 'Professional' | 'Leadership' | 'Competition'>('All');
  const [sortField, setSortField] = useState<'period' | 'title' | 'organization'>('period');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Harmonized records for both views
  const records: CombinedRecord[] = useMemo(() => [
    {
      id: 'icab-ca',
      category: 'Education',
      period: '2024 - 2027 (Expected)',
      title: 'CA Professional Level Candidate',
      organization: 'Institute of Chartered Accountants of Bangladesh (ICAB)',
      statusOrMetric: 'Certificate Level Completed',
      summary: 'Developing advanced competencies in corporate taxation, advanced auditing standards (ISA), and regulatory financial compliance.',
      details: educationList[0].highlights,
      courseworkOrModules: educationList[0].coursework,
      skills: ['Statutory Audit', 'Corporate Tax & VAT', 'IFRS Standards', 'Compliance', 'Financial Reporting']
    },
    {
      id: 'bba-du',
      category: 'Education',
      period: '2022 - 2026 (Expected)',
      title: 'BBA in Accounting',
      organization: 'Department of Accounting, University of Dhaka',
      statusOrMetric: 'CGPA 3.63 / 4.00',
      summary: 'Final-semester candidate with core focus on advanced financial principles, management auditing, cost accounting, and analytical reporting.',
      details: educationList[1].highlights,
      courseworkOrModules: educationList[1].coursework,
      skills: ['MS Excel', 'Power BI', 'Financial Modeling', 'Cost Accounting', 'Business Analytics']
    },
    {
      id: 'audit-trainee-hm',
      category: 'Professional',
      period: 'Professional Traineeship',
      title: 'Audit Trainee — Hands-On Audit Procedures',
      organization: 'Hasan Mohin, Chartered Accountants',
      statusOrMetric: 'ISA Audit Procedures',
      summary: experienceList[0].summary,
      details: experienceList[0].achievements,
      skills: ['Statutory Audit', 'Internal Controls', 'MS Excel', 'Corporate Tax & VAT', 'Tally ERP']
    },
    {
      id: 'vp-udaf',
      category: 'Leadership',
      period: 'Leadership Term',
      title: 'Vice President — Promotion & Content Development Wing',
      organization: 'University of Dhaka Accounting Forum (UDAF)',
      statusOrMetric: 'Executive Board',
      summary: experienceList[1].summary,
      details: experienceList[1].achievements,
      skills: ['Cross-functional Leadership', 'Strategic Communication', 'Campaign Management']
    },
    {
      id: 'managing-editor-ab',
      category: 'Leadership',
      period: 'Editorial Term',
      title: 'Managing Editor — Academic Periodical',
      organization: 'Accounting Bulletin',
      statusOrMetric: 'Faculty & Student Publication',
      summary: experienceList[2].summary,
      details: experienceList[2].achievements,
      skills: ['Editorial Review', 'Time Management', 'Analytical Thinking', 'Scholarly Writing']
    },
    {
      id: 'finalist-powerpreneur',
      category: 'Competition',
      period: 'Competition Finalist',
      title: 'Finalist — Powerpreneur 3.0',
      organization: 'Dhaka University Entrepreneurship Development Club (DUEDC)',
      statusOrMetric: 'National Startup Finalist',
      summary: experienceList[3].summary,
      details: experienceList[3].achievements,
      skills: ['Financial Modeling', 'Business Analytics', 'DCF Valuation', 'Pitch Strategy']
    }
  ], []);

  // Filtered & sorted records for table
  const filteredRecords = useMemo(() => {
    return records
      .filter(rec => {
        if (tableFilter !== 'All' && rec.category !== tableFilter) return false;
        if (!tableSearch.trim()) return true;
        const q = tableSearch.toLowerCase();
        return (
          rec.title.toLowerCase().includes(q) ||
          rec.organization.toLowerCase().includes(q) ||
          rec.statusOrMetric.toLowerCase().includes(q) ||
          rec.summary.toLowerCase().includes(q) ||
          rec.skills.some(s => s.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        let fieldA = a[sortField];
        let fieldB = b[sortField];
        if (sortOrder === 'asc') {
          return fieldA.localeCompare(fieldB);
        } else {
          return fieldB.localeCompare(fieldA);
        }
      });
  }, [records, tableFilter, tableSearch, sortField, sortOrder]);

  const handleSort = (field: 'period' | 'title' | 'organization') => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getCategoryBadgeClass = (cat: CombinedRecord['category']) => {
    switch (cat) {
      case 'Education':
        return 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      case 'Professional':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
      case 'Leadership':
        return 'bg-stone-200 text-stone-900 border-stone-300 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700';
      case 'Competition':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300 dark:bg-yellow-950/60 dark:text-yellow-300 dark:border-yellow-800';
    }
  };

  return (
    <section id="experience" className="py-20 border-t border-warm-border/60 dark:border-espresso-border bg-warm-bg dark:bg-espresso-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with View Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-warm-border/60 dark:border-espresso-border">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-warm-accent font-bold mb-2">
              Career Trajectory & Academic Distinction
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-warm-text dark:text-espresso-text">
              Dual-Mode Experience & Education Explorer
            </h2>
            <p className="mt-2 text-sm sm:text-base text-warm-muted dark:text-espresso-muted max-w-2xl">
              Switch between an editorial, scroll-linked vertical timeline and a high-density executive spreadsheet view.
            </p>
          </div>

          {/* Toggle Pills: Timeline View vs Executive Table */}
          <div className="flex items-center p-1 rounded-xl bg-warm-card dark:bg-espresso-card border border-warm-border dark:border-espresso-border shadow-xs self-start md:self-auto">
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                viewMode === 'timeline'
                  ? 'bg-warm-accent text-warm-text shadow-warm-sm'
                  : 'text-warm-muted dark:text-espresso-muted hover:text-warm-text dark:hover:text-espresso-text'
              }`}
            >
              <GitCommit className="w-4 h-4" />
              <span>Timeline View</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                viewMode === 'table'
                  ? 'bg-warm-accent text-warm-text shadow-warm-sm'
                  : 'text-warm-muted dark:text-espresso-muted hover:text-warm-text dark:hover:text-espresso-text'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span>Executive Table View</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: TIMELINE VIEW */}
        {viewMode === 'timeline' && (
          <div className="mt-12 relative">
            {/* Center / Left line for timeline */}
            <div className="absolute left-4 sm:left-8 top-3 bottom-3 w-0.5 bg-gradient-to-b from-warm-accent via-warm-border to-warm-border/20 dark:from-espresso-accent dark:via-espresso-border dark:to-transparent" />

            <div className="space-y-8 pl-12 sm:pl-20">
              {records.map((rec, index) => {
                const isExpanded = !!expandedItems[rec.id];
                return (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="relative group"
                  >
                    {/* Node Dot on Timeline */}
                    <div className="absolute -left-12 sm:-left-20 top-6 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-warm-card dark:bg-espresso-card border-2 border-warm-accent dark:border-espresso-accent flex items-center justify-center shadow-xs transition-transform group-hover:scale-110">
                      {rec.category === 'Education' ? (
                        <GraduationCap className="w-3.5 h-3.5 text-warm-accent" />
                      ) : rec.category === 'Professional' ? (
                        <Briefcase className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      )}
                    </div>

                    {/* Timeline Milestone Card */}
                    <div className="rounded-2xl bg-warm-card dark:bg-espresso-card border border-warm-border dark:border-espresso-border shadow-warm-sm dark:shadow-dark-sm p-5 sm:p-6 transition-all duration-200 hover:border-warm-accent hover:shadow-warm-md">
                      {/* Card Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-warm-border/50 dark:border-espresso-border/60">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(rec.category)}`}>
                              {rec.category}
                            </span>
                            <span className="text-xs font-mono text-warm-subtle dark:text-espresso-subtle">
                              {rec.period}
                            </span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-warm-text dark:text-espresso-text">
                            {rec.title}
                          </h3>
                          <p className="text-sm font-medium text-warm-accent dark:text-yellow-400">
                            {rec.organization}
                          </p>
                        </div>

                        {/* Status / Metric Badge + Expand toggle */}
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-warm-bg dark:bg-espresso-bg border border-warm-border dark:border-espresso-border text-warm-text dark:text-espresso-text">
                            {rec.statusOrMetric}
                          </span>
                          <button
                            onClick={() => toggleExpand(rec.id)}
                            className="p-1.5 rounded-lg hover:bg-warm-hover dark:hover:bg-espresso-hover text-warm-subtle transition-colors"
                            aria-label="Toggle details"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Summary */}
                      <p className="mt-3 text-sm text-warm-muted dark:text-espresso-muted leading-relaxed">
                        {rec.summary}
                      </p>

                      {/* Expandable Key Achievements & Coursework */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-dashed border-warm-border/60 dark:border-espresso-border/60 space-y-4">
                              {/* Achievements List */}
                              <div>
                                <h4 className="text-xs font-mono uppercase tracking-wider text-warm-subtle dark:text-espresso-subtle mb-2">
                                  Key Deliverables & Responsibilities
                                </h4>
                                <ul className="space-y-1.5">
                                  {rec.details.map((detail, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-warm-muted dark:text-espresso-muted">
                                      <CheckCircle2 className="w-4 h-4 text-warm-accent shrink-0 mt-0.5" />
                                      <span>{detail}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Coursework if available */}
                              {rec.courseworkOrModules && (
                                <div>
                                  <h4 className="text-xs font-mono uppercase tracking-wider text-warm-subtle dark:text-espresso-subtle mb-2">
                                    Specialized Modules & Curriculum
                                  </h4>
                                  <div className="flex flex-wrap gap-1.5">
                                    {rec.courseworkOrModules.map(mod => (
                                      <span
                                        key={mod}
                                        className="text-xs font-mono px-2.5 py-1 rounded-md bg-warm-bg dark:bg-espresso-bg border border-warm-border/60 dark:border-espresso-border text-warm-text dark:text-espresso-text"
                                      >
                                        {mod}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Skills Tag Cloud */}
                              <div>
                                <h4 className="text-xs font-mono uppercase tracking-wider text-warm-subtle dark:text-espresso-subtle mb-2 flex items-center gap-1.5">
                                  <Tag className="w-3.5 h-3.5 text-warm-accent" />
                                  <span>Applied Competencies</span>
                                </h4>
                                <div className="flex flex-wrap gap-1.5">
                                  {rec.skills.map(skill => {
                                    const isHighlighted = activeSkill?.toLowerCase() === skill.toLowerCase();
                                    return (
                                      <button
                                        key={skill}
                                        onClick={() => setActiveSkill(isHighlighted ? null : skill)}
                                        className={`text-xs font-mono px-2.5 py-0.5 rounded-full border transition-all duration-150 ${
                                          isHighlighted
                                            ? 'bg-warm-accent text-warm-text border-warm-accent font-bold scale-105 shadow-xs'
                                            : 'bg-warm-hover/40 dark:bg-espresso-bg border-warm-border dark:border-espresso-border text-warm-muted dark:text-espresso-muted hover:border-warm-accent'
                                        }`}
                                      >
                                        {skill}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: EXECUTIVE TABLE VIEW (Financial/Audit Sheet Density) */}
        {viewMode === 'table' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8 space-y-4"
          >
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-warm-card dark:bg-espresso-card border border-warm-border dark:border-espresso-border shadow-xs">
              {/* Category Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(['All', 'Education', 'Professional', 'Leadership', 'Competition'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setTableFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                      tableFilter === cat
                        ? 'bg-warm-accent text-warm-text shadow-xs'
                        : 'text-warm-muted dark:text-espresso-muted hover:bg-warm-hover dark:hover:bg-espresso-hover'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Keyword Search */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-warm-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={e => setTableSearch(e.target.value)}
                  placeholder="Filter records (e.g. 'audit', 'tax', '3.63')..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-warm-bg dark:bg-espresso-bg border border-warm-border dark:border-espresso-border text-warm-text dark:text-espresso-text placeholder-warm-subtle outline-none focus:border-warm-accent"
                />
              </div>
            </div>

            {/* High-density Spreadsheet Container */}
            <div className="rounded-2xl border border-warm-border dark:border-espresso-border overflow-hidden bg-warm-card dark:bg-espresso-card shadow-warm-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-warm-hover/60 dark:bg-espresso-bg border-b border-warm-border dark:border-espresso-border font-mono text-warm-text dark:text-espresso-text">
                      <th
                        onClick={() => handleSort('period')}
                        className="py-3 px-4 font-bold cursor-pointer hover:bg-warm-hover transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>Period / Horizon</span>
                          <ArrowUpDown className="w-3 h-3 text-warm-subtle" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('title')}
                        className="py-3 px-4 font-bold cursor-pointer hover:bg-warm-hover transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>Role / Credential</span>
                          <ArrowUpDown className="w-3 h-3 text-warm-subtle" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('organization')}
                        className="py-3 px-4 font-bold cursor-pointer hover:bg-warm-hover transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>Institution / Organization</span>
                          <ArrowUpDown className="w-3 h-3 text-warm-subtle" />
                        </div>
                      </th>
                      <th className="py-3 px-4 font-bold">Category</th>
                      <th className="py-3 px-4 font-bold">Status / Key Metric</th>
                      <th className="py-3 px-4 font-bold">Applied Competencies</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-border/50 dark:divide-espresso-border/60">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-warm-muted dark:text-espresso-muted">
                          No matching records found for "{tableSearch}".
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map(rec => (
                        <tr
                          key={rec.id}
                          className="hover:bg-warm-hover/30 dark:hover:bg-espresso-hover/40 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-mono font-semibold text-warm-text dark:text-espresso-text whitespace-nowrap">
                            {rec.period}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-warm-text dark:text-espresso-text">
                            {rec.title}
                          </td>
                          <td className="py-3.5 px-4 text-warm-muted dark:text-espresso-muted">
                            {rec.organization}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(rec.category)}`}>
                              {rec.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-warm-accent dark:text-yellow-400 whitespace-nowrap">
                            {rec.statusOrMetric}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {rec.skills.map(s => (
                                <span
                                  key={s}
                                  className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-warm-bg dark:bg-espresso-bg border border-warm-border/60 dark:border-espresso-border text-warm-subtle dark:text-espresso-subtle"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
