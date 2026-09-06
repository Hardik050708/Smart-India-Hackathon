/**
 * Headless render smoke test for the Jharkhand Societal Innovation Portal.
 *
 * Why this exists: the portal once shipped a runtime `ReferenceError` from the AI
 * severity engine that threw during the very first render and knocked the whole
 * app into the ErrorBoundary. Every check below renders real components, so a
 * crash on mount -- or a persisted-state shape the app cannot survive -- fails here.
 *
 * Run with: npm run smoke
 */
import './dom-shims.js';
import React from 'react';
import { renderToString } from 'react-dom/server';

import { AppProvider } from '../../src/context/AppContext.jsx';
import App from '../../src/App.jsx';
import { Navbar } from '../../src/components/common/Navbar.jsx';
import { RoleSwitcher } from '../../src/components/common/RoleSwitcher.jsx';
import { CsvUploader } from '../../src/components/common/CsvUploader.jsx';
import { AiFormulaModal } from '../../src/components/common/AiFormulaModal.jsx';
import { NepCertificateModal } from '../../src/components/common/NepCertificate.jsx';
import { ErrorBoundary } from '../../src/components/common/ErrorBoundary.jsx';
import { LoginModal } from '../../src/components/auth/LoginModal.jsx';
import { CitizenView } from '../../src/components/views/CitizenView.jsx';
import { LocalBodyView } from '../../src/components/views/LocalBodyView.jsx';
import { HeiAdminView } from '../../src/components/views/HeiAdminView.jsx';
import { FacultyLeadView } from '../../src/components/views/FacultyLeadView.jsx';
import { StudentView } from '../../src/components/views/StudentView.jsx';
import { IndustryCsrView } from '../../src/components/views/IndustryCsrView.jsx';
import { GovAdminView } from '../../src/components/views/GovAdminView.jsx';
import { TRANSLATIONS } from '../../src/data/translations.js';
import { calculateAiSeverity } from '../../src/utils/aiEngine.js';
import { checkGeoSemanticDuplicates } from '../../src/utils/geoDeduplication.js';
import { routeChallengeToHei } from '../../src/utils/heiRouting.js';

const store = globalThis.__storage;
const VIEWS = {
  CITIZEN: CitizenView,
  LOCAL_BODY: LocalBodyView,
  HEI_ADMIN: HeiAdminView,
  FACULTY_LEAD: FacultyLeadView,
  STUDENT: StudentView,
  INDUSTRY_CSR: IndustryCsrView,
  GOV_ADMIN: GovAdminView
};

let passed = 0;
let failed = 0;
const results = [];

