'use strict';
const directions = [
  {id:'punk', name:'Xerox riot', material:'01 / PUNK', notes:'Anton headlines. High-contrast yellow stock, bold action symbols, black entry strip.', art:'PASTE ART HERE', mark:'NO RULES / ALL INSTINCT'},
  {id:'concrete', name:'Brutalist dojo', material:'02 / REBAR + CONCRETE', notes:'Exposed reinforcement, blood-red overprint, cobalt paint and chipped concrete. Full-width action panel.', art:'IMPACT ZONE', mark:'FORM / FORCE / FRICTION'},
  {id:'ticket', name:'Unsanctioned bout', material:'03 / FIGHT TICKET', notes:'Condensed boxing-poster type, red stock, cream ink, perforations and an oversized framed image.', art:'FIGHT PHOTO', mark:'ADMIT ONE / NO REFUNDS'},
  {id:'paste', name:'Wheatpaste wall', material:'04 / XEROX × RAW CONCRETE', notes:'A bright pasted headline on raw concrete. Cream action paper, black mechanic labels and offset cut edges.', art:'PASTE OVER / REPEAT', mark:''},
  {id:'hazard', name:'Demolition notice', material:'05 / XEROX × SAFETY PAINT', notes:'Warning-color stock, reinforcement lines and heavy black bands. Actions and conditions read as separate stamped blocks.', art:'CONTROLLED IMPACT', mark:''},
  {id:'night', name:'Night shift', material:'06 / XEROX × DARK CONCRETE', notes:'Charcoal slab, fluorescent title plate and pale action tiles. The Xerox contrast, with a heavier industrial frame.', art:'AFTER HOURS / CONTACT SHEET', mark:''}
];
const icons = {'Grappled':'grapple','Close':'close','Far':'far','Moving':'moving','Still':'still','Standing':'standing','Prone':'prone','Balanced':'balanced','Anticipating':'anticipating','Unbalanced':'unbalanced','Not Anticipating':'not_anticipating','Damage':'damage','Closer':'closer','Further':'further','Poise':'poise','Lose Poise':'losePoise','Not Grappled':'not_grapple','Not Close':'not_close','Not Far':'not_far','Bloodied':'bloodied'};
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const cards = window.VIZDEV_CARDS;
const picker = document.querySelector('#card-picker');
const artwork = new Map();
let initial = new URLSearchParams(location.search).get('card') || '1000 Cuts';
for (const c of cards) picker.add(new Option(c.name, c.name, false, c.name === initial));
// Supplemental symbols for axes without an original game icon.
const glyphs = {
  Parry:'M5 20L19 4M4 5l15 15M3 14l7 7M14 3l7 7',
  Block:'M12 2l8 4v6c0 5-8 10-8 10S4 17 4 12V6z',
  Reflex:'M14 2L5 14h7l-2 8 9-13h-7z',
  Setup:'M4 20V6m0 1h13l-3 4 3 4H4',
  Rigid:'M5 3v18M12 3v18M19 3v18M3 7h18M3 17h18',
  Flow:'M3 7c5-8 13 8 18 0M3 16c5-8 13 8 18 0',
  Cripple:'M14 2l-4 7 5 4-5 9M4 7l3 3M20 12l-3 3',
  Buff:'M12 3l8 8h-5v10H9V11H4z',
  Fresh:'M12 3c0 0-7 8-7 12a7 7 0 0014 0c0-4-7-12-7-12zM8 15l3 3 5-6',
  Clutch:'M5 13V7h3v5-8h3v8-9h3v9-7h3v8l3-3v7l-5 5H8z',
  Fluid:'M3 8c5-8 13 8 18 0M3 16c5-8 13 8 18 0',
  Motion:'M3 7h12l-4-4m4 4-4 4M21 17H9l4-4m-4 4 4 4',
  Distance:'M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4',
  Stance:'M12 3v9M5 8h14M12 12l-7 9m7-9 7 9'
};
function piece(p) {
  const axis = p.axis || p.mechanic;
  const symbol = icons[axis];
  const label = [p.player, axis, p.amount, p.detail].filter(v => v !== undefined).join(' · ');
  const visual = symbol ? `<img src="assets/${symbol}.png" alt="">` : glyphs[axis] ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${glyphs[axis]}"/></svg>` : `<span class="fallback-axis">${esc(axis)}</span>`;
  const arrowPaths = {
    Me:'M9 2h6v11h6L12 23 3 13h6z',
    Them:'M9 22h6V11h6L12 1 3 11h6z',
    Both:'M12 0l9 9h-6v6h6l-9 9-9-9h6V9H3z'
  };
  const target = arrowPaths[p.player];
  return `<span class="piece" tabindex="0" role="img" aria-label="${esc(label)}" data-tooltip="${esc(label)}"><span class="piece-visual" aria-hidden="true">${target ? `<svg class="target-arrow" viewBox="0 0 24 24" fill="currentColor"><path d="${target}"/></svg>` : ''}${visual}${p.amount !== undefined ? `<b>${esc(p.amount)}</b>` : ''}${p.detail ? `<em>${esc(p.detail)}</em>` : ''}</span></span>`;
}
function mechanics(items) {
  return (items || []).map(m => `<div class="mechanic"><div class="mechanic-name">${esc(m.mechanic)}${m.amount !== undefined ? ` ${esc(m.amount)}` : ''}${m.enhancedTag ? ` · ${esc(m.enhancedTag)}` : ''}</div>${m.requirements?.length ? `<div class="condition"><span class="when condition-badge">If</span> ${m.requirements.map(piece).join('')}</div>` : ''}${m.effects?.length ? `<div class="pieces">${m.effects.map(piece).join('')}</div>` : ''}${(m.choices || []).map((choice, i) => `<div class="choice"><span class="when">${i ? 'Or' : 'Either'}</span><div class="pieces">${choice.map(piece).join('')}</div></div>`).join('')}</div>`).join('');
}
const layouts = {
  punk: {label:'STYLE + ENTRY STRIP / LOW PAPER PANEL'},
  concrete: {label:'PAINTED HEADER / REBAR FRAME'},
  ticket: {label:'ADMISSION STRIP / PHOTO FIRST'},
  paste: {label:'PASTED HEADLINE / RAW SLAB'},
  hazard: {label:'WARNING STRIP / STAMPED BLOCKS'},
  night: {label:'FLUORESCENT TITLE / PALE ACTION TILES'}
};
// Name, main color, paper, accent, material surface, deep structural color.
const palettes = {
  punk: [['Acid','#e8ee56','#f5f1ce','#b82d58','#d1d88b','#343a21'],['Cyan','#55d9ed','#def2ef','#b82e50','#a0cbd1','#193f50'],['Tangerine','#ff9954','#ffe9c9','#684488','#d8b191','#453346'],['Orchid','#c09aef','#eee3f7','#286855','#b6accc','#34374e']],
  concrete: [['Cobalt','#203e94','#f0efdc','#a72d32','#aebba9','#3b4c43'],['Oxide','#a54129','#f4e4cd','#19575a','#b9b5a0','#464d42'],['Petrol','#16585e','#e4eee0','#9d3d26','#9bada4','#2d4546'],['Aubergine','#613965','#f1e4df','#8b5526','#b9a9b0','#463746']],
  ticket: [['Red','#b12a24','#fff0cd','#692c3f','#d66c4c','#571d27'],['Racing','#1f574d','#e9edcc','#8f5421','#6f9e80','#153b35'],['Ultramarine','#323d99','#f1e8d4','#873c31','#777da9','#232859'],['Mulberry','#79264d','#f7e7da','#385847','#b27991','#491c36']],
  paste: [['Volt','#dafa32','#f1f0d4','#a83051','#b5beb0','#36473c'],['Cyan','#3edbef','#e0f0e9','#a43834','#a2b8bd','#294b57'],['Flare','#ff8741','#f8e6cb','#4a467c','#beb3a2','#45423d'],['Iris','#bd8bfa','#efe3f0','#26685d','#b7adbf','#423e55']],
  hazard: [['Safety','#e9e85a','#f4f0cf','#95332b','#aeb59a','#3a4938'],['Flare','#ff963d','#f8e5c8','#365a73','#aeb7b3','#2d4555'],['Jade','#69c69a','#e2edcf','#7d3659','#a4b8a4','#294d43'],['Coral','#f18c97','#f8e2d9','#37566f','#b5adb0','#483b4c']],
  night: [['Volt','#d9eb6a','#e7eadb','#d98c63','#465242','#17231b'],['Glacier','#79d3e9','#e0edf0','#d4967b','#3c515c','#172630'],['Ember','#ff9d59','#f2e5d4','#94bab0','#54483e','#2e2420'],['Ultraviolet','#c19aee','#ebe2f0','#a7c690','#4c435b','#261f34']]
};
function contrastInk(hex) {
  const rgb = hex.slice(1).match(/../g).map(v => parseInt(v,16)/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4);
  const luminance = rgb[0]*.2126 + rgb[1]*.7152 + rgb[2]*.0722;
  return luminance > .2 ? '#182019' : '#fff7e7';
}
// Each preview direction remembers its palette separately for each fighting style.
const paletteChoices = new Map();
function paletteIndex(id, style) { return paletteChoices.get(`${id}:${style}`) || 0; }
function paletteVars(id, style) {
  const p = palettes[id]?.[paletteIndex(id, style)];
  return p ? `--tone:${p[1]};--stock:${p[2]};--spot:${p[3]};--surface:${p[4]};--deep:${p[5]};--on-tone:${contrastInk(p[1])};--on-spot:${contrastInk(p[3])}` : '';
}
function paletteButtons(d, c) {
  if (!palettes[d.id]) return '<div class="palette-static">MONOCHROME / THERMAL STOCK</div>';
  return `<div class="palette-controls" role="group" aria-label="${esc(d.name)} palette for ${esc(c.style)}">${palettes[d.id].map((p,i) => `<button class="palette-button" data-direction="${d.id}" data-palette="${i}" aria-pressed="${paletteIndex(d.id,c.style) === i}" title="${esc(p[0])} — use for ${esc(c.style)}"><i style="background:linear-gradient(90deg,${p[1]} 0 50%,${p[2]} 50% 75%,${p[3]} 75%)" aria-hidden="true"></i>${p[0]}</button>`).join('')}</div>`;
}
function cardMarkup(c, d) {
  const top = `<div class="card-top"><span class="fighting-style">${esc(c.style)}</span><aside class="requirements" aria-label="Card play requirements"><div class="pieces">${c.requirements.map(piece).join('')}</div></aside></div>`;
  const title = `<header class="card-title"><h3>${esc(c.name)}</h3></header>`;
  const art = `<div class="art ${artwork.has(c.name) ? 'has-image' : ''}">${artwork.has(c.name) ? `<img class="user-art" src="${esc(artwork.get(c.name))}" alt="Artwork for ${esc(c.name)}">` : `<div class="art-gesture" aria-hidden="true"><i></i><i></i><i></i></div><span class="art-cross" aria-hidden="true">+</span><span class="art-label">${d.art}</span><span class="art-note">IMAGE PLACEHOLDER</span>`}</div>`;
  const rules = `<div class="rules"><div class="effects"><h4>Actions</h4><div class="pieces">${c.effects.length ? c.effects.map(piece).join('') : '<span class="empty">See technique below</span>'}</div></div>${mechanics(c.mechanics)}</div>`;
  const tags = c.tags.map(t => `<span class="tag">${esc(typeof t === 'string' ? t : t.value)}</span>`).join('');
  const footer = `<div class="card-footer">${tags ? `<div class="tags" aria-label="Card tags">${tags}</div>` : ''}<span class="priority"><span>PRIORITY</span><strong>${esc(c.priority)}</strong></span></div>`;
  const bodies = {
    punk: `${top}${title}${art}${rules}`,
    concrete: `${title}${top}${art}${rules}`,
    ticket: `${top}${art}${title}${rules}`,
    paste: `${top}${title}${art}${rules}`,
    hazard: `${title}${top}${art}${rules}`,
    night: `${top}${art}${title}${rules}`
  };
  return `<div class="card ${d.id}" style="${paletteVars(d.id,c.style)}">${bodies[d.id]}${footer}</div>`;
}
function fitCards() {
  document.querySelectorAll('.card').forEach(card => {
    card.dataset.density = '0';
    for (let level = 1; level <= 3 && card.scrollHeight > card.clientHeight + 1; level++) {
      card.dataset.density = String(level);
    }
  });
}

