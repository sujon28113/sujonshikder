import { Education, Experience, SkillCategory } from '../types';

export const personalInfo = {
  name: "Md. Sujon Shikder",
  shortName: "Sujon",
  initials: "SS",
  headline: "Chartered Accountancy Candidate & Financial Data Analyst",
  subheadline: "Final-semester BBA in Accounting at University of Dhaka & ICAB CA Professional Level Candidate. Bridging statutory accounting rigor with modern financial modeling and business intelligence.",
  location: "Dhaka, Bangladesh",
  phone: "01345502209",
  email: "sujonshikder736@gmail.com",
  linkedin: "https://linkedin.com/in/sujon-shikder-accounting",
  github: "https://github.com/sujonshikder",
  website: "https://sujon.website",
  cvPdfPath: "/Md. Sujon Shikder CV.pdf",
  availabilityStatus: "Open for Full-time Roles & Strategic Financial Projects",
  timezone: "Asia/Dhaka",
  gmtOffset: "+06:00",
  bio: `Final-semester BBA in Accounting student at the University of Dhaka and CA Professional Level (ICAB) candidate with strong foundations in financial accounting, auditing, taxation, cost accounting, and data analytics. Skilled in Excel, Tally ERP, Xero, Power BI, and AI productivity tools. Demonstrated leadership and communication through university organizations.`
};

export const statsMetrics = [
  {
    id: "cgpa",
    label: "University of Dhaka CGPA",
    value: "3.63 / 4.00",
    detail: "Department of Accounting (BBA Expected 2026)",
    icon: "GraduationCap"
  },
  {
    id: "icab",
    label: "Chartered Accountancy",
    value: "CA Professional Level",
    detail: "ICAB Certificate Level Completed Successfully",
    icon: "ShieldCheck"
  },
  {
    id: "audit",
    label: "Practical Audit Training",
    value: "Hasan Mohin CA",
    detail: "Statutory audit procedures & internal controls testing",
    icon: "FileSpreadsheet"
  },
  {
    id: "leadership",
    label: "Institutional Leadership",
    value: "VP & Managing Editor",
    detail: "Dhaka University Accounting Forum & Bulletin",
    icon: "Award"
  }
];

export const educationList: Education[] = [
  {
    degree: "CA Professional Level (Ongoing)",
    field: "Chartered Accountancy & Statutory Financial Reporting",
    institution: "Institute of Chartered Accountants of Bangladesh (ICAB)",
    year: "Expected 2027",
    expectedDate: "2027",
    status: "In Progress (Certificate Level Completed)",
    highlights: [
      "Certificate Level successfully completed, clearing foundational statutory accounting, auditing standards, and legal compliance.",
      "Developing advanced competencies in Corporate Taxation, Advanced Auditing Standards (ISA), and Financial Regulatory Compliance.",
      "Focusing on corporate governance, forensic audit methodologies, and IFRS/IAS compliance frameworks."
    ],
    coursework: [
      "Advanced Auditing & Assurance (ISA)",
      "Corporate Taxation & VAT Act 2023",
      "Financial Accounting & Reporting Standards (IFRS)",
      "Business Law & Regulatory Compliance",
      "Cost & Management Accounting"
    ],
    skillsApplied: ["statutory-audit", "corporate-tax-vat", "ifrs-standards", "compliance", "financial-reporting"]
  },
  {
    degree: "BBA in Accounting",
    field: "Faculty of Business Studies, Department of Accounting",
    institution: "University of Dhaka",
    year: "Expected 2026",
    expectedDate: "2026",
    cgpa: "3.63 / 4.00",
    status: "Final-semester Candidate",
    highlights: [
      "Maintained top-tier academic standing with a cumulative CGPA of 3.63/4.00.",
      "Core focus on advanced financial principles, management auditing, cost accounting, and analytical reporting.",
      "Represented the university and department in national business analytics and entrepreneurship competitions."
    ],
    coursework: [
      "Advanced Financial Accounting",
      "Auditing & Assurance Services",
      "Cost & Management Accounting",
      "Business Intelligence & Data Analytics",
      "Financial Management & Corporate Finance",
      "Taxation in Bangladesh"
    ],
    skillsApplied: ["ms-excel", "power-bi", "financial-modeling", "cost-accounting", "business-analytics"]
  }
];

