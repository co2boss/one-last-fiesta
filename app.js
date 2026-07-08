const CREW=[['Cesar','👑 El Rey de la Fiesta','king'],['Daniel','🤵 El Padrino',''],['Kevin','Traveler',''],['Gerardo','Traveler',''],['David','Traveler',''],['Chucky','Traveler',''],['Jose','Traveler',''],['Arturo','Traveler',''],['Frank','Traveler','']];

const TITLE_COPY={
 'El Rey de la Fiesta':'The man of the weekend. The reason the crew has gathered.',
 'El Padrino':'Keeper of the keys, protector of the plan, and guardian of the weekend.',
 'El Fuego':'Always brings the energy when the weekend needs a spark.',
 'El Nocturno':'The night does not truly begin until he arrives.',
 'El Compadre':'The one everyone can count on from first toast to final flight.',
 'El Explorador':'Always ready for the next trail, stop, or story.',
 'El Catador':'A man of taste, timing, and one more pour.',
 'El Bandido':'Here for legendary stories and questionable decisions.',
 'El Escorpión':'Calm, loyal, and dangerous only when the moment demands it.',
 'El Águila':'Sees the whole field, protects the crew, and moves with purpose.'
};

const QUIZ=[
 {q:'When the trip starts, you are usually...',a:[['Finding the next adventure','El Explorador'],['Making sure everyone is good','El Compadre'],['Starting the energy early','El Fuego'],['Saving it for late night','El Nocturno']]},
 {q:'Pick your ideal Scottsdale moment.',a:[['Desert ride with dust everywhere','El Explorador'],['A perfect tequila pour','El Catador'],['A legendary late-night story','El Bandido'],['A calm sunset with the crew','El Escorpión']]},
 {q:'At the Airbnb, you are most likely to...',a:[['Start the playlist and set the vibe','El Fuego'],['Make sure everyone has food and water','El Compadre'],['Find the best spot to relax','El Escorpión'],['Convince someone to go out again','El Nocturno']]},
 {q:'Choose your travel weakness.',a:[['One more stop before heading back','El Explorador'],['One more tequila recommendation','El Catador'],['One more story that starts with “remember when”','El Bandido'],['One more check to make sure the plan is solid','El Águila']]},
 {q:'The crew needs you because...',a:[['You bring the spark','El Fuego'],['You bring the taste','El Catador'],['You keep the group together','El Compadre'],['You see what others miss','El Águila']]}
];

const VERSION='RC1.05 — The Plaza';
const STORAGE_KEY='fiestaPassport';
let passport=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null')||{};
let quizIndex=0;
let quizScores={};
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

