import './style.css';
import { WORLD_IDS, type GameState, type WorldId } from './game/types';
import { createGame, advance, move, openCrate, tapGenerator, buyGem, getPrice, incomePerSecond, unlockedCells, isWorldUnlocked, gemName, maxPurchasableRank, xpToNextLevel, formatCoins, boostedCellIndices } from './game/engine';
import { gemSvg, crateSvg, iconSvg } from './art';
import { loadGame, saveGame, exportGame, importGame, SAVE_KEY, BACKUP_KEY } from './storage/save';
import { acquireSession, type Session } from './storage/session';
import { translate, worldName, localizedGem, type TextKey } from './i18n';

const root = document.querySelector<HTMLDivElement>('#app')!;
let state: GameState;
let session: Session | undefined;
let storageBlocked = false;
let pendingRecovery = false;
let selected: number | null = null;
let boardSignature = '';
let toastTimer: ReturnType<typeof setTimeout>;
let modalKind = '';
let audioContext: AudioContext | undefined;
const t = (key: TextKey) => translate(state?.settings.language ?? 'fr', key);
const name = (rank: number) => localizedGem(gemName(state.activeWorld, rank), state.settings.language);
const canPlay = () => !!session?.active && !storageBlocked && !pendingRecovery;
const coinIcon = () => `<span class="coin-icon vector-coin" aria-hidden="true">${iconSvg(state.activeWorld==='moonland'?'mooncoin':state.activeWorld==='aztecland'?'azteccoin':'coin')}</span>`;

