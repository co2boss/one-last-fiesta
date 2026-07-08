const $ = (s)=>document.querySelector(s);
const app = $('#app');
const storeKey='projectFiestaV02';
const crew=[
 {name:'Cesar',role:'El Rey de la Fiesta',team:'Honorary',emoji:'👑'},
 {name:'Daniel',role:'El Padrino',team:'Fortaleza',emoji:'🤵'},
 {name:'Kevin',role:'Mystery Title',team:'Fortaleza',emoji:'🥃'},
 {name:'Gerardo',role:'Mystery Title',team:'Fortaleza',emoji:'🌵'},
 {name:'David',role:'Mystery Title',team:'G4',emoji:'🔥'},
 {name:'Chucky',role:'Mystery Title',team:'G4',emoji:'😂'},
 {name:'Jose',role:'Mystery Title',team:'G4',emoji:'🍻'},
 {name:'Arturo',role:'Mystery Title',team:'Centenario',emoji:'🏜️'},
 {name:'Frank',role:'Mystery Title',team:'Centenario',emoji:'🌙'}
];
const titles={
 planner:['🦂','El Escorpión','Loyal to the crew. Calm until it is time to strike.'],
 party:['🔥','El Fuego','Brings the energy before anyone even asks.'],
 foodie:['🌮','El Bandido','Always chasing the next bite and the next story.'],
 explorer:['🏜️','El Explorador','Built for the desert, the road, and the unknown.'],
 chill:['🍻','El Compadre','The friend everyone wants nearby.'],
 night:['🌙','El Nocturno','The legend who comes alive after sunset.']
};
const days={
 Thursday:[['3:13 PM','Land at PHX','Airport arrival and meet up.'],['4:15 PM','Casa Check-in','Seven Palms North Scottsdale.'],['5:00 PM','Grocery + Liquor Run','Stock the house.'],['8:00 PM','Pool + First Toast','Start the weekend right.'],['10:00 PM','Old Town','Uber only.']],
 Friday:[['Morning','Team Fortaleza','Breakfast and lunch duty.'],['10:00 AM','SXS Desert Adventure','Closed-toe shoes, sunscreen, water.'],['4:00 PM','Pool Recovery','Relax at the casa.'],['7:30 PM','Steak Dinner','Dress sharp.'],['10:00 PM','Nightlife','Scottsdale after dark.']],
 Saturday:[['Morning','Team G4','Breakfast and lunch duty.'],['Noon','Pool Day','Music, photos, games.'],['7:00 PM','Bachelor Dinner','Toast Cesar.'],['10:00 PM','VIP Night','The biggest night.']],
 Sunday:[['Morning','Team Centenario','Breakfast and lunch duty.'],['Afternoon','Recovery + Pool','Easy day.'],['Evening','Awards + Final Toast','Memory mode begins.']],
 Monday:[['8:00 AM','Pack + Clean','Everyone helps.'],['10:45 AM','Leave Airbnb','Head to PHX.'],['1:28 PM','Flight Home','Wheels up.']]
};
let state=JSON.parse(localStorage.getItem(storeKey)||'{}');
let tab='home';
function save(){localStorage.setItem(storeKey,JSON.stringify(state));}
function nav(){return `<div class="nav">${[['home','🏠','Home'],['passport','🎟','Passport'],['crew','👥','Crew'],['weekend','📅','Weekend'],['more','🏆','More']].map(n=>`<button class="${tab===n[0]?'active':''}" onclick="go('${n[0]}')"><div>${n[1]}</div>${n[2]}</button>`).join('')}</div>`}
function go(t){tab=t;render();}
function countdown(){const target=new Date('2026-07-09T15:13:00-07:00'); const now=new Date(); let diff=target-now; if(diff<0)return 'Fiesta Mode'; const d=Math.floor(diff/86400000),h=Math.floor(diff%86400000/3600000); return `${d} days · ${h} hours`;}
function hero(){const p=state.profile;return `<div class="hero"><div class="kicker">Scottsdale · July 9–13, 2026</div><div class="title">One Last Fiesta<br/>Before the Siesta</div><div class="subtitle">${p?`Welcome back, ${p.name}.`:'Every legend has a role. Every fiesta has a story.'}</div><div class="pillrow"><span class="pill">👑 Cesar</span><span class="pill">9 Amigos</span><span class="pill">3 Cocina Teams</span><span class="pill">${countdown()}</span></div><button class="cta" onclick="go('${p?'passport':'passport'}')">${p?'Open My Passport':'Create My Passport'}</button></div>`}
function home(){return `${hero()}<div class="section grid"><div class="stat"><b>9</b><span>Amigos</span></div><div class="stat"><b>4</b><span>Nights</span></div><div class="stat"><b>3</b><span>Teams</span></div><div class="stat"><b>1</b><span>Legendary Weekend</span></div></div><div class="section card"><h2>Next Up</h2><p class="quote">Complete your Fiesta Passport. Once your title is revealed, your place in the crew becomes official.</p></div>${state.profile?dashboardMini():''}`}
function dashboardMini(){let p=state.profile;return `<div class="card"><div style="display:flex;gap:14px;align-items:center"><div class="avatar">${p.photo?`<img src="${p.photo}">`:p.titleEmoji}</div><div><div class="role">${p.title}</div><h2 style="margin:2px 0">${p.name}</h2><div class="small">${p.team||'Team pending'} · ${p.room||'Room pending'}</div></div></div></div>`}
function passport(){if(!state.profile)return profileForm();let p=state.profile;return `<div class="topbar"><button class="mini" onclick="go('home')">← Home</button><button class="mini" onclick="editProfile()">Edit</button></div><div class="card"><div style="display:flex;gap:16px;align-items:center"><div class="avatar">${p.photo?`<img src="${p.photo}">`:p.titleEmoji}</div><div><div class="role">Fiesta Passport</div><h2 style="margin:0">${p.name}</h2><div class="small">${p.title}</div></div></div><hr/><p class="quote">“${p.motto}”</p><div class="grid"><div><b>Drink</b><p class="small">${p.drink}</p></div><div><b>Taco</b><p class="small">${p.taco}</p></div><div><b>Walk-Up Song</b><p class="small">${p.song}</p></div><div><b>Frame</b><p class="small">${p.frame}</p></div></div><b>Fun Fact</b><p class="small">${p.fact}</p></div><div class="card"><h2>Passport Stamps</h2>${['Casa Check-in','First Toast','Desert Survivor','Cocina Crew','Bachelor Dinner','Final Toast'].map(s=>`<span class="stamp">${state.stamps?.includes(s)?'✅':'⬜'} ${s}</span>`).join('')}</div>`}
function profileForm(){const frames=['Agave','Desert Sunset','Tequila Barrel','Margarita','Talavera','Gold Groom'];return `<div class="card form"><h2>Create Your Fiesta Passport</h2><p class="small">Your answers reveal your Fiesta title.</p><label>Photo</label><input id="photo" class="photoInput" type="file" accept="image/*"><label for="photo" class="photoBtn">Upload Photo</label><label>First Name</label><select id="name">${crew.map(c=>`<option>${c.name}</option>`).join('')}</select><label>Favorite Drink</label><input id="drink" placeholder="Tequila, whiskey, beer..."><label>Favorite Taco</label><input id="taco" placeholder="Carne asada, al pastor..."><label>Walk-Up Song</label><input id="song" placeholder="Song title"><label>Fun Fact</label><textarea id="fact" placeholder="Something funny about you"></textarea><label>Vacation Personality</label><select id="personality"><option value="planner">The Planner</option><option value="party">The Party Starter</option><option value="foodie">The Foodie</option><option value="explorer">The Explorer</option><option value="chill">The Chill One</option><option value="night">The Night Owl</option></select><label>Avatar Frame</label><div class="frames">${frames.map((f,i)=>`<button class="frame ${i===0?'active':''}" onclick="pickFrame(this,'${f}')">${['🌵','🌅','🥃','🍹','🎨','👑'][i]}<br>${f}</button>`).join('')}</div><button class="cta" onclick="createPassport()">Reveal My Title</button></div>`}
let selectedFrame='Agave', photoData='';
function pickFrame(el,f){selectedFrame=f;document.querySelectorAll('.frame').forEach(x=>x.classList.remove('active'));el.classList.add('active');}
document.addEventListener('change',e=>{if(e.target.id==='photo'){const r=new FileReader();r.onload=()=>photoData=r.result;r.readAsDataURL(e.target.files[0]);}});
function createPassport(){const name=$('#name').value;const base=crew.find(c=>c.name===name);let t;if(name==='Cesar')t=['👑','El Rey de la Fiesta','This weekend is yours.'];else if(name==='Daniel')t=['🤵','El Padrino','The best man. The host. The one keeping the story moving.'];else t=titles[$('#personality').value];state.profile={name,drink:$('#drink').value||'Mystery Drink',taco:$('#taco').value||'Mystery Taco',song:$('#song').value||'Mystery Song',fact:$('#fact').value||'Still classified.',frame:selectedFrame,photo:photoData,titleEmoji:t[0],title:t[1],motto:t[2],team:base?.team,room:'Room pending'};state.stamps=state.stamps||['Casa Check-in'];save();showReveal(state.profile);}
function showReveal(p){app.innerHTML=`<div class="reveal"><div class="revealBox"><div class="kicker">Your Fiesta Spirit Has Been Revealed</div><div class="bigEmoji">${p.titleEmoji}</div><div class="fiestaName">${p.title}</div><p>${p.motto}</p><button class="cta" onclick="tab='passport';render()">Accept My Title</button></div></div>`}
function editProfile(){state.profile=null;save();render();}
function crewPage(){let p=state.profile;return `<div class="section"><h2>The Crew</h2><div class="crew">${crew.map(c=>{let mine=p&&p.name===c.name;return `<div class="crewCard"><div class="avatar">${mine&&p.photo?`<img src="${p.photo}">`:c.emoji}</div><b>${c.name}</b><div class="role">${mine?p.title:c.role}</div><div class="team">${c.team}</div></div>`}).join('')}</div></div>`}
function weekend(){return `<div class="section"><h2>Weekend</h2>${Object.entries(days).map(([d,events])=>`<div class="card"><h2>${d}</h2><div class="timeline">${events.map(e=>`<div class="event"><b>${e[0]} · ${e[1]}</b><div class="small">${e[2]}</div></div>`).join('')}</div></div>`).join('')}</div>`}
function more(){return `<div class="section"><h2>Cocina Challenge</h2>${[['Fortaleza','Friday','Daniel, Kevin, Gerardo'],['G4','Saturday','David, Chucky, Jose'],['Centenario','Sunday','Arturo, Frank, Cesar']].map(t=>`<div class="card teamCard"><h2>🥃 Team ${t[0]}</h2><b>${t[1]} Breakfast + Lunch</b><p class="small">${t[2]}</p></div>`).join('')}</div><div class="card"><h2>Casa de la Fiesta</h2><p><b>Seven Palms North Scottsdale</b></p><p class="small">5617 E Yolantha Street · Pool · Putting green · Arcade · Large kitchen.</p></div><div class="card"><h2>Awards</h2>${['Cocina Champions','Fiesta MVP','Funniest Moment','Desert Legend','Photographer of the Weekend'].map(a=>`<span class="stamp">🏆 ${a}</span>`).join('')}</div><div class="card"><h2>Host Tools</h2><button class="cta danger" onclick="if(confirm('Clear saved profile on this phone?')){localStorage.removeItem(storeKey);state={};tab='home';render()} ">Clear My Saved Data</button></div>`}
function render(){app.className='app';app.innerHTML=(tab==='home'?home():tab==='passport'?passport():tab==='crew'?crewPage():tab==='weekend'?weekend():more())+nav();}
if('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js');
render();
