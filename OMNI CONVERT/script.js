const converterConfig = {
  data: {
    title: 'Data Storage',
    defaults: { fromValue: '1024', fromUnit: 'MB', toUnit: 'GB' },
    units: [
      ['bit', 'Bits'],
      ['B', 'Bytes'],
      ['KB', 'Kilobytes'],
      ['MB', 'Megabytes'],
      ['GB', 'Gigabytes'],
      ['TB', 'Terabytes'],
      ['PB', 'Petabytes'],
      ['Kbit', 'Kilobits'],
      ['Mbit', 'Megabits'],
      ['Gbit', 'Gigabits'],
      ['Tbit', 'Terabits']
    ],
    factor: {
      bit: 0.125,
      B: 1,
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024,
      TB: 1024 * 1024 * 1024 * 1024,
      PB: 1024 * 1024 * 1024 * 1024 * 1024,
      Kbit: 1024 / 8,
      Mbit: (1024 * 1024) / 8,
      Gbit: (1024 * 1024 * 1024) / 8,
      Tbit: (1024 * 1024 * 1024 * 1024) / 8
    },
    quick: ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  },
  length: {
    title: 'Length',
    defaults: { fromValue: '1', fromUnit: 'm', toUnit: 'ft' },
    units: [
      ['mm', 'Millimeters'],
      ['cm', 'Centimeters'],
      ['m', 'Meters'],
      ['km', 'Kilometers'],
      ['in', 'Inches'],
      ['ft', 'Feet'],
      ['yd', 'Yards'],
      ['mi', 'Miles']
    ],
    factor: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 },
    quick: ['mm', 'cm', 'm', 'km', 'in', 'ft']
  },
  mass: {
    title: 'Weight & Mass',
    defaults: { fromValue: '1', fromUnit: 'kg', toUnit: 'lb' },
    units: [
      ['mg', 'Milligrams'],
      ['g', 'Grams'],
      ['kg', 'Kilograms'],
      ['lb', 'Pounds'],
      ['oz', 'Ounces'],
      ['t', 'Metric Tons'],
      ['st', 'Stone']
    ],
    factor: { mg: 0.000001, g: 0.001, kg: 1, lb: 0.45359237, oz: 0.028349523125, t: 1000, st: 6.35029318 },
    quick: ['g', 'kg', 'lb', 'oz', 't']
  },
  temperature: {
    title: 'Temperature',
    defaults: { fromValue: '100', fromUnit: 'c', toUnit: 'f' },
    units: [
      ['c', 'Celsius'],
      ['f', 'Fahrenheit'],
      ['k', 'Kelvin'],
      ['r', 'Rankine']
    ],
    quick: ['c', 'f', 'k']
  },
  currency: {
    title: 'Currency',
    defaults: { fromValue: '100', fromUnit: 'USD', toUnit: 'INR' },
    units: [
      ['USD', 'US Dollar'],
      ['EUR', 'Euro'],
      ['GBP', 'British Pound'],
      ['JPY', 'Japanese Yen'],
      ['INR', 'Indian Rupee'],
      ['AUD', 'Australian Dollar'],
      ['CAD', 'Canadian Dollar'],
      ['CHF', 'Swiss Franc'],
      ['CNY', 'Chinese Yuan'],
      ['SGD', 'Singapore Dollar']
    ],
    rates: {
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
      JPY: 157.5,
      INR: 83.22,
      AUD: 1.5,
      CAD: 1.36,
      CHF: 0.89,
      CNY: 7.24,
      SGD: 1.35
    },
    quick: ['USD', 'EUR', 'GBP', 'INR', 'JPY']
  },
  speed: {
    title: 'Speed',
    defaults: { fromValue: '1', fromUnit: 'kmh', toUnit: 'mph' },
    units: [
      ['mps', 'Meters/Second'],
      ['kmh', 'Kilometers/Hour'],
      ['mph', 'Miles/Hour'],
      ['knot', 'Knots'],
      ['fps', 'Feet/Second']
    ],
    factor: { mps: 1, kmh: 0.2777777778, mph: 0.44704, knot: 0.5144444444, fps: 0.3048 },
    quick: ['mps', 'kmh', 'mph', 'knot']
  },
  number: {
    title: 'Number System',
    defaults: { fromValue: '255', fromUnit: 'dec', toUnit: 'hex' },
    units: [
      ['bin', 'Binary'],
      ['oct', 'Octal'],
      ['dec', 'Decimal'],
      ['hex', 'Hexadecimal']
    ],
    quick: ['bin', 'oct', 'dec', 'hex']
  },
  color: {
    title: 'Colour Code',
    defaults: { fromValue: '#60EAFF', fromUnit: 'hex', toUnit: 'rgb' },
    units: [
      ['hex', 'HEX'],
      ['rgb', 'RGB'],
      ['hsl', 'HSL']
    ],
    quick: ['hex', 'rgb', 'hsl']
  }
};

