# 🔮 Arcane Abacus

> A web-based, mobile-first companion application for the card game **Wizard**, designed with an authentic Medieval German (*Alte Deutsche*) tavern aesthetic.

[![Deploy to GitHub Pages](https://github.com/egeaktemur/arcane_abacus/actions/workflows/deploy.yml/badge.svg)](https://github.com/egeaktemur/arcane_abacus/actions/workflows/deploy.yml)

---

## 📜 Overview

**Arcane Abacus** is designed to sit in the middle of a physical game table, tracking scores, enforcing bidding restrictions, and displaying player heraldry colors during tabletop gameplay.

* **Target Device:** iPhone / iOS Safari & Mobile Browsers (Landscape & Portrait optimized)
* **Hosting:** GitHub Pages (Static Web Application)
* **PWA & Native Ready:** Disables double-tap-to-zoom and unwanted browser selection for a native feel.

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

## ⚔️ Completed Features

- [x] **Phase 1: Core Logic & Setup**: Dynamic player roster (3–6 wizards), Heraldry Color duplication locking, form validation, and `localStorage` persistence hook.
- [x] **Phase 2: Bidding Interface**: Interactive Slot Machine Wheel UI, Turn Rotation (`(currentRound - 1) % playerCount`), and dynamic Last Player Restriction Rule.
- [x] **Phase 3: The Circular Table & Resolution**: Trigonometric circular button math ($\theta_i = i \times \frac{360^\circ}{N} - 90^\circ$), tap controls with undo, trick resolution validation, and score hiding.
- [x] **Phase 4: Theming & The Endgame Reveal**:
  - **Sequential Reveal Pacing**: Suspenseful 3.5s delay pacing from Last Place (lowest score) up to 1st Place (Winner).
  - **Dramatic Visual Effects**: Screen shake for last place, unfurling heraldry banners, and falling digital gold coin confetti for the champion!
  - **Match Breakdown Log**: Round-by-round expandable match table showing bids, actual tricks, and scores earned.
- [x] **Automated CI/CD**: GitHub Actions workflow compiles the app on push to `main` and deploys to GitHub Pages.

---

## 🛠️ Tech Stack

* **Framework:** React 19 (via Vite 6)
* **Styling:** Tailwind CSS v4
* **Animations & Icons:** Framer Motion & Lucide React & Canvas Confetti
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

## 🌐 Deploying to GitHub Pages

This repository includes an automated GitHub Actions workflow (`.github/workflows/deploy.yml`).

### Configuring GitHub Pages Settings:
1. Go to your repository on GitHub: `https://github.com/egeaktemur/arcane_abacus`
2. Open **Settings** -> **Pages** (under the Code and automation section).
3. Under **Build and deployment**:
   * Change **Source** to **GitHub Actions**.
4. Push any commit to the `main` branch to trigger auto-compile and deployment!
