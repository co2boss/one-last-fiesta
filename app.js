import { initializeTravelerAuth, getCurrentTravelerId } from './auth.js';
import { saveTravelerPassport, subscribeToTravelers } from './firestore.js';

const STORAGE_KEY = 'projectFiesta.passport.current';
const LEGACY_STORAGE_KEYS = [
  'projectFiesta.passport.current',
  'projectFiesta.passport.v2',
  'projectFiesta.passport.v1',
  'fiestaPassport'
];
const VISIT_KEY = 'projectFiesta.hasVisited';
const MIGRATION_KEY = 'projectFiesta.storageMigrated.RC1_11';
const scenes = ['invitation','passportScene','revealScene','plaza'];
const wizardNames = ['Traveler','Signature','Frame','Spirit'];
const $ = (id) => document.getElementById(id);
let selectedFrame = 'agave';
let wizardStep = 0;
let currentTraveler = null;
let liveTravelers = [];
let cloudSyncAttempted = false;

function setCloudStatus(message, tone = 'neutral') {
  const text = message || '';
  console.log('[Campfire]', text);

  const liveStatus = $('liveStatusText');
  if (liveStatus && text) {
    liveStatus.dataset.syncTone = tone;
    liveStatus.textContent = text;
  }
}

async function syncPassportToCloud(passport, reason = 'manual') {
  if (!passport) return null;

  try {
    if (!currentTraveler) {
      currentTraveler = await initializeTravelerAuth();
    }

    const cloudId = await saveTravelerPassport(currentTraveler.uid, {
      ...passport,
      lastSyncReason: reason,
      lastLocalSyncAt: new Date().toISOString()
    });

    const syncedPassport = { ...passport, cloudId, cloudSyncedAt: new Date().toISOString(), version: 'RC2.05' };
    savePassport(syncedPassport);
    setCloudStatus(`☁️ Passport synced to the Campfire as ${syncedPassport.name}.`, 'success');
    return cloudId;
  } catch (error) {
    console.error('Cloud passport sync failed:', error);
    setCloudStatus('⚠️ Passport saved on this phone, but cloud sync failed. Check Firestore rules/test mode.', 'error');
    throw error;
  }
}

function showScene(id){
  scenes.forEach(s => $(s)?.classList.add('hidden'));
  $(id)?.classList.remove('hidden');
  document.querySelectorAll('.bottom-nav button').forEach(btn => btn.classList.toggle('active', btn.dataset.target === id));
  window.scrollTo({top:0,behavior:'smooth'});
}

function safeReadStorage(key){
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function normalizePassport(data){
  if(!data) return null;
  const normalized = {
    name: data.name || data.firstName || data.travelerName || 'Traveler',
    drink: data.drink || data.favoriteDrink || '',
    taco: data.taco || data.favoriteTaco || '',
    song: data.song || data.walkupSong || data.walkUpSong || '',
    fact: data.fact || data.funFact || '',
    frame: data.frame || data.avatar || 'agave',
    frameLabel: data.frameLabel || data.avatarLabel || '🌵 Agave',
    vibe: data.vibe || data.personality || 'chill',
    title: data.title || data.fiestaTitle || '',
    description: data.description || data.titleDescription || '',
    createdAt: data.createdAt || new Date().toISOString(),
    version: 'RC2.05'
  };
  if(!normalized.title || !normalized.description){
    const [title, description] = titleFor(normalized);
    normalized.title = title;
    normalized.description = description;
  }
  return normalized;
}

function getPassport(){
  for(const key of LEGACY_STORAGE_KEYS){
    const found = normalizePassport(safeReadStorage(key));
    if(found){
      if(key !== STORAGE_KEY || localStorage.getItem(MIGRATION_KEY) !== 'true'){
        savePassport(found);
        localStorage.setItem(MIGRATION_KEY, 'true');
      }
      return found;
    }
  }
  return null;
}
function savePassport(data){ localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizePassport(data) || data)); }

function frameIcon(frame){
  return { agave:'🌵', sunset:'🌅', barrel:'🥃', campfire:'🔥', talavera:'🌮', gold:'👑' }[frame] || '🌵';
}

