# GigFinance — Project Memory & Architecture Context

**Last Updated**: September 23, 2026  
**Project**: GigFinance  
**Author / Lead**: Tinu Rathore  
**Domain**: Entrepreneurship Development Project / Financial Tech for Gig Workers  

---

## 📌 Executive Summary & Purpose

**GigFinance** is a specialized financial tracking and wealth management platform built specifically for Indian gig economy workers (delivery partners, ride-hailing drivers, and freelance contractors working on platforms like Swiggy, Zomato, Uber, Zepto, Blinkit, and Urban Company).

### Core Problem Solved
Gig workers receive volatile daily/weekly payouts from multiple fragmented platforms while bearing vehicle operating costs (petrol, regular bike servicing, toll, mobile data). Tracking net retained cash, operational expenses per kilometer, and maintaining an emergency runway is difficult without a tailored, simple tool.

---

## 🔄 Major Architectural Decisions & Pivots

1. **Pivot from Mobile App to Website**:
   * *Initial State*: Built as an Expo / React Native prototype targeted for Android devices.
   * *User Directive*: Explicit instruction to build and maintain **GigFinance as a website, not a mobile app**.
   * *Resolution*: Created a standalone, highly responsive web application in [`web/`](./web) that runs directly in any modern browser without needing emulators or Expo Go.

2. **Technology Stack**:
   * **Core**: Semantic HTML5 and modular Vanilla JavaScript (ES Modules).
   * **Styling**: Pure **Vanilla CSS** (`web/css/styles.css`) utilizing custom HSL color tokens, responsive CSS grid/flexbox, glassmorphic card surfaces, and dark/light mode themes. (No TailwindCSS as per system guidelines).
   * **Visualization Engine**: Lightweight native **SVG Charts** (`web/js/charts.js`) for the 7-Day Inflow vs Outflow Trend line and Expense Donut breakdown, completely avoiding heavy third-party npm dependencies.
   * **Persistence**: Client-side `localStorage` data layer (`web/js/data.js`) with initial seed transactions, reset capabilities, and zero external tracking.

---

## 📁 Repository Structure

```text
GigFinance/
├── memory.md                # Persistent project context, rules, and architecture (this file)
├── README.md                # Project documentation and setup instructions
├── web/                     # Active Web Application
│   ├── index.html           # Main semantic entry point & accessible dialogs
│   ├── css/
│   │   └── styles.css       # Complete design system, dark/light theme, responsive layout
│   └── js/
│       ├── app.js           # UI controller, event listeners, calculators, and search
│       ├── data.js          # Seed data, calculation engine, storage, and CSV export
│       └── charts.js        # Native SVG trend line & expense donut renderers
├── preview/                 # Interactive mobile mockup preview (secondary preview tool)
│   └── index.html
├── src/                     # Legacy React Native components (reference only)
│   ├── components/
│   ├── data/
│   └── theme/
├── App.js                   # Legacy React Native root component
└── package.json             # NPM package configuration
```

---

## ⚡ Active Features Built

* **💼 Core Financial Dashboard**:
  * **Net Savings**: Retained surplus cash calculation with percentage of gross gig revenue saved.
  * **Inflow & Outflow Cards**: Real-time totals for earnings vs operational costs.
  * **Emergency Runway Buffer**: 3-month benchmark calculator to survive bike breakdowns or off-peak seasons.
* **🎯 Daily Shift Target Tracker**:
  * Visual progress bar comparing today's earnings to a daily milestone (e.g. ₹2,000/day).
  * In-place target editor with persistent storage.
* **📊 Visual Native SVG Analytics**:
  * **7-Day Trend Chart**: Responsive SVG comparing daily inflow vs operational expenses with interactive hover tooltips.
  * **Expense Distribution Donut**: Percentage breakdown across Fuel, Bike Servicing, Food on Shift, Mobile Data, and Tolls.
  * **Platform Contribution Badges**: Revenue split across Swiggy, Zomato, Uber, Zepto, Blinkit, and Freelancing.
* **📋 Filterable Transaction Ledger & CSV Export**:
  * Instant search across title, notes, and categories.
  * Flow filter pills (`All Records`, `Inflow Only`, `Outflow Only`).
  * One-click **CSV Export** for bank loan proofs and income tax filing.
  * Delete and add actions with instant state recalculation.
* **🔐 Login & Occupation Selection System**:
  * **2-Step Onboarding**: Step 1 captures worker credentials (name, phone, city) or signs in with saved accounts; Step 2 prompts for primary occupation (Aap Kya Kaam Karte Hain?).
  * **Occupation Taxonomy**:
    * 🛵 **Food & Grocery Delivery Boy / Partner** (Swiggy, Zomato, Zepto, Blinkit)
    * 💻 **Freelancer / Digital Specialist** (Web dev, UI design, video editing, writing)
    * 🚗 **Cab & Auto Driver** (Uber, Ola, Rapido, BluSmart)
    * 🛠️ **Home Services & Repairs** (Urban Company, Electrician, Plumber)
    * 📦 **Logistics & Courier Delivery** (Porter, Shadowfax, Delhivery)
    * ✍️ **Custom Occupation**: Custom text input to define any occupation.
  * **Permanent Data Persistence**: Stores user profile and registered account history in `localStorage` (`gigfinance_user_profile_v1` & `gigfinance_users_registry_v1`).
  * **Live Occupation Management**: Direct `💼 Change Occupation` button on the daily goal banner and profile dropdown menu allowing workers to switch or customize their role anytime.
  * **⚡ 1-Click Demo Profiles**: Quick testing profiles for Ramesh (Delivery Boy), Pooja (Freelancer), and Harpreet (Cab Driver).
* **⛽ Gig Worker Toolkit**:
  * **Fuel & Mileage Cost Calculator**: Live shift fuel cost estimation and net vehicle operating rate per km.
  * **Tax & Health Advisor**: Guidance on Section 44ADA presumptive taxation and multi-app load balancing.
* **🌓 Dark & Light Mode**:
  * Single-click toggle between Slate Dark Mode (`#0B0F19`) and Clean Light Mode (`#F8FAFC`).

---

## ⚙️ Running Locally

The web application is served locally on port **3000**:
```bash
python3 -m http.server 3000 --directory web
```
Access in browser: **`http://localhost:3000`**

### Storage Schema (Browser `localStorage`)
* `gigfinance_user_profile_v1`: Current active user session (name, phone, city, occupationId, customOccupation, occupationTitle, dailyTarget, isLoggedIn).
* `gigfinance_users_registry_v1`: Array of registered accounts remembered on this device for seamless sign-in.
* `gigfinance_web_data_v1`: Array of financial transactions (income & expense).
* `gigfinance_web_goal_v1`: Daily target goal amount.
* `gigfinance_theme`: `dark` | `light`.

---

## 🔮 Future Roadmap & Considerations

1. **Progressive Web App (PWA)**:
   * Add `manifest.json` and a service worker for offline installation on Android/iOS home screens.
2. **Multilingual Support**:
   * Add localization for Hindi (हिन्दी), Tamil (தமிழ்), Telugu (తెలుగు), and Kannada (ಕನ್ನಡ) for vernacular gig workers.
3. **Receipt & Payout OCR**:
   * Client-side OCR to scan petrol slips and weekly gig payout summary screenshots.
4. **PDF Reports**:
   * Formatted monthly financial health summary card for easy sharing on WhatsApp.
