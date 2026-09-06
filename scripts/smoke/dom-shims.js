/**
 * Minimal DOM/browser stubs for the headless render smoke test.
 * The portal is a browser app, so we fake just enough of `window` / `document` /
 * `localStorage` for React + framer-motion + Leaflet to evaluate outside a browser.
 */

const store = {};

globalThis.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
  clear: () => { for (const k of Object.keys(store)) delete store[k]; }
};

/** Raw handle for tests that need to seed / poison persisted state. */
globalThis.__storage = store;

const fakeEl = () => new Proxy(
  {
    style: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    setAttribute() {},
    removeAttribute() {},
    getAttribute() { return null; },
    appendChild() {},
    removeChild() {},
    insertBefore() {},
    addEventListener() {},
    removeEventListener() {},
    querySelector() { return null; },
    querySelectorAll() { return []; }
  },
  { get: (t, p) => (p in t ? t[p] : undefined), set: (t, p, v) => { t[p] = v; return true; } }
);

Object.defineProperty(globalThis, 'navigator', {
  value: { userAgent: 'node', language: 'en', platform: 'linux', maxTouchPoints: 0, onLine: true, hardwareConcurrency: 4 },
  writable: true,
  configurable: true
});

globalThis.screen = { width: 1280, height: 800 };
globalThis.devicePixelRatio = 1;
globalThis.matchMedia = () => ({
  matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; }
});
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } };
globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

globalThis.document = {
  documentElement: fakeEl(),
  body: fakeEl(),
  head: fakeEl(),
  createElement: () => fakeEl(),
  createElementNS: () => fakeEl(),
  createTextNode: () => ({}),
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener() {},
  removeEventListener() {},
  fonts: { ready: Promise.resolve(), load: () => Promise.resolve() }
};

globalThis.window = {
  localStorage: globalThis.localStorage,
  document: globalThis.document,
  location: { reload() {}, href: 'http://localhost/', origin: 'http://localhost', search: '', hash: '' },
  navigator: globalThis.navigator,
  screen: globalThis.screen,
  devicePixelRatio: 1,
  innerWidth: 1280,
  innerHeight: 800,
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() { return false; },
  matchMedia: globalThis.matchMedia,
  ResizeObserver: globalThis.ResizeObserver,
  IntersectionObserver: globalThis.IntersectionObserver,
  requestAnimationFrame: globalThis.requestAnimationFrame,
  cancelAnimationFrame: globalThis.cancelAnimationFrame,
  getComputedStyle: () => ({ getPropertyValue: () => '' }),
  setTimeout, clearTimeout, setInterval, clearInterval,
  print() {}
};

globalThis.getComputedStyle = globalThis.window.getComputedStyle;
if (!globalThis.SVGElement) globalThis.SVGElement = class SVGElement {};
if (!globalThis.HTMLElement) globalThis.HTMLElement = class HTMLElement {};
if (!globalThis.HTMLCanvasElement) globalThis.HTMLCanvasElement = class HTMLCanvasElement {};
globalThis.URL.createObjectURL = globalThis.URL.createObjectURL || (() => 'blob:fake');
globalThis.URL.revokeObjectURL = globalThis.URL.revokeObjectURL || (() => {});
