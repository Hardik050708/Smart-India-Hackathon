# Societal Innovation Collaboration Portal - Jharkhand (SIH 2026)

> **Problem Statement ID**: 26043  
> **Nodal Authority**: Government of Jharkhand  
> **Framework Alignment**: NEP 2020 Experiential Learning Framework  
> **Scope**: State-wide (24 Districts)  
> **Frontend Target**: PC, iPad / Tablet, and Mobile Responsive Interactive Testing Application

---

## 🌟 Executive Summary

The **Societal Innovation Collaboration Portal** bridges grassroots civic and agricultural challenges reported by citizens with academic research solutions from Higher Education Institutions (HEIs) and funding/deployment support from Industry & CSR partners, strictly complying with **NEP 2020 Experiential Learning** guidelines.

This application is a **100% complete, standalone interactive frontend platform** containing built-in mock data engines, responsive layout systems, and instant role switching, allowing evaluation across **all 7 system roles** on **PC, iPad, and Mobile phones** without requiring a backend server.

---

## 🎭 7 Role-Based Access Control (RBAC) Switcher

Use the top toolbar to switch between roles instantly:

1. **`CITIZEN`**: Report grassroots challenges with Leaflet GPS pin picker, attach evidence, view real-time AI severity calculations, and upvote local issues.
2. **`LOCAL_BODY`**: Panchayat & Municipal officers validate ground-truth, inspect physical sites, and provide digital sign-offs.
3. **`HEI_ADMIN`**: Manage Higher Education Institutions (BIT Mesra, IIT ISM Dhanbad, NIT Jamshedpur, Birsa Agricultural Univ, Ranchi Univ), bulk upload faculty rosters via CSV, and oversee departments.
4. **`FACULTY_LEAD`**: Review AI-routed challenges, draft multi-disciplinary research proposals, build student teams, and approve NEP credit hours.
5. **`STUDENT`**: Submit 4-stage project milestone deliverables, log field research hours, and view/print official **NEP 2020 Credit Ledger Certificates**.
6. **`INDUSTRY_CSR`**: Explore CSR proposal marketplace (Tata Steel Foundation, Coal India, NTPC), pledge financial grants/mentorship, and track milestone progress.
7. **`GOV_ADMIN`**: State-wide analytics dashboard with interactive 24-district Jharkhand GIS heatmaps, emergency alert manager (score $\ge 85$), and corporate partner CSV uploader.

---

## ⚡ Core Engine Simulators Built Into Frontend

- **AI Seriousness & Severity Assessment Engine**:
  $$\text{Priority Score (0-100)} = (0.40 \times \text{Hazard}) + (0.35 \times \text{Urgency}) + (0.15 \times \text{Population}) + (0.10 \times \text{DuplicateSpike})$$
  Automatically triggers emergency alerts to Gov Admin when score $\ge 85$.
- **Geo-Semantic Deduplication**: Haversine distance ($\le 5\text{ km}$) and text similarity matching.
- **Smart HEI Routing**: Automated matching of challenge category & district to specialized Jharkhand universities.
- **NEP 2020 Experiential Credit Ledger**: Printable credit certificates with verification hashes for Academic Bank of Credits (ABC) compliance ($30\text{ hrs} = 1\text{ credit}$).
- **Bulk CSV Onboarding**: Real-time drag-and-drop CSV preview & parser for faculty and corporate partner ingestion.

---

## 🚀 How to Make Available on GitHub & View on iPad/Mobile/PC

### Option 1: Automatic Push via Batch Helper (Easiest)
1. Open a terminal in this folder or double-click `push_to_github.bat`.
2. Enter your GitHub repository URL (e.g., `https://github.com/YOUR_USERNAME/societal-portal.git`).
3. The script will initialize Git, commit all files, and push to your repository main branch!

### Option 2: Manual Terminal Commands
```bash
git init
git branch -M main
git add .
git commit -m "Deploy Societal Innovation Collaboration Portal"
git remote add origin https://github.com/YOUR_USERNAME/societal-portal.git
git push -u origin main
```

---

## 🌐 Live Online Hosting Instructions (2 Minutes)

To view the app live on your **iPad, iPhone, Android device, or PC**:

### Method A: Vercel (Recommended - Instant 1-Click)
1. Go to [vercel.com/new](https://vercel.com/new).
2. Import your GitHub repository (`societal-portal`).
3. Click **Deploy**. Vercel will build it automatically and give you a shareable `https://societal-portal.vercel.app` link that opens on all mobile devices!

### Method B: GitHub Pages
1. In your GitHub repository, go to **Settings** -> **Pages**.
2. Under **Build and deployment**, set **Source**: `Deploy from a branch`.
3. Choose branch: `main` and folder `/` (or `/dist`), then click **Save**.
4. Access your live site at `https://YOUR_USERNAME.github.io/societal-portal`.

---

## 💻 Local Development Commands

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Compile production bundle
npm run build
```
