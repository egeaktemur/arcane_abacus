# Arcane Abacus

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