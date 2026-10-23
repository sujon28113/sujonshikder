# Md. Sujon Shikder — Personal Portfolio & Financial Systems Explorer

A warm, editorial, production-grade web application built for **Md. Sujon Shikder** (Final-semester BBA in Accounting at University of Dhaka & ICAB CA Professional Level Candidate).

Designed with a high-craft editorial aesthetic (Linear / Stripe / Notion warm stone palette), strictly anti-cringe motion physics, and deeply functional interactive systems.

---

## Key Features

1. **Global Command Palette (`Cmd + K` / `Ctrl + K`)**:
   - Quick jump to any page section, filter case studies, inspect/download CV, copy email with toast feedback, and toggle themes.
2. **Dual-Mode Experience & Education Explorer**:
   - **Timeline View**: Vertical editorial timeline with expandable milestones, achievements, coursework, and applied skills.
   - **Executive Table View**: High-density financial/audit spreadsheet view with instant search, category filtering, and column sorting.
3. **Filterable Case Study Engine**:
   - Filter by *Finance & Accounting*, *Data & BI Analytics*, *Audit & Assurance*, and *Strategy & Publishing*.
   - In-depth slide-over drawer displaying problem statements, methodologies, key outcomes, metrics, and tools.
4. **Interactive Competency Bento Grid with Cross-Highlighting**:
   - Categorized by domain (*Accounting & Reporting*, *Audit & Tax*, *Data & BI*, *Financial Software*, *Leadership*).
   - Clicking or hovering any skill spotlights every case study and career milestone linked to that competency.
5. **In-Browser CV Inspector Modal**:
   - Embedded PDF viewer with zoom controls, one-click download, and external tab viewing of `Md. Sujon Shikder CV.pdf`.
6. **Live Dhaka (GMT+6) Time Badge & Real-Time Availability**:
   - Real-time time synchronization with Dhaka local time.
7. **Smart Contact & Inquiry Hub**:
   - Categorized inquiry form (*Job Opportunity*, *Advisory/Consulting*, *Academic/Research*, *Networking*) with client-side validation.
8. **Warm Stone & Espresso Dark Theme**:
   - Warm Alabaster (`#FFFDF7`), Soft Butter Yellow (`#FEFCE8`), Amber Gold (`#EAB308`), Stone Charcoal (`#1C1917`), and Deep Warm Espresso (`#141210`).

---

## Tech Stack

- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + PostCSS
- **Animation:** Framer Motion (subtle spring physics: `stiffness: 260, damping: 25`)
- **Icons:** Lucide React
- **Typography:** Plus Jakarta Sans & JetBrains Mono

---

## Getting Started

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## Updating Data

All content is centralized in `src/data/`:
- `src/data/cvData.ts` — Profile, bio, metrics, education, experiences, and categorized skills.
- `src/data/projectsData.ts` — Structured case studies, problem statements, and quantitative metrics.
- `public/Md. Sujon Shikder CV.pdf` — Original CV file for download and in-browser preview.
