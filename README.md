# SplitPDF • Modern PDF Splitter

A modern, privacy-focused, client-side PDF splitter web application with fluid animations, intuitive page range selection, and real-time interactive thumbnail previews.

---

## ✨ Features

- **Custom Range Box**: Enter ranges like `1-3, 5, 8-10` with instant live validation, page counts, and error feedback.
- **Visual Thumbnail Selector**: Interactive page grid rendering live previews of your actual PDF pages. Click any page card to toggle inclusion.
- **Two-way Sync**: Typing in the range box updates the thumbnail cards; clicking cards updates the range text dynamically.
- **1-Click Presets**: Quick preset buttons for `All Pages`, `First Half`, `Second Half`, `Odd Pages`, `Even Pages`, and `Clear`.
- **Split Modes**:
  - **Single Merged PDF**: Extracts all selected pages into a single new PDF document.
  - **Separate Files (ZIP)**: Extracts each selected page into individual PDF files packaged cleanly into a `.zip` file.
- **100% Client-Side Privacy**: Files never leave your browser. Zero server uploads, zero latency, offline capable.
- **Built-in Demo Generator**: Test all features instantly with a 6-page styled demo document with 1 click.
- **Fluid Modern Aesthetic**: Ambient glowing background, glassmorphism panels, micro-interactions, and celebratory confetti upon download.

---

## 🚀 Getting Started

### 1. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Build for Production
```bash
npm run build
```
Generates production-ready, minified assets into `dist/`.

### 3. Preview Production Build
```bash
npm run preview
```
---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Plus Jakarta Sans & JetBrains Mono typography
- **PDF Engine**: `pdf-lib` (lossless vector PDF extraction and merging)
- **Thumbnail Renderer**: `pdfjs-dist` (canvas preview rendering)
- **Icons**: Lucide React
- **Packaging**: JSZip (for multi-file split) & Canvas-Confetti (for user feedback)