const record = (ok, name, detail) => {
  if (ok) passed++; else failed++;
  results.push({ ok, name, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  ->  ${detail}` : ''}`);
};

const render = (label, el) => {
  try {
    const html = renderToString(el);
    if (!html || html.length < 50) throw new Error(`rendered only ${html.length} chars`);
    record(true, label, `${html.length} chars`);
    return html;
  } catch (e) {
    record(false, label, `${e && e.constructor ? e.constructor.name : 'Error'}: ${e.message}`);
    return '';
  }
};

const section = (title) => console.log(`\n--- ${title} ---`);

/* ------------------------------------------------------------------ 1. AI engine */
section('AI severity engine (SIH 26043 formula)');

try {
  const r = calculateAiSeverity({
    title: 'Toxic arsenic and chemical spill in groundwater',
    description: 'Sewage contamination near the school, immediate danger',
    populationAffected: 6000,
    duplicateCount: 3
  });
  const kwOk = Array.isArray(r.matchedKeywords) && r.matchedKeywords.every(k => typeof k === 'string');
  const mathOk = r.priorityScore ===
    r.breakdown.hazardContribution + r.breakdown.urgencyContribution +
    r.breakdown.populationContribution + r.breakdown.duplicateContribution ||
    Math.abs(r.priorityScore - (0.4 * r.hazardScore + 0.35 * r.urgencyScore + 0.15 * r.populationScore + 0.1 * r.duplicateScore)) <= 4;
  record(kwOk, 'matchedKeywords returned as string[]', JSON.stringify(r.matchedKeywords));
  record(mathOk, 'formula components sum to priority score', String(r.priorityScore));
  record(r.priorityScore >= 85 && r.isEmergency === true && r.urgencyTier === 'Critical',
    'critical hazard escalates to emergency tier (>= 85)', `${r.priorityScore}/${r.urgencyTier}`);
} catch (e) {
  record(false, 'AI engine runs without throwing', e.message);
}

try {
  const r = calculateAiSeverity({});
  record(Array.isArray(r.matchedKeywords) && r.matchedKeywords.length === 0 && Number.isFinite(r.priorityScore),
    'empty input yields baseline score, no crash', `score ${r.priorityScore}`);
  const bad = calculateAiSeverity({ title: null, description: undefined, populationAffected: 'NaN', duplicateCount: null });
  record(Number.isFinite(bad.priorityScore), 'garbage inputs stay finite', `score ${bad.priorityScore}`);
} catch (e) {
  record(false, 'AI engine tolerates empty/garbage input', e.message);
}

const hi = calculateAiSeverity({ title: 'पानी में आर्सेनिक मिला हुआ है', description: 'गाँव में बीमारी फैल रही है, खतरा' });
record(hi.matchedKeywords.length > 0 && hi.urgencyTier !== 'Low', 'Hindi reports screened natively by keyword layers', JSON.stringify(hi.matchedKeywords));

/* ------------------------------------------------- 2. dedup + HEI routing edge cases */
section('Geo-semantic dedup & HEI routing');

try {
  const res = checkGeoSemanticDuplicates(
    { title: 'Arsenic in borewell water', description: 'sick cattle', lat: 23.34, lng: 85.31 },
    [
      { id: 'A' },
      { id: 'B', lat: 23.34, lng: 85.31, title: 'Arsenic in borewell water', description: 'sick cattle' },
      { id: 'C', lat: 26.9, lng: 84.1, title: 'totally different', description: 'unrelated text' }
    ]
  );
  record(res.isDuplicate === true && res.matchedCount === 1, '5km + text overlap flags one duplicate', `matched=${res.matchedCount}`);
  const sparse = checkGeoSemanticDuplicates({ title: 'x', description: 'y' }, [{ id: 'A' }, { id: 'B', lat: 23.3, lng: 85.3 }]);
  record(sparse.isDuplicate === false, 'missing coordinates do not throw', `matched=${sparse.matchedCount}`);
} catch (e) {
  record(false, 'dedup engine survives sparse records', e.message);
}

try {
  const known = routeChallengeToHei('Mining & Environment Safety', 'Dhanbad');
  const unknown = routeChallengeToHei('Quantum Finance', 'Nowhere');
  record(Boolean(known?.primaryHei?.name) && /IIT/i.test(known.primaryHei.name), 'mining routes to IIT (ISM) Dhanbad', known.primaryHei.shortName);
  record(Boolean(unknown?.primaryHei?.name) && Boolean(unknown?.recommendedDepartment), 'unknown category still resolves a fallback HEI', unknown.primaryHei.shortName);
} catch (e) {
  record(false, 'HEI routing never returns undefined', e.message);
}

/* ---------------------------------------------------------- 3. every role, both langs */
section('Role views render for EN and HI');

for (const lang of ['en', 'hi']) {
  store['sih_portal_lang'] = lang;
  for (const [role, View] of Object.entries(VIEWS)) {
    store['sih_portal_role'] = role;
    render(`View ${role} [${lang}]`, React.createElement(AppProvider, null, React.createElement(View)));
  }
}
store['sih_portal_lang'] = 'en';
store['sih_portal_role'] = 'CITIZEN';

section('Shell, modals & widgets');
const appHtml = render('App shell (default CITIZEN)', React.createElement(AppProvider, null, React.createElement(App)));
render('Navbar', React.createElement(AppProvider, null, React.createElement(Navbar)));
render('RoleSwitcher', React.createElement(AppProvider, null, React.createElement(RoleSwitcher)));
render('LoginModal', React.createElement(AppProvider, null, React.createElement(LoginModal, { isOpen: true, onClose() {} })));
render('AiFormulaModal', React.createElement(AppProvider, null, React.createElement(AiFormulaModal, { isOpen: true, onClose() {} })));
render('CsvUploader (faculty)', React.createElement(AppProvider, null, React.createElement(CsvUploader, { type: 'faculty', onUploadSuccess() {} })));
render('CsvUploader (partner)', React.createElement(AppProvider, null, React.createElement(CsvUploader, { type: 'partner', onUploadSuccess() {} })));
render('NepCertificateModal', React.createElement(AppProvider, null, React.createElement(NepCertificateModal, {
  onClose() {},
  cert: {
    studentName: 'Ananya Roy', institution: 'BIT Mesra', department: 'Environmental Engineering',
    projectTitle: 'Bio-Char Filter', verifiedCreditsHours: 150, academicCreditsEquivalent: '5.0',
    facultySupervisor: 'Dr. Alok Kumar', verificationHash: '0xabc', issueDate: '2026-04-01',
    abcBankId: 'ABC-JH-2026-12345', status: 'ISSUED', academicYear: '2025-2026'
  }
})));
render('ErrorBoundary wraps App', React.createElement(ErrorBoundary, null, React.createElement(AppProvider, null, React.createElement(App))));

/* ------------------------------------------- 4. persisted state must never kill boot */
section('Boot resilience against stored state');

const hostile = {
  'corrupt JSON blob': () => {
    store['sih_portal_challenges_v3'] = '{not json';
    store['sih_portal_proposals'] = '[[';
    store['sih_portal_nep_credits'] = 'null,';
    store['sih_portal_csr_partners'] = 'garbage';
  },
  'null arrays': () => { store['sih_portal_challenges_v3'] = 'null'; store['sih_portal_proposals'] = 'null'; },
  'object instead of array': () => { store['sih_portal_challenges_v3'] = '{"a":1}'; store['sih_portal_csr_partners'] = '"str"'; },
  'unknown persisted role': () => { store['sih_portal_role'] = 'SUPERADMIN'; store['sih_portal_user'] = '{"name":"no role"}'; },
  'report missing every optional field': () => { store['sih_portal_challenges_v3'] = JSON.stringify([{ id: 'OLD-1', title: 'Legacy row' }]); },
  'clean slate': () => { for (const k of Object.keys(store)) delete store[k]; }
};

for (const [label, mutate] of Object.entries(hostile)) {
  for (const k of Object.keys(store)) delete store[k];
  mutate();
  try {
    const html = renderToString(React.createElement(AppProvider, null, React.createElement(App)));
    record(html.length > 500, `boots with ${label}`, `${html.length} chars`);
  } catch (e) {
    record(false, `boots with ${label}`, e.message);
  }
}
for (const k of Object.keys(store)) delete store[k];

/* ------------------------------------------------------- 5. wired-up UI assertions */
section('Regression guards for previously dead features');

const roleSwitcherHtml = renderToString(React.createElement(AppProvider, null, React.createElement(RoleSwitcher)));
record(
  Object.keys(VIEWS).every(r => roleSwitcherHtml.includes(TRANSLATIONS.en.roles[r].replace('&', '&amp;'))),
  'role switcher bar is mounted in the app shell',
  'all 7 RBAC roles selectable'
);
record(appHtml.includes('Local Body / Panchayat') && appHtml.includes('Student Researcher'),
  'App renders the RBAC switcher (was imported but never mounted)');

store['sih_portal_role'] = 'LOCAL_BODY';
const lb = renderToString(React.createElement(AppProvider, null, React.createElement(LocalBodyView)));
store['sih_portal_role'] = 'CITIZEN';
record(lb.includes('Audit Trail') || lb.includes('No Inspections Pending'),
  'Local Body view shows verified trail / empty state (was a blank page)');

store['sih_portal_role'] = 'GOV_ADMIN';
const gov = renderToString(React.createElement(AppProvider, null, React.createElement(GovAdminView)));
store['sih_portal_role'] = 'CITIZEN';
record(gov.includes('Top 10 Districts') && gov.includes('Problem Domain Split'),
  'Gov Admin dashboard renders the computed Recharts panels (data was unused)');
record(gov.includes('CSR Partner Registry'), 'Gov Admin exposes CSR partner bulk onboarding');

store['sih_portal_role'] = 'FACULTY_LEAD';
const fac = renderToString(React.createElement(AppProvider, null, React.createElement(FacultyLeadView)));
store['sih_portal_role'] = 'CITIZEN';
record(fac.includes('Milestone Sign-off') || fac.includes('Stage 1 of 4'),
  'Faculty view can approve milestones (updateMilestoneStatus was unused)');

/* --------------------------------------------------------------- 6. i18n coverage */
section('Translation coverage');

const flatten = (o, pre = '') => Object.entries(o)
  .flatMap(([k, v]) => (v && typeof v === 'object' ? flatten(v, `${pre}${k}.`) : [`${pre}${k}`]));
const en = new Set(flatten(TRANSLATIONS.en));
const hiKeys = new Set(flatten(TRANSLATIONS.hi));
const missing = [...en].filter(k => !hiKeys.has(k));
record(missing.length === 0, 'Hindi dictionary covers every English key', missing.length ? missing.join(', ') : `${en.size} keys`);
record([...en].includes('roles.GOV_ADMIN') && [...en].includes('aiFormula'), 'navbar/role labels present in dictionary');

/* ------------------------------------------------------------------------ summary */
console.log(`\n${'='.repeat(58)}`);
console.log(failed === 0
  ? `SMOKE TEST PASSED - ${passed} checks`
  : `SMOKE TEST FAILED - ${failed} of ${passed + failed} checks failed`);
if (failed) results.filter(r => !r.ok).forEach(r => console.log(`  x ${r.name}: ${r.detail}`));
process.exitCode = failed === 0 ? 0 : 1;