function toast(message){const existing=document.querySelector('.toast');if(existing)existing.remove();const el=document.createElement('div');el.className='toast';el.textContent=message;document.body.appendChild(el);setTimeout(()=>el.remove(),2600)}
function show(scene){const current=document.querySelector('.scene.active');if(current){current.classList.add('leaving');setTimeout(()=>current.classList.remove('leaving'),230)}$$('.scene').forEach(x=>x.classList.remove('active'));const next=$('#scene-'+scene);if(next)next.classList.add('active');window.scrollTo({top:0,behavior:'smooth'});if(scene==='quiz')startQuiz();}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(passport))}
function isComplete(){return Boolean(passport.firstName&&passport.title)}
function setupInvitation(){const continueBtn=$('#continue-btn');if(!continueBtn)return;if(isComplete()){continueBtn.hidden=false;continueBtn.textContent=`Welcome back, ${passport.firstName}`;continueBtn.addEventListener('click',()=>{renderPlaza();show('plaza');toast('Your Fiesta Passport is ready.')})}}
function hydrateForm(){const fields=['firstName','drink','taco','song','funFact','avatar'];fields.forEach(id=>{const el=$('#'+id); if(el&&passport[id]!==undefined)el.value=passport[id]}); if(passport.photo) setPhoto(passport.photo); if(passport.avatar) selectAvatar(passport.avatar,false)}
function setPhoto(src){const prev=$('#photo-preview');const small=$('#passport-photo-small');const html=`<img src="${src}" alt="Passport photo">`; if(prev)prev.innerHTML=html;if(small)small.innerHTML=html;}
function selectAvatar(value,saveNow=true){const hidden=$('#avatar'); if(hidden) hidden.value=value; $$('#avatar-grid button').forEach(b=>b.classList.toggle('selected',b.dataset.avatar===value)); if(saveNow){passport.avatar=value;save();}}
function renderPlaza(){
 const name=passport.firstName||'Traveler';
 $('#welcome-line').textContent=`Bienvenido, ${name}`;
 $('#plaza-name').textContent=`${passport.avatar||'🌵 Agave'} ${name}`;
 $('#plaza-title').textContent=passport.title?`${passport.title} — ${TITLE_COPY[passport.title]||'Your story begins now.'}`:'Your story begins now.';
 $('#p-drink').textContent=passport.drink||'—';$('#p-taco').textContent=passport.taco||'—';$('#p-song').textContent=passport.song||'—';$('#p-fact').textContent=passport.funFact||'—';
 $('#passport-seal').textContent=`${passport.avatar||'🌵 Agave'} Seal`;$('#bp-name').textContent=name;
 if(passport.photo)setPhoto(passport.photo);
 renderSeats(name);
 renderCrew(name);
 renderStamps();
 updateCountdown();
}
function renderSeats(name){
 const grid=$('#seat-grid'); if(!grid)return;
 grid.innerHTML=CREW.map(([n,r,c])=>{
   const active=n.toLowerCase()===String(name).toLowerCase();
   const role=active?(passport.title||r):r;
   const icon=active?(passport.photo?`<img src="${passport.photo}" alt="${n}">`:titleIcon(passport.title||role)):(n==='Cesar'?'👑':'👤');
   return `<div class="seat-card ${c} ${active?'active':''} ${!active&&r==='Traveler'?'empty':''}"><div class="seat-icon">${icon}</div><strong>${n}</strong><small>${role}</small></div>`
 }).join('');
 const complete=CREW.length;
 const caption=$('#plaza-caption'); if(caption) caption.textContent=`${name} has arrived. ${complete} seats are reserved around the campfire.`;
}
function renderCrew(name){
 const crew=$('#crew-grid'); if(!crew)return;
 crew.innerHTML=CREW.map(([n,r,c])=>`<div class="crew-member ${c}"><div>${n}<br><small>${n===name?(passport.title||r):r}</small></div></div>`).join('')
}
const STAMPS=['Casa Check-In','First Toast','Desert Adventure','Cocina Crew','Pool Day','Bachelor Dinner','Awards Night','Final Toast'];
function renderStamps(){
 const el=$('#stamp-grid'); if(!el)return;
 const earned=new Set(passport.stamps||[]);
 el.innerHTML=STAMPS.map(s=>`<button class="stamp ${earned.has(s)?'done':''}" data-stamp="${s}"><span>${earned.has(s)?'✅':'🛂'}</span>${s}</button>`).join('');
}
function toggleStamp(stamp){
 const stamps=new Set(passport.stamps||[]);
 stamps.has(stamp)?stamps.delete(stamp):stamps.add(stamp);
 passport.stamps=[...stamps]; save(); renderStamps(); toast(stamps.has(stamp)?`${stamp} stamped.`:`${stamp} removed.`);
}
function updateCountdown(){
 const el=$('#countdown'); if(!el)return;
 const target=new Date('2026-07-09T15:13:00-07:00').getTime();
 const diff=target-Date.now();
 if(diff<=0){el.textContent='The fiesta has begun.';return;}
 const d=Math.floor(diff/86400000); const h=Math.floor((diff%86400000)/3600000); const m=Math.floor((diff%3600000)/60000);
 el.textContent=`Departure countdown: ${d}d ${h}h ${m}m`;
}