export const experienceList: Experience[] = [
  {
    id: "audit-trainee-hm",
    title: "Audit Trainee",
    role: "Audit Trainee — Hands-On Audit Procedures",
    organization: "Hasan Mohin, Chartered Accountants",
    location: "Dhaka, Bangladesh",
    period: "Professional Training",
    type: "Professional",
    summary: "Conducted rigorous substantive testing, internal control evaluations, and audit case analyses across statutory client engagements.",
    achievements: [
      "Gained hands-on exposure to comprehensive audit procedures, vouching, and ledger verification in accordance with International Standards on Auditing (ISA).",
      "Assisted in reviewing internal accounting controls and preparing trial balance reconciliation working papers.",
      "Analyzed complex financial accounting cases and verified adherence to Bangladesh corporate tax laws and statutory reporting requirements."
    ],
    skillsApplied: ["statutory-audit", "internal-controls", "ms-excel", "corporate-tax-vat", "compliance", "tally-erp"],
    featured: true
  },
  {
    id: "vp-udaf",
    title: "Vice President",
    wing: "Promotion & Content Development Wing",
    role: "Vice President — Promotion & Content Development Wing",
    organization: "University of Dhaka Accounting Forum (UDAF)",
    location: "University of Dhaka",
    period: "Leadership Term",
    type: "Leadership",
    summary: "Spearheaded organizational brand positioning, strategic communications, and promotional campaigns for the premier student accounting forum.",
    achievements: [
      "Spearheaded promotional initiatives, strategic communication, and content delivery strategies for the student body and alumni network.",
      "Led cross-functional teams in orchestrating flagship academic seminars, career bootcamps, and professional networking summits.",
      "Increased student engagement across digital and campus channels through data-backed content distribution."
    ],
    skillsApplied: ["leadership-teamwork", "strategic-communication", "time-management", "content-strategy"],
    featured: true
  },
  {
    id: "managing-editor-ab",
    title: "Managing Editor",
    role: "Managing Editor — Scholarly Publication",
    organization: "Accounting Bulletin",
    location: "University of Dhaka",
    period: "Editorial Term",
    type: "Leadership",
    summary: "Directed the editorial board, article curation, and publication pipeline for the university's flagship accounting periodical.",
    achievements: [
      "Oversee end-to-end content compilation, rigorous peer-review editing, and publication workflows for academic updates.",
      "Coordinated with faculty advisors and student contributors to ensure scholarly accuracy and formatting adherence.",
      "Optimized publication release cycles through structured milestone management and deadline enforcement."
    ],
    skillsApplied: ["editorial-review", "leadership-teamwork", "analytical-thinking", "time-management"],
    featured: true
  },
  {
    id: "finalist-powerpreneur",
    title: "Finalist — Powerpreneur 3.0",
    role: "Team Lead & Financial Strategist",
    organization: "Dhaka University Entrepreneurship Development Club (DUEDC)",
    location: "National Competition",
    period: "Competition Finalist",
    type: "Competition",
    summary: "Led team to the national finals of Powerpreneur 3.0 by developing robust startup business models and financial feasibility analysis.",
    achievements: [
      "Led the team in conducting in-depth market research, unit economics modeling, and competitive landscape analysis.",
      "Constructed multi-year pro forma financial statements, cash flow forecasts, and break-even models for a high-potential startup concept.",
      "Delivered executive pitch presentations to a jury of venture capitalists and industry leaders."
    ],
    skillsApplied: ["financial-modeling", "business-analytics", "ms-excel", "analytical-thinking", "leadership-teamwork"],
    featured: true
  }
];