/* Complete CSS Color Dictionary */
const cssColorNames = {
  snow: '#FFFAFA', ghostwhite: '#F8F8FF', whitesmoke: '#F5F5F5', gainsboro: '#DCDCDC',
  lightgray: '#D3D3D3', lightgrey: '#D3D3D3', darkgray: '#A9A9A9', darkgrey: '#A9A9A9',
  dimmedgray: '#696969', dimgray: '#696969', charcoal: '#36454F', slategray: '#708090',
  slate: '#708090', salmon: '#FA8072', darksalmon: '#E9967A', lightsalmon: '#FFA07A',
  lightcoral: '#F08080', indianred: '#CD5C5C', firebrick: '#B22222', darkred: '#8B0000',
  deeppink: '#FF1493', hotpink: '#FF69B4', lightpink: '#FFB6C1', darkorange: '#FF8C00',
  coralred: '#FF4500', orangered: '#FF4500', sandybrown: '#F4A460', burlywood: '#DEB887',
  goldenrod: '#DAA520', darkgoldenrod: '#B8860B', peru: '#CD853F', chocolate: '#D2691E',
  saddlebrown: '#8B4513', sienna: '#A0522D', lemonchiffon: '#FFFACD', papayawhip: '#FFEFD5',
  khaki: '#F0E68C', darkkhaki: '#BDB76B', moccasin: '#FFE4B5', chartreuse: '#7FFF00',
  greenyellow: '#ADFF2F', lawngreen: '#7CFC00', limegreen: '#32CD32', forestgreen: '#228B22',
  darkgreen: '#006400', seagreen: '#2E8B57', mediumseagreen: '#3CB371', springgreen: '#00FF7F',
  mint: '#98FF98', darkturquoise: '#00CED1', mediumturquoise: '#48D1CC', cadetblue: '#5F9EA0',
  darkcyan: '#008B8B', powderblue: '#B0E0E6', lightblue: '#ADD8E6', deepskyblue: '#00BFFF',
  dodgerblue: '#1E90FF', cornflowerblue: '#6495ED', steelblue: '#4682B4', royalblue: '#4169E1',
  mediumblue: '#0000CD', darkblue: '#00008B', midnightblue: '#191970', mediumpurple: '#9370DB',
  blueviolet: '#8A2BE2', darkviolet: '#9400D3', darkmagenta: '#8B008B', darkorchid: '#9932CC',
  mediumorchid: '#BA55D3', plum: '#DDA0DD', thistle: '#D8BFD8', lavender: '#E6E6FA'
};

const state = {
  activeType: 'data',
  fromValue: '1024',
  fromUnit: 'MB',
  toUnit: 'GB'
};

const tabButtons = document.querySelectorAll('.tab-button');
const searchInput = document.getElementById('searchInput');
const fromValue = document.getElementById('fromValue');
const toValue = document.getElementById('toValue');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');
const converterTitle = document.getElementById('converterTitle');
const equivalentList = document.getElementById('equivalentList');
const swapButton = document.getElementById('swapButton');
const favTitleBtn = document.getElementById('favTitleBtn');

/* ================= HISTORY AUTOMATIC SAVING LOGIC ================= */

const HISTORY_STORAGE_KEY = 'omniconvert_history';
const MAX_HISTORY_ITEMS = 50;
let historySaveTimeout = null;

