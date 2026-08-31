# Master System Specification & Prompt: Societal Innovation Collaboration Portal

> **Problem Statement ID**: 26043  
> **Nodal Authority**: Government of Jharkhand  
> **Framework Alignment**: NEP 2020 Experiential Learning Framework  
> **Scope**: State-wide (24 Districts of Jharkhand)  
> **Target Devices**: PC, iPad / Tablet, and Mobile Phone Responsive Interactive Portal

---

## 🎨 Distinctive UI/UX Design System: "Mineral Slate & Radiant Gold"

This portal utilizes a high-contrast, state-level government design language that eliminates generic AI aesthetics:

- **Dominant Canvas**: Deep Mineral Slate (`#090d16` & `#0f172a`)
- **Primary Accent**: Jharkhand Emerald Green (`#10b981`)
- **State Sovereign Gold**: `#fbbf24` (Used for NEP credits, active role badges, and CSR funding progress)
- **Emergency Crimson Accent**: `#ef4444` (Pulsing high-priority alerts for AI scores $\ge 85$)
- **Glassmorphism Panels**: Translucent cards with `backdrop-blur-xl`, subtle 1px slate borders, and glowing drop shadows.
- **Typography Pairings**: `Plus Jakarta Sans` for titles & UI text + `Fira Code` for monospace IDs, formulas, and verification hashes.
- **Motion System**: Framer Motion layout pill animations (`layoutId="activeRoleBg"`) providing fluid touch feedback on iPad & Mobile screens.

---

## 🎭 7 Role-Based Access Control (RBAC) Switcher

1. **`CITIZEN`**: Report grassroots challenges with Leaflet GPS pin picker, attach evidence, view real-time AI severity calculations, and upvote local issues.
2. **`LOCAL_BODY`**: Panchayat & Municipal officers validate ground-truth, inspect physical sites, and provide digital sign-offs.
3. **`HEI_ADMIN`**: Manage Higher Education Institutions (BIT Mesra, IIT ISM Dhanbad, NIT Jamshedpur, Birsa Agricultural Univ, Ranchi Univ), bulk upload faculty rosters via CSV, and oversee departments.
4. **`FACULTY_LEAD`**: Review AI-routed challenges, draft multi-disciplinary research proposals, build student teams, and approve NEP credit hours.
5. **`STUDENT`**: Submit 4-stage project milestone deliverables, log field research hours, and view/print official **NEP 2020 Credit Ledger Certificates**.
6. **`INDUSTRY_CSR`**: Explore CSR proposal marketplace (Tata Steel Foundation, Coal India, NTPC), pledge financial grants/mentorship, and track milestone progress.
7. **`GOV_ADMIN`**: State-wide analytics dashboard with interactive 24-district Jharkhand GIS heatmaps, emergency alert manager (score $\ge 85$), and corporate partner CSV uploader.

---

## ⚡ Core Engines & Technical Formulas

- **AI 3-Layer Severity Formula**:
  $$\text{Priority Score (0-100)} = (0.40 \times \text{Hazard}) + (0.35 \times \text{Urgency}) + (0.15 \times \text{Population}) + (0.10 \times \text{DuplicateSpike})$$
- **Geo-Semantic Deduplication**: Haversine distance ($\le 5\text{ km}$) + similarity matching.
- **Smart HEI Routing**: Automated matching of challenge category & district to Jharkhand HEIs.
- **NEP 2020 Credit Ledger**: Printable student certificates ($30\text{ field hrs} = 1\text{ NEP credit}$).

---

## 🌐 Instant Online Preview Links & Commands

### 1. Push to GitHub
```bash
git push -u origin main --force
```

### 2. View Live via GitHack on iPad / Mobile / PC
🔗 **`https://raw.githack.com/Hardik050708/Smart-India-Hackathon/main/dist/index.html`**