function titleFor(passport){
  const name = (passport.name || '').toLowerCase();
  const text = `${passport.drink} ${passport.taco} ${passport.song} ${passport.fact} ${passport.vibe}`.toLowerCase();
  if(name === 'cesar') return ['👑 El Rey de la Fiesta','The man of the weekend. The reason the crew has gathered.'];
  if(name === 'daniel') return ['🤵 El Padrino','Keeper of the keys and guardian of the weekend.'];
  if(text.includes('party') || text.includes('night') || text.includes('club')) return ['🌙 El Nocturno','The legend who comes alive when the sun goes down.'];
  if(text.includes('tequila') || text.includes('margarita') || text.includes('ranch water') || text.includes('barrel')) return ['🥃 El Catador','The connoisseur of the first toast.'];
  if(text.includes('foodie') || text.includes('taco') || text.includes('al pastor') || text.includes('asada')) return ['🌮 El Bandido','The mischievous legend chasing flavor and fun.'];
  if(text.includes('hype') || text.includes('fire') || text.includes('energy')) return ['🔥 El Fuego','The spark that keeps the crew moving.'];
  if(text.includes('planner')) return ['🦅 El Águila','The one who sees the whole weekend from above.'];
  return ['🍻 El Compadre','The one everyone can count on.'];
}

function updateWizard(){
  document.querySelectorAll('.wizard-step').forEach((step, index) => step.classList.toggle('active', index === wizardStep));
  $('wizardStepLabel').textContent = `Step ${wizardStep + 1} of 4`;
  $('wizardStepName').textContent = wizardNames[wizardStep];
  $('progressFill').style.width = `${((wizardStep + 1) / 4) * 100}%`;
  $('wizardBack').style.visibility = wizardStep === 0 ? 'hidden' : 'visible';
  $('wizardNext').classList.toggle('hidden', wizardStep === 3);
  $('wizardSubmit').classList.toggle('hidden', wizardStep !== 3);
}

function canAdvance(){
  if(wizardStep === 0){
    const name = $('travelerName').value.trim();
    if(!name){ $('travelerName').focus(); return false; }
  }
  return true;
}

function hydrateForm(passport){
  if(!passport) return;
  $('travelerName').value = passport.name || '';
  $('favoriteDrink').value = passport.drink || '';
  $('favoriteTaco').value = passport.taco || '';
  $('walkupSong').value = passport.song || '';
  $('funFact').value = passport.fact || '';
  if(passport.frame){
    selectedFrame = passport.frame;
    document.querySelectorAll('.frame-option').forEach(btn => btn.classList.toggle('selected', btn.dataset.frame === selectedFrame));
  }
  if(passport.vibe){
    const vibe = document.querySelector(`input[name="vibe"][value="${passport.vibe}"]`);
    if(vibe) vibe.checked = true;
  }
}

function hydratePlaza(passport){
  if(!passport) return;
  $('welcomeLine').textContent = 'Welcome back';
  $('plazaName').textContent = passport.name || 'Traveler';
  $('plazaTitle').textContent = `${passport.title} • ${passport.frameLabel}`;
  $('passportPreview').classList.remove('hidden');
  $('passportSeal').textContent = frameIcon(passport.frame);
  $('passportTitlePreview').textContent = passport.title || 'Fiesta Traveler';
  $('passportDetailsPreview').textContent = `${passport.name || 'Traveler'} is cleared for departure to Scottsdale.`;
  renderPlazaExperience(passport);
}


function collectPassport(){
  const base = {
    name: $('travelerName').value.trim() || 'Traveler',
    drink: $('favoriteDrink').value.trim(),
    taco: $('favoriteTaco').value.trim(),
    song: $('walkupSong').value.trim(),
    fact: $('funFact').value.trim(),
    frame: selectedFrame,
    frameLabel: document.querySelector('.frame-option.selected')?.textContent.trim() || '🌵 Agave',
    vibe: document.querySelector('input[name="vibe"]:checked')?.value || 'chill',
    createdAt: new Date().toISOString(),
    version: 'RC2.05'
  };
  const [title, description] = titleFor(base);
  return { ...base, title, description };
}