function saveToHistory() {
  const currentVal = fromValue.value.trim();
  if (!currentVal) return;

  const currentCategory = converterTitle.textContent.trim();
  const fromUnitLabel = fromUnit.options[fromUnit.selectedIndex]?.text || fromUnit.value;
  const toUnitLabel = toUnit.options[toUnit.selectedIndex]?.text || toUnit.value;
  const resultVal = toValue.value;

  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    let history = stored ? JSON.parse(stored) : [];

    // Check if duplicate of the most recent item to avoid identical continuous entries
    if (history.length > 0) {
      const top = history[0];
      if (
        top.category === currentCategory &&
        top.fromValue === currentVal &&
        top.fromUnit === fromUnitLabel &&
        top.toUnit === toUnitLabel &&
        top.toValue === resultVal
      ) {
        return; // Skip duplicate
      }
    }

    const newEntry = {
      id: Date.now(),
      category: currentCategory,
      fromValue: currentVal,
      fromUnit: fromUnitLabel,
      toValue: resultVal,
      toUnit: toUnitLabel,
      timestamp: new Date().toISOString()
    };

    history.unshift(newEntry);

    if (history.length > MAX_HISTORY_ITEMS) {
      history.pop();
    }

    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error("Failed to save conversion history:", e);
  }
}

// Debounce helper to prevent saving every single keystroke while typing
function triggerAutoSaveHistory() {
  clearTimeout(historySaveTimeout);
  historySaveTimeout = setTimeout(() => {
    saveToHistory();
  }, 1000); // Saves 1 second after user stops typing or immediately on select change
}

/* ================= FAVOURITES STAR LOGIC ================= */

function getFavorites() {
  const stored = localStorage.getItem('omni_favorites');
  return stored ? JSON.parse(stored) : [];
}

function updateStarState() {
  if (!favTitleBtn || !converterTitle) return;
  const favorites = getFavorites();
  const currentCategory = converterTitle.textContent.trim();
  const isFav = favorites.some(item => item.category === currentCategory);
  
  const icon = favTitleBtn.querySelector('i');
  if (icon) {
    if (isFav) {
      favTitleBtn.classList.add('active');
      favTitleBtn.setAttribute('data-tooltip', 'Remove from Favourites');
      favTitleBtn.setAttribute('aria-label', 'Remove from Favourites');
      icon.className = 'fa-solid fa-star';
    } else {
      favTitleBtn.classList.remove('active');
      favTitleBtn.setAttribute('data-tooltip', 'Add to Favourites');
      favTitleBtn.setAttribute('aria-label', 'Add to Favourites');
      icon.className = 'fa-regular fa-star';
    }
  }
}

if (favTitleBtn) {
  favTitleBtn.addEventListener('click', () => {
    let favorites = getFavorites();
    const currentCategory = converterTitle.textContent.trim();

    const fromText = fromUnit.options[fromUnit.selectedIndex]?.text || fromUnit.value;
    const toText = toUnit.options[toUnit.selectedIndex]?.text || toUnit.value;

    const existingIndex = favorites.findIndex(item => item.category === currentCategory);

    if (existingIndex > -1) {
      favorites.splice(existingIndex, 1);
    } else {
      favorites.push({
        id: Date.now(),
        category: currentCategory,
        from: fromText,
        to: toText
      });
    }

    localStorage.setItem('omni_favorites', JSON.stringify(favorites));
    updateStarState();
  });
}

/* ================= COLOR HELPER COMPUTATIONS ================= */

function nameToHex(colorName) {
  const clean = colorName.trim().toLowerCase();
  if (cssColorNames[clean]) return cssColorNames[clean];

  const dummy = document.createElement('div');
  dummy.style.color = clean;
  document.body.appendChild(dummy);
  const cs = window.getComputedStyle(dummy).color;
  document.body.removeChild(dummy);

  const match = cs.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toUpperCase();
  }
  return null;
}

function hexToName(hex) {
  const cleanHex = hex.toUpperCase();
  for (const [name, value] of Object.entries(cssColorNames)) {
    if (value.toUpperCase() === cleanHex) return name;
  }
  return 'Custom Shade';
}

function updateColorSwatch(colorVal) {
  const colorPreviewCard = document.getElementById('colorPreviewCard');
  const colorSwatch = document.getElementById('colorSwatch');
  const colorNameDisplay = document.getElementById('colorNameDisplay');
  const colorHexDisplay = document.getElementById('colorHexDisplay');

  if (!colorPreviewCard) return;

  if (state.activeType !== 'color') {
    colorPreviewCard.style.display = 'none';
    return;
  }

  colorPreviewCard.style.display = 'block';

  let hex = parseColorToHex(colorVal, fromUnit.value);
  if (!hex || (hex === '#000000' && colorVal.toLowerCase() !== 'black' && colorVal !== '#000000')) {
    hex = '#60EAFF';
  }

  colorSwatch.style.backgroundColor = hex;
  colorSwatch.style.boxShadow = `0 4px 14px ${hex}88`;
  colorHexDisplay.textContent = hex;
  colorNameDisplay.textContent = hexToName(hex);
}

