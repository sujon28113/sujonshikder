import { ProjectCaseStudy } from '../types';

export const projectsData: ProjectCaseStudy[] = [
  {
    id: "statutory-audit-case",
    title: "Statutory Audit & Internal Controls Assessment",
    subtitle: "Substantive Testing, Voucher Traceability & Risk Matrix (Hasan Mohin CA)",
    category: "Audit & Assurance",
    year: "2024",
    role: "Audit Trainee",
    context: "Professional Traineeship at Hasan Mohin, Chartered Accountants",
    summary: "Conducted substantive audit procedures, internal control reviews, and financial statement verification following International Standards on Auditing (ISA).",
    problem: "Ensuring regulatory compliance, internal control effectiveness, and financial statement veracity across complex business transactions requiring rigorous audit evidence.",
    methodology: [
      "Designed systematic audit sample selections for high-value sales, procurement, and payroll cycles.",
      "Performed vouching and verification of supporting invoices, bank payment vouchers, and tax deductibles.",
      "Conducted trial balance reconciliations and prepared structured audit working papers with clear audit trails.",
      "Identified control vulnerabilities in inventory valuation and proposed risk mitigation adjustments."
    ],
    keyOutcomes: [
      "Completed comprehensive audit working papers adhering to ICAB and ISA standards.",
      "Verified compliance with Bangladesh Income Tax Act and VAT withholding regulations.",
      "Enhanced precision in detecting ledger anomalies and reconciliation variances."
    ],
    toolsUsed: ["MS Excel", "Tally ERP", "ISA Guidelines", "Audit Working Papers", "Regulatory Codes"],
    metrics: [
      { label: "Audit Standards", value: "ISA Compliant" },
      { label: "Voucher Traceability", value: "100% Sample" },
      { label: "Working Paper Quality", value: "Zero Variance" },
      { label: "Internal Controls Checked", value: "15+ Checkpoints" }
    ],
    documentRef: "Referenced in Md. Sujon Shikder CV (Audit Trainee, Hasan Mohin CA)"
  },
  {
    id: "financial-model-dcf",
    title: "Dynamic Financial Feasibility & DCF Valuation Engine",
    subtitle: "3-Statement Forecasting, Unit Economics & Sensitivity Matrix (Powerpreneur 3.0)",
    category: "Finance & Accounting",
    year: "2024",
    role: "Financial Strategist & Team Lead",
    context: "National Startup Competition by DU Entrepreneurship Development Club (DUEDC)",
    summary: "Engineered a comprehensive 5-year dynamic financial forecast, Discounted Cash Flow (DCF) valuation, and scenario analysis for a high-growth business model.",
    problem: "Early-stage business models require rigorous unit economics validation, cash burn forecasts, and stress-tested valuation under fluctuating market conditions.",
    methodology: [
      "Constructed an integrated 3-statement model (Income Statement, Balance Sheet, Cash Flow Statement) dynamically linked via working capital schedules.",
      "Calculated Weighted Average Cost of Capital (WACC) and projected Free Cash Flow to Firm (FCFF) across 5 operating years.",
      "Implemented Monte Carlo style scenario toggles for Base, Conservative, and Aggressive revenue drivers.",
      "Conducted break-even and customer lifetime value (LTV / CAC) payback analysis."
    ],
    keyOutcomes: [
      "Selected as National Finalist in Powerpreneur 3.0 among hundreds of university teams.",
      "Delivered institutional-grade investment deck and dynamic model praised by the judging panel.",
      "Demonstrated quantifiable profitability milestones and runway management."
    ],
    toolsUsed: ["MS Excel Advanced", "Financial Modeling", "Scenario Analysis", "Power BI", "Data Modeling"],
    metrics: [
      { label: "Competition Standing", value: "National Finalist" },
      { label: "Forecast Horizon", value: "5 Years Dynamic" },
      { label: "Scenario Coverage", value: "3 Operating Cases" },
      { label: "Model Integration", value: "3 Statements Linked" }
    ],
    documentRef: "Referenced in Md. Sujon Shikder CV (Finalist — Powerpreneur 3.0)"
  },
  {
    id: "corporate-tax-vat-model",
    title: "Corporate Tax & VAT Withholding Automation Engine",
    subtitle: "Compliance Model aligned with Bangladesh Income Tax Act 2023",
    category: "Finance & Accounting",
    year: "2024",
    role: "Tax Research & Modeling Lead",
    context: "Academic & Professional Research at University of Dhaka & ICAB Studies",
    summary: "Built an automated computational model to calculate corporate tax liabilities, Tax Deducted at Source (TDS), and Value Added Tax (VAT) rebate eligibility.",
    problem: "Frequent changes in fiscal policies and tax rates in Bangladesh lead to calculation discrepancies, withholding penalties, and delayed statutory submissions.",
    methodology: [
      "Mapped sections of the Bangladesh Income Tax Act 2023 and VAT & Supplementary Duty Act 2012 into dynamic lookup formulas.",
      "Created automated tax depreciation schedules distinguishing accounting vs tax depreciation rates.",
      "Programmed instant TDS & VDS calculators based on vendor category and threshold limits.",
      "Automated corporate tax return preparation sheets with disallowance add-backs."
    ],
    keyOutcomes: [
      "Eliminated manual calculation errors for monthly withholding tax returns.",
      "Provided transparent audit trail for deductible expenses and statutory allowances.",
      "Standardized tax planning workflows for small-to-medium enterprise operations."
    ],
    toolsUsed: ["MS Excel (Advanced)", "Income Tax Act 2023", "VAT Act 2012", "Tax Depreciation Logic"],
    metrics: [
      { label: "Legal Framework", value: "Tax Act 2023" },
      { label: "Calculation Accuracy", value: "100% Verified" },
      { label: "Withholding Lookup", value: "Instant TDS/VDS" },
      { label: "Time Saved", value: "70% Faster Filings" }
    ]
  },
  {
    id: "executive-bi-dashboard",
    title: "Executive Financial Performance & Working Capital BI",
    subtitle: "Interactive Dashboards, DuPont Decomposition & Cash Flow Diagnostics",
    category: "Data & BI Analytics",
    year: "2024",
    role: "Business Intelligence Analyst",
    context: "Advanced Financial Analytics Portfolio Project",
    summary: "Designed an executive-grade Power BI & Excel analytical dashboard analyzing corporate liquidity, working capital turnover, and profitability decomposition.",
    problem: "Executives need instant visibility into cash conversion cycles, debt service coverage, and DuPont margin drivers without sifting through static PDF reports.",
    methodology: [
      "Built star-schema data models connecting general ledger extracts, sales tables, and aging schedules.",
      "Authored custom DAX measures for Cash Conversion Cycle (CCC), Days Sales Outstanding (DSO), and Return on Equity (ROE) DuPont decomposition.",
      "Designed clean interactive visuals with drill-through capabilities from high-level KPIs to underlying journal entries.",
      "Applied warm stone editorial UI design for maximum executive readability."
    ],
    keyOutcomes: [
      "Provided real-time diagnostic indicators for working capital bottlenecks.",
      "Enabled interactive scenario toggles for revenue growth vs margin compression.",
      "Demonstrated mastery of Power BI DAX and business data storytelling."
    ],
    toolsUsed: ["Power BI", "DAX", "MS Excel", "Power Query", "Python (Pandas)"],
    metrics: [
      { label: "Key Ratio Visuals", value: "12+ Live Cards" },
      { label: "Analysis Framework", value: "DuPont 3-Tier" },
      { label: "Data Refresh Speed", value: "< 2 Seconds" },
      { label: "Drill-down Layers", value: "3 Levels of Granularity" }
    ]
  },
  {
    id: "accounting-bulletin-pipeline",
    title: "Scholarly Editorial Workflow & Digital Archive",
    subtitle: "Publication Lifecycle Management & Content Curation (Accounting Bulletin)",
    category: "Strategy & Publishing",
    year: "2024",
    role: "Managing Editor",
    context: "University of Dhaka Department of Accounting Periodical",
    summary: "Led the editorial curation, faculty peer-review workflow, and publication production of the premier departmental academic bulletin.",
    problem: "Managing multiple article submissions across faculty and student contributors with strict publication deadlines and high scholarly standards.",
    methodology: [
      "Structured a standardized review pipeline covering initial screening, editorial review, and faculty sign-off.",
      "Coordinated with student authors for empirical data verification and reference standardization.",
      "Supervised layout, typography, and graphic aesthetics to elevate the bulletin's editorial presence.",
      "Maintained a digital archive of published issues for historical reference and student research."
    ],
    keyOutcomes: [
      "Ensured zero missed deadlines across multiple publication editions.",
      "Significantly elevated publication quality and peer engagement across the department.",
      "Strengthened leadership, editorial judgment, and cross-stakeholder communication."
    ],
    toolsUsed: ["Editorial Frameworks", "Google Workspace", "Publication Workflow", "AI Review Tools"],
    metrics: [
      { label: "Role", value: "Managing Editor" },
      { label: "Deadline Adherence", value: "100% On-time" },
      { label: "Student Readership", value: "500+ Readers" },
      { label: "Editorial Quality", value: "Faculty Endorsed" }
    ],
    documentRef: "Referenced in Md. Sujon Shikder CV (Managing Editor — Accounting Bulletin)"
  },
  {
    id: "erp-ledger-automation",
    title: "ERP Multi-Entity Chart of Accounts & Bank Reconciliation",
    subtitle: "Standardized Ledger Mapping & Closing Period Acceleration (Tally ERP & Xero)",
    category: "Data & BI Analytics",
    year: "2023 - 2024",
    role: "Financial Systems Analyst",
    context: "SME Accounting Systems Consulting & Training",
    summary: "Implemented automated bank reconciliations and harmonized Chart of Accounts across Tally ERP and Xero platforms.",
    problem: "Manual bank reconciliation and inconsistent account coding across entities caused delayed month-end closes and recurring discrepancy errors.",
    methodology: [
      "Created a unified Chart of Accounts (COA) mapped to IFRS financial reporting categories.",
      "Configured automated bank statement import rules and automated match algorithms in Xero and Tally ERP.",
      "Created Excel reconciliation macros to quickly isolate uncredited deposits and unpresented cheques.",
      "Developed standard operating procedures (SOPs) for weekly ledger maintenance."
    ],
    keyOutcomes: [
      "Accelerated month-end reconciliation time by over 60%.",
      "Eliminated untracked bank fee variances and duplicate transaction postings.",
      "Provided standardized management accounts ready for executive review on day 3 post-close."
    ],
    toolsUsed: ["Tally ERP", "Xero", "MS Excel", "CSV Automation", "Bank Feeds"],
    metrics: [
      { label: "Reconciliation Speed", value: "60% Faster" },
      { label: "Variance Detection", value: "100% Automated" },
      { label: "Platforms Covered", value: "Tally & Xero" },
      { label: "Month-End Close", value: "3-Day Target" }
    ]
  }
];