function revealPassport(passport){
  $('revealName').textContent = passport.name;
  $('revealTitle').textContent = passport.title;
  $('revealDescription').textContent = passport.description;
  $('stampingLine').classList.remove('hidden');
  setTimeout(() => $('stampingLine').textContent = 'Passport stamped. Welcome to the crew.', 900);
  hydratePlaza(passport);
  showScene('revealScene');
}



const CREW = [
  { name:'Cesar', role:'El Rey de la Fiesta', icon:'👑', kind:'groom', team:'Honorary' },
  { name:'Daniel', role:'El Padrino', icon:'🤵', kind:'host', team:'Fortaleza' },
  { name:'Kevin', role:'Traveler', icon:'🥃', kind:'crew', team:'Fortaleza' },
  { name:'Gerardo', role:'Traveler', icon:'🌵', kind:'crew', team:'Fortaleza' },
  { name:'David', role:'Traveler', icon:'🔥', kind:'crew', team:'G4' },
  { name:'Chucky', role:'Traveler', icon:'😂', kind:'crew', team:'G4' },
  { name:'Jose', role:'Traveler', icon:'🍻', kind:'crew', team:'G4' },
  { name:'Arturo', role:'Traveler', icon:'🏜️', kind:'crew', team:'Centenario' },
  { name:'Frank', role:'Traveler', icon:'🌙', kind:'crew', team:'Centenario' }
];

const COCINA = [
  { team:'Fortaleza', day:'Friday', icon:'🥃', members:['Daniel','Kevin','Gerardo'], note:'Breakfast and lunch duty before the desert adventure.', breakfast:'Crew-created menu', lunch:'Post-adventure fuel' },
  { team:'G4', day:'Saturday', icon:'🌵', members:['David','Chucky','Jose'], note:'Pool day fuel and bachelor dinner prep vibes.', breakfast:'Crew-created menu', lunch:'Pool day spread' },
  { team:'Centenario', day:'Sunday', icon:'👑', members:['Arturo','Frank','Cesar'], note:'Recovery day meals and final toast energy.', breakfast:'Crew-created menu', lunch:'Final day feast' }
];


const COCINA_SCORE_KEY = 'projectFiesta.cocinaScores';
function getCocinaScores(){
  try { return JSON.parse(localStorage.getItem(COCINA_SCORE_KEY)) || {}; } catch(e){ return {}; }
}
function saveCocinaScore(team, score){
  const scores = getCocinaScores();
  scores[team] = Number(score);
  localStorage.setItem(COCINA_SCORE_KEY, JSON.stringify(scores));
  renderCocinaChallenge();
}
function currentChampion(scores){
  const entries = Object.entries(scores).filter(([,v]) => Number(v) > 0);
  if(!entries.length) return null;
  entries.sort((a,b) => b[1] - a[1]);
  return entries[0];
}

function normalizeName(name){ return (name || '').trim().toLowerCase(); }