function parseColorToHex(val, format) {
  const rgb = parseColorValue(val, format);
  return rgbToHex(rgb);
}

/* ================= STANDARD CONVERSION COMPUTATIONS ================= */

function toBase(value, fromUnitKey, config) {
  if (config.factor) {
    return Number(value) * (config.factor[fromUnitKey] || 1);
  }
  return Number(value);
}

function fromBase(value, toUnitKey, config) {
  if (config.factor) {
    return Number(value) / (config.factor[toUnitKey] || 1);
  }
  return Number(value);
}

function convertStandard(config, value, fromKey, toKey) {
  const base = toBase(value, fromKey, config);
  return fromBase(base, toKey, config);
}

function convertTemp(value, fromKey, toKey) {
  const cFrom = {
    c: (v) => v,
    f: (v) => (v - 32) * (5 / 9),
    k: (v) => v - 273.15,
    r: (v) => (v - 491.67) * (5 / 9)
  };
  const cTo = {
    c: (v) => v,
    f: (v) => (v * 9) / 5 + 32,
    k: (v) => v + 273.15,
    r: (v) => (v + 273.15) * 9 / 5
  };
  return cTo[toKey](cFrom[fromKey](Number(value)));
}

function convertCurrency(value, fromKey, toKey) {
  const rates = converterConfig.currency.rates;
  const fromRate = rates[fromKey] || 1;
  const toRate = rates[toKey] || 1;
  return Number(value) * (toRate / fromRate);
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return '—';
  const abs = Math.abs(value);
  if (abs >= 1e9 || (abs > 0 && abs < 1e-3)) {
    return Number(value).toExponential(4).replace(/\.?0+e/, 'e');
  }

  if (abs >= 1000) {
    return Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  const decimals = abs >= 1 ? 4 : 6;
  return Number(value.toFixed(decimals)).toLocaleString(undefined, { maximumFractionDigits: decimals });
}

function convertNumberSystem(value, fromKey, toKey) {
  const trimmed = String(value).trim();
  if (!trimmed) return '0';

  const baseMap = { bin: 2, oct: 8, dec: 10, hex: 16 };
  const decimalValue = parseInt(trimmed, baseMap[fromKey] || 10);

  if (Number.isNaN(decimalValue)) return '0';
  return decimalValue.toString(baseMap[toKey] || 10);
}

function parseColorValue(value, format) {
  if (format === 'hex') {
    const clean = String(value).replace('#', '').trim();
    const normalized = clean.length === 3 ? clean.split('').map((ch) => ch + ch).join('') : clean;
    if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
      return { r: 0, g: 0, b: 0 };
    }
    const int = Number.parseInt(normalized, 16);
    return {
      r: (int >> 16) & 255,
      g: (int >> 8) & 255,
      b: int & 255
    };
  }

  if (format === 'rgb') {
    const match = String(value).match(/rgba?\s*\(([^)]+)\)/i);
    if (!match) return { r: 0, g: 0, b: 0 };
    const [r, g, b] = match[1].split(',').map((part) => Number(part.trim()));
    return { r, g, b };
  }

  if (format === 'hsl') {
    const match = String(value).match(/hsla?\s*\(([^)]+)\)/i);
    if (!match) return { r: 0, g: 0, b: 0 };
    const [h, s, l] = match[1].split(',').map((part) => part.trim());
    const H = Number(h) % 360;
    const S = Number(s.replace('%', '')) / 100;
    const L = Number(l.replace('%', '')) / 100;

    const C = (1 - Math.abs(2 * L - 1)) * S;
    const X = C * (1 - Math.abs(((H / 60) % 2) - 1));
    const m = L - C / 2;

    let r = 0, g = 0, b = 0;

    if (H >= 0 && H < 60) { r = C; g = X; b = 0; }
    else if (H < 120) { r = X; g = C; b = 0; }
    else if (H < 180) { r = 0; g = C; b = X; }
    else if (H < 240) { r = 0; g = X; b = C; }
    else if (H < 300) { r = X; g = 0; b = C; }
    else { r = C; g = 0; b = X; }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  }

  return { r: 0, g: 0, b: 0 };
}