function render() {
  hideTooltip();
  const c = cards.find(c => c.name === picker.value);
  document.querySelector('#selection-info').textContent = `${c.style} / Priority ${c.priority} / ${cards.indexOf(c) + 1} of ${cards.length}`;
  document.querySelector('#source-data').textContent = JSON.stringify(c, null, 2);
  document.querySelector('#clear-art').hidden = !artwork.has(c.name);
  document.querySelector('#studies').innerHTML = directions.map(d => `<article class="study"><div class="study-heading"><span>${d.material}</span><span class="swatches ${d.id}" style="${paletteVars(d.id,c.style)}" aria-hidden="true"><i></i><i></i><i></i></span></div><h2>${d.name}</h2><p class="layout-label">${layouts[d.id].label}</p>${paletteButtons(d,c)}<div class="stage ${d.id}">${cardMarkup(c,d)}</div><p class="notes">${d.notes}</p></article>`).join('');
  fitCards();
}
document.querySelector('#studies').addEventListener('click', event => {
  const button = event.target.closest('[data-palette]');
  if (!button) return;
  const c = cards.find(c => c.name === picker.value);
  paletteChoices.set(`${button.dataset.direction}:${c.style}`, Number(button.dataset.palette));
  const study = button.closest('.study');
  study.querySelector('.card').setAttribute('style', paletteVars(button.dataset.direction,c.style));
  study.querySelector('.swatches').setAttribute('style', paletteVars(button.dataset.direction,c.style));
  study.querySelectorAll('[data-palette]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
});
window.addEventListener('resize', fitCards);
if (document.fonts) document.fonts.ready.then(fitCards);
const tooltip = document.querySelector('#icon-tooltip');
function hideTooltip() { if (tooltip) tooltip.hidden = true; }
function showTooltip(event) {
  const piece = event.target.closest?.('[data-tooltip]');
  if (!piece) return hideTooltip();
  tooltip.textContent = piece.dataset.tooltip;
  tooltip.hidden = false;
  const rect = piece.getBoundingClientRect();
  tooltip.style.left = `${Math.max(8, Math.min(rect.left, innerWidth - tooltip.offsetWidth - 8))}px`;
  tooltip.style.top = `${Math.max(8, rect.top - tooltip.offsetHeight - 8)}px`;
}
document.addEventListener('pointerover', showTooltip);
document.addEventListener('focusin', showTooltip);
document.addEventListener('pointerout', hideTooltip);
document.addEventListener('focusout', hideTooltip);
document.addEventListener('scroll', hideTooltip, true);
window.addEventListener('resize', hideTooltip);
document.addEventListener('keydown', event => { if (event.key === 'Escape') hideTooltip(); });
picker.addEventListener('change', render);
function step(delta) { picker.selectedIndex = (picker.selectedIndex + delta + cards.length) % cards.length; render(); }
document.querySelector('#previous').addEventListener('click', () => step(-1));
document.querySelector('#next').addEventListener('click', () => step(1));
function randomCard() { step(1 + Math.floor(Math.random() * (cards.length - 1))); }
document.querySelector('#random').addEventListener('click', randomCard);
document.addEventListener('keydown', event => {
  if (event.key.toLowerCase() !== 'r' || event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
  if (event.target.closest?.('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
  event.preventDefault();
  randomCard();
});
document.querySelector('#art-upload').addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { alert('Please choose an image file.'); event.target.value = ''; return; }
  if (artwork.has(picker.value)) URL.revokeObjectURL(artwork.get(picker.value));
  artwork.set(picker.value, URL.createObjectURL(file)); render(); event.target.value = '';
});
document.querySelector('#clear-art').addEventListener('click', () => { URL.revokeObjectURL(artwork.get(picker.value)); artwork.delete(picker.value); render(); });
render();