function renderPlazaExperience(passport){
  const current = normalizeName(passport?.name);
  const liveByName = new Map();
  liveTravelers.forEach(t => {
    const key = normalizeName(t.name);
    if(key) liveByName.set(key, t);
  });

  const arrivedNames = new Set();
  liveTravelers.forEach(t => {
    const name = normalizeName(t.name);
    if(name) arrivedNames.add(name);
  });
  if(current) arrivedNames.add(current);

  const crewNameSet = new Set(CREW.map(c => normalizeName(c.name)));
  const arrivedCrewCount = [...arrivedNames].filter(name => crewNameSet.has(name)).length;
  const arrivedCount = Math.min(arrivedCrewCount, CREW.length);
  const seal = passport ? frameIcon(passport.frame) : '🌵';

  if($('plazaSeal')) $('plazaSeal').textContent = seal;
  if($('arrivalCount')) $('arrivalCount').textContent = `${arrivedCount} / 9 Arrived`;
  if($('plazaStatus')) $('plazaStatus').textContent = arrivedCount > 0
    ? `${arrivedCount} amigo${arrivedCount === 1 ? '' : 's'} have claimed a seat in La Plaza. The campfire is getting warmer.`
    : 'The Plaza is open. As each amigo receives their passport, their seat comes alive.';
  if($('liveStatusTitle')) $('liveStatusTitle').textContent = arrivedCount > 0 ? 'The campfire is live.' : 'Preparing the first toast...';
  if($('liveStatusText')) $('liveStatusText').textContent = arrivedCount > 0
    ? 'Passports now sync through Firebase, so every phone sees the crew join the Plaza live.'
    : 'Complete your passport, claim your Fiesta title, and meet the crew in La Plaza.';

  const seatGrid = $('seatGrid');
  if(seatGrid){
    seatGrid.innerHTML = CREW.map(person => {
      const key = normalizeName(person.name);
      const live = liveByName.get(key);
      const isCurrent = key === current;
      const arrived = Boolean(live) || isCurrent;
      const displayPassport = live || (isCurrent ? passport : null);
      return `<button class="seat ${arrived ? 'arrived' : ''} ${person.kind}" type="button" aria-label="${person.name}">
        <span class="seat-icon">${arrived ? frameIcon(displayPassport?.frame) : '◌'}</span>
        <span class="seat-name">${person.name}</span>
        <span class="seat-role">${arrived ? (displayPassport?.title || 'Arrived') : person.role}</span>
      </button>`;
    }).join('');
  }

  const crewGrid = $('crewGrid');
  if(crewGrid){
    crewGrid.innerHTML = CREW.map(person => {
      const key = normalizeName(person.name);
      const live = liveByName.get(key);
      const isCurrent = key === current;
      const displayPassport = live || (isCurrent ? passport : null);
      const role = displayPassport?.title || person.role;
      const icon = displayPassport ? frameIcon(displayPassport.frame) : person.icon;
      return `<article class="crew-card ${isCurrent ? 'current' : ''} ${displayPassport ? 'arrived' : ''}">
        <div class="crew-avatar">${icon}</div>
        <div><h3>${person.name}</h3><p>${role} • ${person.team}</p></div>
      </article>`;
    }).join('');
  }

  const cocinaGrid = $('cocinaGrid');
  if(cocinaGrid){
    cocinaGrid.innerHTML = COCINA.map(team => `<article class="cocina-card">
      <p class="eyebrow">${team.day}</p>
      <h3>🥃 Team ${team.team}</h3>
      <p>${team.note}</p>
      <div class="team-members">${team.members.map(m => `<span class="team-pill">${m}</span>`).join('')}</div>
    </article>`).join('');
  }
}


function renderCocinaChallenge(){
  const grid = $('cocinaChallengeGrid');
  if(!grid) return;
  const scores = getCocinaScores();
  const champ = currentChampion(scores);
  grid.innerHTML = COCINA.map(team => {
    const score = scores[team.team] || 0;
    const isChamp = champ && champ[0] === team.team && Number(champ[1]) > 0;
    return `<article class="challenge-card">
      <div class="challenge-top">
        <div>
          <p class="eyebrow">${team.day} Cocina Crew</p>
          <h3>${team.icon} Team ${team.team}</h3>
          <p class="challenge-meta">${team.members.join(' • ')}</p>
        </div>
        <div class="team-mark">${team.icon}</div>
      </div>
      <p class="muted">${team.note}</p>
      <div class="duty-list">
        <div class="duty-pill"><strong>Breakfast</strong><span>${team.breakfast}</span></div>
        <div class="duty-pill"><strong>Lunch</strong><span>${team.lunch}</span></div>
      </div>
      <div class="score-row">
        <p class="score-note">Cesar's rating</p>
        <div class="stars" data-team="${team.team}">
          ${[1,2,3,4,5].map(n => `<button type="button" class="star-btn ${n <= score ? 'active' : ''}" data-score="${n}" aria-label="Rate ${team.team} ${n} stars">★</button>`).join('')}
        </div>
        <p class="score-note">${score ? `${score}/5 stars locked in on this device.` : 'Waiting for the groom’s verdict.'}</p>
      </div>
      ${isChamp ? '<div class="champion-banner">🏆 Current Cocina Champion</div>' : ''}
    </article>`;
  }).join('');
}