function toast(message: string) {
  const el = document.querySelector<HTMLElement>('#toast');
  if (!el) return;
  el.textContent = message; el.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.hidden = true, 4200);
}
function persist(replace = false): boolean {
  if (!session?.active || (storageBlocked && !replace) || pendingRecovery) return false;
  try { state.savedAt = Math.max(state.savedAt, Date.now()); saveGame(state, undefined, { replace }); return true; }
  catch { storageBlocked = true; toast(t('storageError')); renderStatus(); return false; }
}
/** Persist a replacement before exposing it as the current game. */
function replaceGame(candidate: GameState): boolean {
  if (!session?.active) { toast(t('session')); return false; }
  try {
    candidate.savedAt = Math.max(candidate.savedAt, Date.now());
    saveGame(candidate, undefined, { replace: true });
  } catch {
    storageBlocked = true; toast(t('storageError')); renderStatus(); return false;
  }
  state = candidate; storageBlocked = false; pendingRecovery = false;
  shell();
  return true;
}
function sound(mergeSound = false) {
  if (!state.settings.sound) return;
  try {
    audioContext ??= new AudioContext(); void audioContext.resume();
    const osc = audioContext.createOscillator(), gain = audioContext.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(mergeSound ? 650 : 350, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(mergeSound ? 1050 : 500, audioContext.currentTime + .09);
    gain.gain.setValueAtTime(.045, audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .13);
    osc.connect(gain).connect(audioContext.destination); osc.start(); osc.stop(audioContext.currentTime + .14);
  } catch { /* Audio is optional; blocked audio cannot interrupt a move. */ }
}
function shell() {
  cancelGesture();
  document.documentElement.lang = state.settings.language;
  document.body.dataset.world = state.activeWorld;
  root.innerHTML = `<main class="game" aria-label="Merge Gems!">
    <header class="header"><h1 class="logo" aria-label="Merge Gems!"><span>MERGE</span> <b>GEMS!</b></h1>
      <button id="area" class="area-button" aria-label="${t('area')}">${worldName(state.activeWorld, state.settings.language)} <span>▾</span></button>
      <div class="counters"><div class="counter" aria-label="${t('coins')}">${coinIcon()}<strong id="coins"></strong></div><div class="counter rate">${coinIcon()}<small>${t('perSecond')}</small><strong id="income"></strong></div></div>
      <div class="experience"><span class="level-star" aria-hidden="true">${iconSvg('star')}<b id="level"></b></span><div class="xp-track" role="progressbar" aria-label="${t('level')}"><div id="xp-fill"></div><strong id="xp-text"></strong></div></div>
    </header>
    <div id="status" class="status" role="status" hidden></div>
    <section class="playfield" aria-label="${worldName(state.activeWorld, state.settings.language)}"><div id="board" class="board"></div></section>
    <p id="tutorial" class="tutorial"></p>
    <footer class="controls"><div class="left-controls"><button id="collection" class="square teal" aria-label="${t('collection')}">${iconSvg('medal')}</button><button id="settings" class="square slate" aria-label="${t('settings')}">${iconSvg('settings')}</button></div>
      <button id="generate" class="generator" aria-label="${t('generate')}"><span class="generator-art">${crateSvg(state.activeWorld)}</span><strong id="countdown"></strong><span class="tap-mark" aria-hidden="true">↓</span></button>
      <button id="shop" class="shop-button pink" aria-label="${t('shop')}">${iconSvg('shop')}<span>${t('shop')}</span></button>
    </footer>
    <button id="update" class="update-banner" hidden></button>
  </main><div id="toast" class="toast" role="status" hidden></div><dialog id="modal"><div id="modal-content"></div></dialog><input id="import-file" type="file" accept="application/json,.json" hidden />`;
  document.querySelector('#settings')!.addEventListener('click', showSettings);
  document.querySelector('#collection')!.addEventListener('click', showCollection);
  document.querySelector('#area')!.addEventListener('click', showWorlds);
  document.querySelector('#shop')!.addEventListener('click', showShop);
  document.querySelector('#generate')!.addEventListener('click', () => {
    if (!canPlay()) return;
    if (tapGenerator(state, Date.now())) sound();
    if (state.tutorialStep === 0) state.tutorialStep = 1;
    persist(); render();
  });
  document.querySelector('#board')!.addEventListener('pointerdown', pointerDown);
  document.querySelector('#board')!.addEventListener('click', keyboardTileClick);
  document.querySelector('#import-file')!.addEventListener('change', importFile);
  document.querySelector('#modal')!.addEventListener('close', () => modalKind = '');
  boardSignature = ''; render(); configureUpdateButton();
}
function renderStatus() {
  const el = document.querySelector<HTMLElement>('#status')!;
  const msg = storageBlocked ? t('storageError') : (!session?.active ? t('session') : '');
  el.textContent = msg; el.hidden = !msg;
  document.querySelector('#board')?.setAttribute('aria-disabled', String(!canPlay()));
}
function render() {
  const world = state.worlds[state.activeWorld];
  document.querySelector('#coins')!.textContent = formatCoins(BigInt(world.coins), state.settings.language);
  document.querySelector('#income')!.textContent = formatCoins(incomePerSecond(world, state.activeWorld), state.settings.language);
  document.querySelector('#level')!.textContent = String(world.level);
  const threshold = xpToNextLevel(world.level);
  document.querySelector('#xp-text')!.textContent = `${world.xp}/${threshold}`;
  (document.querySelector('#xp-fill') as HTMLElement).style.width = `${Math.min(100, world.xp / threshold * 100)}%`;
  const progress = document.querySelector('.xp-track')!;
  progress.setAttribute('aria-valuenow', String(world.xp)); progress.setAttribute('aria-valuemax', String(threshold));
  const count = unlockedCells(world.level);
  const full = world.cells.slice(0,count).every(Boolean);
  document.querySelector('#countdown')!.textContent = full ? t('full') : String(Math.max(0, Math.ceil((world.nextCrateAt - Date.now()) / 1000)));
  const tut = document.querySelector<HTMLElement>('#tutorial')!;
  tut.textContent = state.tutorialStep < 4 ? t(`tutorial${state.tutorialStep}` as TextKey) : t('gesture');
  const signature = JSON.stringify([state.activeWorld, world.cells, count, selected, state.settings.language]);
  if (signature !== boardSignature && !drag?.moved) {
    boardSignature = signature;
    const board = document.querySelector<HTMLElement>('#board')!;
    const rows = Math.ceil(count/3);
    board.style.setProperty('--rows', String(rows));
    board.classList.toggle('center-first', count % 3 === 1);
    const boosts = boostedCellIndices(world, state.activeWorld);
    board.innerHTML = world.cells.slice(0,count).map((tile,i) => `<button class="tile ${tile?.kind ?? 'empty'} ${selected===i?'selected':''} ${boosts.includes(i)?'boosted':''}" data-cell="${i}" aria-label="${tile?.kind==='crate'?t('open'):tile?.kind==='gem'?`${name(tile.rank)} · ${t('rank')} ${tile.rank+1}`:t('empty')}" aria-pressed="${selected===i}">${tile?.kind==='gem'?gemSvg(state.activeWorld,tile.rank):tile?.kind==='crate'?crateSvg(state.activeWorld):''}</button>`).join('');
  }
  renderStatus();
}
function actionCell(index:number) {
  if(!canPlay()) return;
  const tile = state.worlds[state.activeWorld].cells[index];
  if (selected !== null && selected !== index) { finishMove(selected,index); return; }
  if(tile?.kind==='crate') {
    if(openCrate(state,index,Date.now())) { sound(); state.tutorialStep=Math.max(state.tutorialStep,2); persist(); render(); animateCell(index,'appear'); }
  } else if(tile?.kind==='gem') { selected=selected===index?null:index; render(); }
  else { selected=null; render(); }
}
function finishMove(from:number,to:number) {
  const oldRank=state.worlds[state.activeWorld].maxRank;
  const oldLevel=state.worlds[state.activeWorld].level;
  const result=move(state,from,to,Date.now()); selected=null;
  if(result==='merged') { state.tutorialStep=Math.max(state.tutorialStep,3); sound(true); }
  if(state.tutorialStep===3 && state.worlds[state.activeWorld].maxRank>1) state.tutorialStep=4;
  persist(); render();
  if(result!=='invalid') animateCell(to,result==='merged'?'merge-pop':'appear');
  if(state.worlds[state.activeWorld].maxRank>oldRank) showDiscovery(state.worlds[state.activeWorld].maxRank);
  else if(state.worlds[state.activeWorld].level>oldLevel) toast(`${t('level')} ${state.worlds[state.activeWorld].level}`);
}
function animateCell(index:number,animation:string) {
  const el=document.querySelector(`[data-cell="${index}"]`); el?.classList.add(animation);
  setTimeout(()=>el?.classList.remove(animation),450);
}
let drag: {id:number;from:number;x:number;y:number;moved:boolean;ghost:HTMLElement|null;source:HTMLElement}|null=null;
function pointerDown(event: Event) {
  const e=event as PointerEvent;
  if(!canPlay() || !e.isPrimary || (e.pointerType==='mouse' && e.button!==0) || drag) return;
  const tile=(e.target as Element).closest<HTMLElement>('[data-cell]'); if(!tile) return;
  e.preventDefault(); const from=Number(tile.dataset.cell);
  drag={id:e.pointerId,from,x:e.clientX,y:e.clientY,moved:false,ghost:null,source:tile};
  tile.setPointerCapture(e.pointerId);
  tile.addEventListener('pointermove',pointerMove); tile.addEventListener('pointerup',pointerUp); tile.addEventListener('pointercancel',cancelGesture); tile.addEventListener('lostpointercapture',cancelGesture);
}
function pointerMove(event:Event) {
  const e=event as PointerEvent; if(!drag || drag.id!==e.pointerId) return;
  if(!drag.moved && Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>8 && state.worlds[state.activeWorld].cells[drag.from]?.kind==='gem') {
    drag.moved=true; const rect=drag.source.getBoundingClientRect();
    drag.ghost=document.createElement('div'); drag.ghost.className='drag-ghost'; drag.ghost.innerHTML=drag.source.innerHTML;
    drag.ghost.style.width=`${rect.width}px`; drag.ghost.style.height=`${rect.height}px`; document.body.append(drag.ghost); drag.source.classList.add('drag-source');
  }
  if(drag.ghost) { drag.ghost.style.left=`${e.clientX}px`; drag.ghost.style.top=`${e.clientY}px`; }
}
function pointerUp(event:Event) {
  const e=event as PointerEvent; if(!drag || drag.id!==e.pointerId) return;
  const {from,moved}=drag;
  const target=document.elementFromPoint(e.clientX,e.clientY)?.closest<HTMLElement>('[data-cell]');
  cancelGesture();
  if(moved) { if(target && canPlay()) finishMove(from,Number(target.dataset.cell)); else { selected=null; render(); } }
  else if(target) actionCell(from);
}
function cancelGesture() {
  if(!drag) return;
  const {source,id,ghost}=drag; drag=null; ghost?.remove(); source.classList.remove('drag-source');
  source.removeEventListener('pointermove',pointerMove);source.removeEventListener('pointerup',pointerUp);source.removeEventListener('pointercancel',cancelGesture);source.removeEventListener('lostpointercapture',cancelGesture);
  try { if(source.hasPointerCapture(id)) source.releasePointerCapture(id); } catch { /* Removed node. */ }
}
function keyboardTileClick(event:Event) {
  if((event as MouseEvent).detail!==0) return;
  const cell=(event.target as Element).closest<HTMLElement>('[data-cell]'); if(cell) actionCell(Number(cell.dataset.cell));
}
function modal(title:string,content:string,kind='other') {
  cancelGesture(); selected=null; render(); modalKind=kind;
  const dialog=document.querySelector<HTMLDialogElement>('#modal')!;
  document.querySelector('#modal-content')!.innerHTML=`<div class="modal-heading"><h2>${title}</h2><button id="close-modal" class="close" aria-label="${t('close')}">×</button></div>${content}`;
  document.querySelector('#close-modal')!.addEventListener('click',()=>dialog.close()); if(!dialog.open) dialog.showModal();
}
function showSettings() {
  modal(t('settings'),`<div class="setting-row"><label for="language">${t('language')}</label><select id="language"><option value="fr" ${state.settings.language==='fr'?'selected':''}>Français</option><option value="en" ${state.settings.language==='en'?'selected':''}>English</option></select></div>
    <button id="sound" class="setting-row">${t('sound')}<b>${state.settings.sound?t('on'):t('off')}</b></button>
    <p class="small">${t('local')}</p><div class="settings-actions"><button id="export-save">${t('export')}</button><button id="import-save">${t('import')}</button><button id="reset-save" class="danger">${t('reset')}</button></div>
    <p class="small">${t('install')}</p><details><summary>${t('about')}</summary><p>${t('evidence')}</p><p>${t('missing')}</p><a href="https://github.com/EndingMango26/Merge-Gems/blob/reconstruction/merge-gems-reference/docs/reference-analysis.md" target="_blank" rel="noopener">${t('references')}</a></details>`, 'settings');
  document.querySelector('#language')!.addEventListener('change',e=>{ if(!session?.active || pendingRecovery) return; state.settings.language=(e.target as HTMLSelectElement).value==='en'?'en':'fr'; persist(); shell(); showSettings(); });
  document.querySelector('#sound')!.addEventListener('click',()=>{if(!canPlay())return;state.settings.sound=!state.settings.sound;persist();showSettings();sound();});
  attachSaveButtons();
}
function attachSaveButtons() {
  document.querySelector('#export-save')?.addEventListener('click',()=>{
    try { download(exportGame(state)); } catch { toast(t('exportError')); }
  });
  document.querySelector('#import-save')?.addEventListener('click',()=>{if(session?.active)document.querySelector<HTMLInputElement>('#import-file')!.click();});
  document.querySelector('#reset-save')?.addEventListener('click',()=>{
    if(!session?.active || !confirm(t('confirmReset'))) return;
    replaceGame(createGame(Date.now(),state.settings.language));
  });
}
function showShop() {
  const world=state.worlds[state.activeWorld], max=maxPurchasableRank(world);
  const rows=Array.from({length:Math.max(0,max)},(_,i)=>i+1).map(rank=>{
    const price=getPrice(world,rank,state.activeWorld); return `<div class="shop-row"><div class="shop-art">${gemSvg(state.activeWorld,rank)}</div><div><b>${name(rank)}</b><small>${t('rank')} ${rank+1}</small></div><button data-buy="${rank}" ${BigInt(world.coins)<price?'class="unaffordable"':''}>${coinIcon()}<strong>${formatCoins(price,state.settings.language)}</strong></button></div>`;
  }).join('');
  modal(t('shop'),`<p class="small">${t('shopHint')}</p><div class="shop-balance">${coinIcon()}<span id="shop-coins">${formatCoins(BigInt(world.coins),state.settings.language)}</span></div>${rows||`<p>${t('unavailable')}</p>`}`,'shop');
  document.querySelectorAll<HTMLElement>('[data-buy]').forEach(button=>button.addEventListener('click',()=>{
    if(!canPlay())return;
    const rank=Number(button.dataset.buy);
    if(BigInt(world.coins)<getPrice(world,rank,state.activeWorld)){toast(t('notEnough'));return;}
    if(!buyGem(state,rank,Date.now())){toast(t('noSpace'));return;}
    sound();persist();render();showShop();
  }));
}
function showCollection() {
  const max=state.worlds[state.activeWorld].maxRank;
  modal(t('collection'),`<p class="small">${worldName(state.activeWorld,state.settings.language)} · ${max+1}/39</p><div class="collection-grid">${Array.from({length:39},(_,rank)=>`<div class="collection-item ${rank>max?'unknown':''}"><div>${rank<=max?gemSvg(state.activeWorld,rank):'<span>?</span>'}</div><small>${rank<=max?name(rank):t('undiscovered')}</small><b>${rank+1}</b></div>`).join('')}</div>`,'collection');
}
function showWorlds() {
  modal(t('area'),`<div class="world-list">${WORLD_IDS.map(id=>`<button data-world="${id}" ${!isWorldUnlocked(state,id)?'disabled':''}><span>${worldName(id,state.settings.language)}</span><small>${isWorldUnlocked(state,id)?'':id==='moonland'?t('unlockMoon'):t('unlockAztec')}</small></button>`).join('')}</div>`,'worlds');
  document.querySelectorAll<HTMLElement>('[data-world]').forEach(el=>el.addEventListener('click',()=>{
    const id=el.dataset.world as WorldId;if(!canPlay()||!isWorldUnlocked(state,id))return;
    advance(state,Date.now());state.activeWorld=id;persist();shell();
  }));
}
function showDiscovery(rank:number) {
  modal(t('newGem'),`<div class="discovery"><div class="rays">${gemSvg(state.activeWorld,rank)}</div><h3>${name(rank)}</h3><button id="continue" class="green">${t('continue')}</button></div>`,'discovery');
  document.querySelector('#continue')!.addEventListener('click',()=>document.querySelector<HTMLDialogElement>('#modal')!.close());
}
function download(text:string, filename='merge-gems-save.json') {
  const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));
  const anchor=document.createElement('a');anchor.href=url;anchor.download=filename;document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
}
async function importFile(event:Event) {
  const input=event.target as HTMLInputElement,file=input.files?.[0]; if(!file)return;
  try {
    if(!session?.active) { toast(t('session')); return; }
    if(file.size>256000)throw new Error();
    const imported=importGame(await file.text());
    if(!session?.active) { toast(t('session')); return; }
    if(!confirm(t('confirmImport')))return;
    if(!session?.active) { toast(t('session')); return; }
    advance(imported,Date.now());
    if(replaceGame(imported))toast(t('imported'));
  } catch { toast(t('invalidFile')); } finally {input.value='';}
}
function showRecovery() {
  modal(t('settings'),`<p>${pendingRecovery?t('recovered'):t('damaged')}</p>${pendingRecovery?`<button id="recover">${t('restore')}</button>`:''}<div class="settings-actions"><button id="raw-export">${t('rawExport')}</button><button id="import-save">${t('import')}</button><button id="reset-save" class="danger">${t('reset')}</button></div>`,'recovery');
  document.querySelector('#recover')?.addEventListener('click',()=>{
    if(!session?.active)return;
    try {
      const recovered=importGame(exportGame(state));
      advance(recovered,Date.now());replaceGame(recovered);
    } catch { toast(t('invalidFile')); }
  });
  document.querySelector('#raw-export')?.addEventListener('click',()=>{try{download(JSON.stringify({primary:localStorage.getItem(SAVE_KEY),backup:localStorage.getItem(BACKUP_KEY)}),'merge-gems-recovery.json');}catch{toast(t('exportError'));}});
  attachSaveButtons();
}
let waitingWorker:ServiceWorker|null=null;
function configureUpdateButton() {
  const el=document.querySelector<HTMLButtonElement>('#update'); if(!el)return;
  el.hidden=!waitingWorker;el.textContent=`${t('update')} · ${t('reload')}`;
  el.onclick=()=>{if(!canPlay()||!persist())return;cancelGesture();waitingWorker?.postMessage({type:'SKIP_WAITING'});navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload(),{once:true});};
}
async function serviceWorker() {
  if(!('serviceWorker' in navigator) || !import.meta.env.PROD)return;
  try {
    const reg=await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`,{scope:import.meta.env.BASE_URL});
    const ready=()=>{waitingWorker=reg.waiting;configureUpdateButton();};ready();
    reg.addEventListener('updatefound',()=>reg.installing?.addEventListener('statechange',ready));
  } catch { /* Online play and saving still work if caching is unavailable. */ }
}
async function start() {
  const loaded=loadGame();
  state=loaded.state??createGame(Date.now(),navigator.language.startsWith('fr')?'fr':'en');
  pendingRecovery=!!loaded.recovered;storageBlocked=!!loaded.error&&!loaded.recovered;
  shell();
  session=await acquireSession(active=>{
    cancelGesture();
    // The first callback runs before acquireSession resolves and assigns session.
    if(!session)return;
    if(active && !storageBlocked && !pendingRecovery) {
      const latest=loadGame();
      if(latest.error) {
        if(latest.state)state=latest.state;
        pendingRecovery=!!latest.recovered;storageBlocked=!latest.recovered;
        shell();showRecovery();return;
      }
      if(latest.state)state=latest.state;
      advance(state,Date.now());persist();shell();
    } else if(document.querySelector('#status'))renderStatus();
  });
  if(loaded.error) {
    showRecovery();
  } else if(session.active) {
    const elapsed=Date.now()-state.savedAt;
    const earned=advance(state,Date.now()).earned;persist();render();
    if(elapsed>60000&&earned>0n)toast(`${t('away')} · +${formatCoins(earned,state.settings.language)}`);
  }
  setInterval(()=>{
    if(!canPlay()||document.hidden)return;
    advance(state,Date.now());render();
    if(modalKind==='shop') {const el=document.querySelector('#shop-coins');if(el)el.textContent=formatCoins(BigInt(state.worlds[state.activeWorld].coins),state.settings.language);}
  },200);
  setInterval(()=>{if(canPlay())persist();},5000);
  document.addEventListener('visibilitychange',()=>{
    cancelGesture();if(!canPlay())return;
    if(!document.hidden){advance(state,Date.now());persist();render();}else persist();
  });
  window.addEventListener('pagehide',()=>{cancelGesture();if(canPlay()){advance(state,Date.now());persist();}session?.close();});
  window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
  window.addEventListener('blur',cancelGesture);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){cancelGesture();selected=null;render();}});
  renderStatus();void serviceWorker();
}
void start();