function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function rgbToHsl({ r, g, b }) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const diff = max - min;
  const L = (max + min) / 2;
  const S = diff === 0 ? 0 : diff / (1 - Math.abs(2 * L - 1));

  let H = 0;
  if (diff !== 0) {
    switch (max) {
      case red: H = 60 * (((green - blue) / diff) % 6); break;
      case green: H = 60 * ((blue - red) / diff + 2); break;
      default: H = 60 * ((red - green) / diff + 4); break;
    }
  }

  return `hsl(${Math.round((H + 360) % 360)}, ${Math.round(S * 100)}%, ${Math.round(L * 100)}%)`;
}

function convertColor(value, fromKey, toKey) {
  const rgb = parseColorValue(value, fromKey);
  if (toKey === 'hex') return rgbToHex(rgb);
  if (toKey === 'rgb') return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  if (toKey === 'hsl') return rgbToHsl(rgb);
  return value;
}

function convertValue(type, value, fromKey, toKey) {
  if (type === 'temperature') return convertTemp(value, fromKey, toKey);
  if (type === 'currency') return convertCurrency(value, fromKey, toKey);
  if (type === 'data') return convertStandard(converterConfig.data, value, fromKey, toKey);
  if (type === 'length' || type === 'mass' || type === 'speed') {
    return convertStandard(converterConfig[type], value, fromKey, toKey);
  }
  if (type === 'number') return convertNumberSystem(value, fromKey, toKey);
  if (type === 'color') return convertColor(value, fromKey, toKey);
  return value;
}

/* ================= UI CONTROLS & RENDERING ================= */

function populateSelectors(type) {
  const config = converterConfig[type];
  fromUnit.innerHTML = '';
  toUnit.innerHTML = '';

  config.units.forEach(([unitValue, label]) => {
    const fromOption = document.createElement('option');
    fromOption.value = unitValue;
    fromOption.textContent = label + ' (' + unitValue.toUpperCase() + ')';
    fromUnit.appendChild(fromOption);

    const toOption = document.createElement('option');
    toOption.value = unitValue;
    toOption.textContent = label + ' (' + unitValue.toUpperCase() + ')';
    toUnit.appendChild(toOption);
  });

  fromUnit.value = config.defaults.fromUnit;
  toUnit.value = config.defaults.toUnit;
  state.fromUnit = config.defaults.fromUnit;
  state.toUnit = config.defaults.toUnit;
}

function renderEquivalents() {
  const type = state.activeType;
  const config = converterConfig[type];
  const sourceValue = fromValue.value || config.defaults.fromValue;
  const sourceUnit = fromUnit.value || config.defaults.fromUnit;
  const items = config.quick || [];

  equivalentList.innerHTML = '';

  items.forEach((unitKey) => {
    if (unitKey === sourceUnit) return;
    const unitLabel = (config.units.find(([key]) => key === unitKey) || [unitKey, unitKey])[1];
    const converted = convertValue(type, sourceValue, sourceUnit, unitKey);

    const item = document.createElement('div');
    item.className = 'equivalent-item';

    const label = document.createElement('span');
    label.textContent = unitLabel;

    const result = document.createElement('strong');
    result.textContent = type === 'number' || type === 'color' ? converted : formatNumber(converted);

    item.appendChild(label);
    item.appendChild(result);
    equivalentList.appendChild(item);
  });
}

function renderConversion() {
  const type = state.activeType;
  const config = converterConfig[type];
  const value = fromValue.value === '' ? config.defaults.fromValue : fromValue.value;

  const converted = convertValue(type, value, fromUnit.value || config.defaults.fromUnit, toUnit.value || config.defaults.toUnit);

  if (type === 'number' || type === 'color') {
    toValue.value = converted;
  } else {
    toValue.value = formatNumber(converted);
  }

  renderEquivalents();
  
  if (type === 'color') {
    updateColorSwatch(fromValue.value);
  } else {
    const colorPreviewCard = document.getElementById('colorPreviewCard');
    if (colorPreviewCard) colorPreviewCard.style.display = 'none';
  }
}