export const skillCategories: SkillCategory[] = [
  {
    domain: "Accounting & Financial Reporting",
    description: "Core accounting standards, financial statement preparation, and management reporting",
    iconName: "FileSpreadsheet",
    skills: [
      { name: "Financial Accounting", level: "Advanced", featured: true, relatedProjectIds: ["financial-model-dcf", "statutory-audit-case"], relatedExperienceIds: ["audit-trainee-hm"] },
      { name: "IFRS / IAS Standards", level: "Intermediate", featured: true, relatedProjectIds: ["statutory-audit-case"], relatedExperienceIds: ["audit-trainee-hm"] },
      { name: "Cost & Management Accounting", level: "Advanced", featured: true, relatedProjectIds: ["financial-model-dcf"], relatedExperienceIds: ["audit-trainee-hm"] },
      { name: "Financial Statement Analysis", level: "Advanced", featured: true, relatedProjectIds: ["executive-bi-dashboard", "financial-model-dcf"], relatedExperienceIds: ["finalist-powerpreneur"] },
      { name: "Trial Balance Reconciliation", level: "Advanced", featured: false, relatedProjectIds: ["statutory-audit-case", "erp-ledger-automation"], relatedExperienceIds: ["audit-trainee-hm"] }
    ]
  },
  {
    domain: "Audit, Assurance & Taxation",
    description: "Statutory compliance, substantive testing, and Bangladesh tax/VAT regulatory frameworks",
    iconName: "ShieldCheck",
    skills: [
      { name: "Statutory Audit Procedures", level: "Hands-on", featured: true, relatedProjectIds: ["statutory-audit-case"], relatedExperienceIds: ["audit-trainee-hm"] },
      { name: "Internal Control Evaluation", level: "Hands-on", featured: true, relatedProjectIds: ["statutory-audit-case"], relatedExperienceIds: ["audit-trainee-hm"] },
      { name: "Corporate Tax & VAT (BD Act 2023)", level: "Advanced", featured: true, relatedProjectIds: ["corporate-tax-vat-model"], relatedExperienceIds: ["audit-trainee-hm"] },
      { name: "Substantive Vouching & Verification", level: "Hands-on", featured: false, relatedProjectIds: ["statutory-audit-case"], relatedExperienceIds: ["audit-trainee-hm"] },
      { name: "Audit Working Papers & Indexing", level: "Intermediate", featured: false, relatedProjectIds: ["statutory-audit-case"], relatedExperienceIds: ["audit-trainee-hm"] }
    ]
  },
  {
    domain: "Data & Business Intelligence",
    description: "Data modeling, interactive dashboards, dynamic financial forecasts, and scripting",
    iconName: "BarChart3",
    skills: [
      { name: "MS Excel (Formulas, Pivots, Modeling)", level: "Expert", featured: true, relatedProjectIds: ["executive-bi-dashboard", "financial-model-dcf", "corporate-tax-vat-model"], relatedExperienceIds: ["finalist-powerpreneur", "audit-trainee-hm"] },
      { name: "Power BI (DAX & Dashboards)", level: "Proficient", featured: true, relatedProjectIds: ["executive-bi-dashboard"], relatedExperienceIds: [] },
      { name: "Business Analytics", level: "Advanced", featured: true, relatedProjectIds: ["executive-bi-dashboard", "financial-model-dcf"], relatedExperienceIds: ["finalist-powerpreneur"] },
      { name: "Python (Data Analysis Basic)", level: "Foundational", featured: false, relatedProjectIds: ["executive-bi-dashboard"], relatedExperienceIds: [] }
    ]
  },
  {
    domain: "Financial Software & Productivity",
    description: "Industry accounting software, enterprise productivity tools, and AI workflows",
    iconName: "Laptop",
    skills: [
      { name: "Tally ERP", level: "Proficient", featured: true, relatedProjectIds: ["erp-ledger-automation"], relatedExperienceIds: ["audit-trainee-hm"] },
      { name: "Xero Accounting", level: "Proficient", featured: true, relatedProjectIds: ["erp-ledger-automation"], relatedExperienceIds: [] },
      { name: "AI Productivity Tools", level: "Advanced", featured: true, relatedProjectIds: ["accounting-bulletin-pipeline"], relatedExperienceIds: ["vp-udaf"] },
      { name: "Google Workspace & Suite", level: "Advanced", featured: false, relatedProjectIds: ["accounting-bulletin-pipeline"], relatedExperienceIds: ["managing-editor-ab"] }
    ]
  },
  {
    domain: "Executive Leadership & Soft Skills",
    description: "Cross-functional team direction, complex problem decomposition, and editorial management",
    iconName: "Users",
    skills: [
      { name: "Leadership & Teamwork", level: "Proven", featured: true, relatedProjectIds: ["accounting-bulletin-pipeline"], relatedExperienceIds: ["vp-udaf", "finalist-powerpreneur"] },
      { name: "Analytical Thinking", level: "High Aptitude", featured: true, relatedProjectIds: ["financial-model-dcf", "statutory-audit-case"], relatedExperienceIds: ["audit-trainee-hm", "finalist-powerpreneur"] },
      { name: "Time Management", level: "High Rigor", featured: true, relatedProjectIds: [], relatedExperienceIds: ["audit-trainee-hm", "vp-udaf"] },
      { name: "Strategic Communication", level: "Executive", featured: false, relatedProjectIds: ["accounting-bulletin-pipeline"], relatedExperienceIds: ["vp-udaf", "managing-editor-ab"] }
    ]
  }
];