function titleIcon(title){
 const icons={
  'El Rey de la Fiesta':'👑','El Padrino':'🤵','El Fuego':'🔥','El Nocturno':'🌙','El Compadre':'🍻','El Explorador':'🏜️','El Catador':'🥃','El Bandido':'🌮','El Escorpión':'🦂','El Águila':'🦅'
 };
 return icons[title]||'🌵';
}
function revealTitle(title){
 const n=(passport.firstName||'').trim().toLowerCase();
 if(n==='cesar') title='El Rey de la Fiesta';
 if(n==='daniel') title='El Padrino';
 passport.title=title;
 passport.stamps=[...new Set([...(passport.stamps||[]),'Fiesta Title Revealed'])];
 save();
 $('#reveal-name').textContent=passport.firstName||'Traveler';
 $('#reveal-title').textContent=passport.title;
 $('#reveal-copy').textContent=TITLE_COPY[passport.title]||'Your story begins now.';
 $('#reveal-emblem').textContent=titleIcon(passport.title);
 $('#reveal-stamp').textContent=new Date().toLocaleDateString(undefined,{month:'short',day:'numeric'});
 show('reveal');
 const drum=$('#reveal-drum');
 const lines=['Consulting the desert...','Lighting the campfire...','Stamping your passport...','Your title is ready.'];
 lines.forEach((line,i)=>setTimeout(()=>{if(drum)drum.textContent=line},650*i));
 setTimeout(()=>toast('Passport stamped. Title revealed.'),2200);
}
function startQuiz(){quizIndex=0;quizScores={};renderQuiz()}
function renderQuiz(){const q=QUIZ[quizIndex];const progress=Math.round(((quizIndex+1)/QUIZ.length)*100);const bar=$('#quiz-progress');const label=$('#quiz-progress-label'); if(label) label.textContent=`Question ${quizIndex+1} of ${QUIZ.length}`;bar.textContent=`Question ${quizIndex+1} of ${QUIZ.length}`;bar.style.setProperty('--progress',progress+'%');$('#quiz-card').innerHTML=`<h3>${q.q}</h3>`+q.a.map(([label,title])=>`<button class="quiz-answer" data-title="${title}">${label}</button>`).join('')}
function answerQuiz(title){quizScores[title]=(quizScores[title]||0)+1;quizIndex++;if(quizIndex>=QUIZ.length){const winner=Object.entries(quizScores).sort((a,b)=>b[1]-a[1])[0]?.[0]||title;revealTitle(winner)}else{renderQuiz()}}

$$('[data-go]').forEach(btn=>btn.addEventListener('click',()=>show(btn.dataset.go)));
const form=$('#passport-form');if(form){form.addEventListener('submit',e=>{e.preventDefault();passport={...passport,firstName:$('#firstName').value.trim(),drink:$('#drink').value.trim(),taco:$('#taco').value.trim(),song:$('#song').value.trim(),funFact:$('#funFact').value.trim(),avatar:$('#avatar').value};save();toast('Passport stamped.');show('journey')})}
const photoInput=$('#photoInput');if(photoInput){photoInput.addEventListener('change',e=>{const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{passport.photo=reader.result;save();setPhoto(passport.photo);toast('Passport photo added.')};reader.readAsDataURL(file)})}
const avatarGrid=$('#avatar-grid');if(avatarGrid){avatarGrid.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;selectAvatar(b.dataset.avatar)})}
const quizCard=$('#quiz-card');if(quizCard){quizCard.addEventListener('click',e=>{const b=e.target.closest('.quiz-answer');if(!b)return;answerQuiz(b.dataset.title)})}
const resetBtn=$('#reset-btn');if(resetBtn){resetBtn.addEventListener('click',()=>{if(confirm('Clear your local Fiesta Passport?')){localStorage.removeItem(STORAGE_KEY);passport={};location.reload()}})}
const enterPlazaBtn=document.querySelector('#scene-reveal [data-go="plaza"]');if(enterPlazaBtn){enterPlazaBtn.addEventListener('click',()=>renderPlaza())}

const stampGrid=$('#stamp-grid');if(stampGrid){stampGrid.addEventListener('click',e=>{const b=e.target.closest('.stamp');if(!b)return;toggleStamp(b.dataset.stamp)})}
$$('[data-jump]').forEach(btn=>btn.addEventListener('click',()=>{const target=$('#'+btn.dataset.jump); if(target) target.scrollIntoView({behavior:'smooth',block:'start'})}));
setInterval(updateCountdown,60000);

if('serviceWorker'in navigator){navigator.serviceWorker.register('service-worker.js').catch(()=>{})}
setupInvitation();hydrateForm();if(isComplete()){renderPlaza();show('plaza')}
