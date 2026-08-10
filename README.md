# 🔮 Arcane Abacus

> A web-based, mobile-first companion application for the card game **Wizard**, designed with an authentic Medieval German (*Alte Deutsche*) tavern aesthetic.

[![Deploy to GitHub Pages](https://github.com/egeaktemur/arcane_abacus/actions/workflows/deploy.yml/badge.svg)](https://github.com/egeaktemur/arcane_abacus/actions/workflows/deploy.yml)

---

## 📜 Overview

**Arcane Abacus** is designed to sit in the middle of a physical game table, tracking scores, enforcing bidding restrictions, and displaying player heraldry colors during tabletop gameplay.

* **Target Device:** iPhone / iOS Safari & Mobile Browsers (Landscape & Portrait optimized)
* **Hosting:** GitHub Pages (Static Web Application)
* **PWA & Native Ready:** Progressive Web App with `manifest.json`, offline standalone mode, and Add to Home Screen support.

---

## 🎨 Theme & Heraldry Colors

* **Aesthetic:** Medieval German Tavern & Parchment (`#F3E8D2`), Dark Wood Tabletop (`#3E2723`), Gold Trim (`#D4AF37`).
* **Typography:** Blackletter *UnifrakturMaguntia* (headings) and *Cinzel* / *Merriweather* (body & numbers).
* **The 6 Player Heraldry Colors:**
  1. 🩸 **Crimson Red** (`#8B0000`)
  2. 🌲 **Forest Green** (`#228B22`)
  3. 🛡️ **Royal Sapphire** (`#0F52BA`)
  4. 👑 **Imperial Gold** (`#D4AF37`)
  5. 🔮 **Amethyst Purple** (`#4B0082`)
  6. ⚔️ **Copper Rust** (`#B7410E`)

---

## ⚔️ Completed Development Roadmap (Phases 1 - 5)

- [x] **Phase 1: Core Logic & Setup**: Dynamic player roster (3–6 wizards), Heraldry Color duplication locking, form validation, and `localStorage` state hook.
- [x] **Phase 2: Bidding Interface**: Interactive Slot Machine Wheel UI, Turn Rotation (`(currentRound - 1) % playerCount`), and dynamic Last Player Restriction Rule.
- [x] **Phase 3: The Circular Table & Resolution**: Trigonometric circular button math ($\theta_i = i \times \frac{360^\circ}{N} - 90^\circ$), tap controls with undo, trick resolution validation, and score hiding.
- [x] **Phase 4: Theming & The Endgame Reveal**: Sequential reveal pacing from Last Place to Winner, screen shake, unfurling heraldry banners, digital falling gold coin confetti, and round history breakdown.
- [x] **Phase 5: Polish & PWA Deployment**:
  - **PWA Manifest & Icons**: Added `manifest.json`, `icon.svg`, Apple iOS touch icon, and standalone web app capability.
  - **Touch & Accessibility Optimization**: Touch-action locks, double-tap prevention, and safe-area inset padding for iPhone Safari.
  - **Add to Home Screen Prompt**: Built-in iOS Safari PWA prompt banner for seamless native mobile installation.
  - **CI/CD Integration**: Automated GitHub Actions workflow compiling and deploying static bundle on push to `main`.

---

## 🛠️ Tech Stack

* **Framework:** React 19 (via Vite 6)
* **Styling:** Tailwind CSS v4
* **Animations & Icons:** Framer Motion & Lucide React & Canvas Confetti
* **PWA Capability:** Web App Manifest + Standalone iOS / Mobile Mode
* **Deployment:** GitHub Actions + GitHub Pages

---

## 🚀 Local Setup & Running

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🌐 Live GitHub Pages Deployment

This repository features automated CI/CD via `.github/workflows/deploy.yml`.

To enable GitHub Pages hosting:
1. Open your repository: `https://github.com/egeaktemur/arcane_abacus`
2. Open **Settings** -> **Pages**.
3. Set **Source** to **GitHub Actions**.
4. Access your live application at:  
   👉 **`https://egeaktemur.github.io/arcane_abacus/`**