function setActiveType(type) {
  const config = converterConfig[type];
  if (!config) return;

  state.activeType = type;
  state.fromValue = config.defaults.fromValue;
  state.fromUnit = config.defaults.fromUnit;
  state.toUnit = config.defaults.toUnit;

  tabButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.type === type);
  });

  converterTitle.textContent = config.title;

  const inputType = type === 'number' || type === 'color' ? 'text' : 'number';
  fromValue.type = inputType;
  fromValue.value = String(config.defaults.fromValue);

  populateSelectors(type);
  renderConversion();
  updateStarState();
}

function attachEvents() {
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setActiveType(button.dataset.type);
      triggerAutoSaveHistory();
    });
  });

  fromValue.addEventListener('input', () => {
    state.fromValue = fromValue.value;
    renderConversion();
    triggerAutoSaveHistory();
  });

  fromUnit.addEventListener('change', () => {
    state.fromUnit = fromUnit.value;
    renderConversion();
    triggerAutoSaveHistory();
    
    const favorites = getFavorites();
    const currentCategory = converterTitle.textContent.trim();
    const existingIndex = favorites.findIndex(item => item.category === currentCategory);
    if (existingIndex > -1) {
      favorites[existingIndex].from = fromUnit.options[fromUnit.selectedIndex]?.text || fromUnit.value;
      localStorage.setItem('omni_favorites', JSON.stringify(favorites));
    }
  });

  toUnit.addEventListener('change', () => {
    state.toUnit = toUnit.value;
    renderConversion();
    triggerAutoSaveHistory();

    const favorites = getFavorites();
    const currentCategory = converterTitle.textContent.trim();
    const existingIndex = favorites.findIndex(item => item.category === currentCategory);
    if (existingIndex > -1) {
      favorites[existingIndex].to = toUnit.options[toUnit.selectedIndex]?.text || toUnit.value;
      localStorage.setItem('omni_favorites', JSON.stringify(favorites));
    }
  });

  swapButton.addEventListener('click', () => {
    const previousFrom = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = previousFrom;
    renderConversion();
    triggerAutoSaveHistory();

    const favorites = getFavorites();
    const currentCategory = converterTitle.textContent.trim();
    const existingIndex = favorites.findIndex(item => item.category === currentCategory);
    if (existingIndex > -1) {
      favorites[existingIndex].from = fromUnit.options[fromUnit.selectedIndex]?.text || fromUnit.value;
      favorites[existingIndex].to = toUnit.options[toUnit.selectedIndex]?.text || toUnit.value;
      localStorage.setItem('omni_favorites', JSON.stringify(favorites));
    }
  });

  searchInput.addEventListener('input', (event) => {
    const query = event.target.value.trim().toLowerCase();
    tabButtons.forEach((button) => {
      const txt = button.textContent.toLowerCase();
      button.style.display = query && !txt.includes(query) ? 'none' : 'inline-flex';
    });
  });

  const colorNameSearch = document.getElementById('colorNameSearch');
  if (colorNameSearch) {
    colorNameSearch.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      const resolvedHex = nameToHex(query);
      if (resolvedHex) {
        fromValue.value = fromUnit.value === 'hex' ? resolvedHex : convertColor(resolvedHex, 'hex', fromUnit.value);
        renderConversion();
        triggerAutoSaveHistory();
      }
    });
  }
}

/* ================= URL PARAMETERS PRE-FILL LOGIC ================= */

function handleUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  const from = params.get('from');
  const to = params.get('to');
  const val = params.get('val');

  if (cat) {
    // Find matching category key in config
    const key = Object.keys(converterConfig).find(k => converterConfig[k].title.toLowerCase() === cat.toLowerCase());
    if (key) {
      setActiveType(key);

      if (val) fromValue.value = val;

      // Helper to match unit select option by text or key
      const selectOption = (selectElem, unitQuery) => {
        for (let i = 0; i < selectElem.options.length; i++) {
          const opt = selectElem.options[i];
          if (opt.value.toLowerCase() === unitQuery.toLowerCase() || opt.text.toLowerCase().startsWith(unitQuery.toLowerCase())) {
            selectElem.selectedIndex = i;
            break;
          }
        }
      };

      if (from) selectOption(fromUnit, from);
      if (to) selectOption(toUnit, to);

      renderConversion();
    }
  }
}

/* ================= INITIALIZATION ================= */

attachEvents();
setActiveType('data');
handleUrlParams();