function updateCountdown(){
  const el = $('countdownTimer');
  if(!el) return;
  const target = new Date('2026-07-09T16:00:00-07:00').getTime();
  const diff = target - Date.now();
  if(diff <= 0){ el.textContent = 'The Fiesta Has Begun'; return; }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  el.textContent = days > 0 ? `${days}d ${hours}h ${minutes}m` : `${hours}h ${minutes}m`;
}

async function startApp(){
  const passport = getPassport();
  const hasVisited = localStorage.getItem(VISIT_KEY) === 'true';

  try {
    currentTraveler = await initializeTravelerAuth();
    console.log('Campfire device connected as traveler:', currentTraveler.uid);
  } catch(error) {
    console.warn('Campfire cloud connection unavailable. Local mode still works.', error);
  }

  hydrateForm(passport);
  hydratePlaza(passport);
  renderPlazaExperience(passport);

  // RC2.05: If this phone already had a local passport from an older release,
  // automatically migrate it to Firebase so friends do not need to resubmit.
  if (passport && !cloudSyncAttempted) {
    cloudSyncAttempted = true;
    syncPassportToCloud(passport, passport.cloudId ? 'startup-refresh' : 'startup-migration')
      .catch(() => {
        // Keep local mode available even if Firestore rejects the write.
      });
  }

  updateCountdown();
  setInterval(updateCountdown, 60000);
  updateWizard();

  try {
    subscribeToTravelers((travelers) => {
      liveTravelers = travelers;
      renderPlazaExperience(getPassport());
      if (travelers.length > 0) {
        setCloudStatus(`🔥 ${travelers.length} traveler${travelers.length === 1 ? '' : 's'} live in La Plaza.`, 'success');
      }
    }, (error) => {
      console.error('Live traveler subscription failed:', error);
      setCloudStatus('⚠️ Live Plaza could not connect to Firestore. Check rules/test mode.', 'error');
    });
  } catch(error) {
    console.warn('Live traveler subscription unavailable:', error);
  }

  if(hasVisited){
    $('returningSplash').classList.remove('hidden');
    setTimeout(() => { $('returningSplash').classList.add('hidden'); showScene(passport ? 'plaza' : 'invitation'); }, 1000);
  } else {
    localStorage.setItem(VISIT_KEY,'true');
    showScene('invitation');
  }
}

$('beginJourney')?.addEventListener('click', () => showScene('passportScene'));
$('wizardNext')?.addEventListener('click', () => { if(canAdvance()){ wizardStep = Math.min(3, wizardStep + 1); updateWizard(); }});
$('wizardBack')?.addEventListener('click', () => { wizardStep = Math.max(0, wizardStep - 1); updateWizard(); });

document.querySelectorAll('.frame-option').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.frame-option').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedFrame = btn.dataset.frame;
}));

$('passportForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const passport = collectPassport();
  savePassport(passport);

  try {
    await syncPassportToCloud(passport, 'passport-submit');
  } catch(error) {
    console.warn('Passport saved locally, but Firebase save failed:', error);
    alert('Your passport was saved on this phone, but cloud sync did not complete. Check Firestore test mode/rules and try again.');
  }

  revealPassport(getPassport() || passport);
});

$('enterPlaza')?.addEventListener('click', () => showScene('plaza'));
$('resetApp')?.addEventListener('click', () => {
  LEGACY_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
  localStorage.removeItem(VISIT_KEY);
  localStorage.removeItem(MIGRATION_KEY);
  location.reload();
});

document.querySelectorAll('.bottom-nav button,.feature-card[data-target]').forEach(btn => btn.addEventListener('click', () => {
  const target = btn.dataset.target;
  if(target) showScene(target);
  if(btn.dataset.panel) alert('Coming soon: ' + btn.dataset.panel + ' experience');
}));


document.addEventListener('click', (event) => {
  const star = event.target.closest('.star-btn');
  if(!star) return;
  const wrap = star.closest('.stars');
  if(!wrap) return;
  saveCocinaScore(wrap.dataset.team, star.dataset.score);
});

if('serviceWorker' in navigator){ window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js').catch(()=>{})); }
startApp();
