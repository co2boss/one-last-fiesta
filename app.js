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

const VERSION='RC1.04 — The Reveal';
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
function renderPlaza(){const name=passport.firstName||'Traveler';$('#welcome-line').textContent=`Bienvenido, ${name}`;$('#plaza-name').textContent=`${passport.avatar||'🌵 Agave'} ${name}`;$('#plaza-title').textContent=passport.title?`${passport.title} — ${TITLE_COPY[passport.title]||'Your story begins now.'}`:'Your story begins now.';$('#p-drink').textContent=passport.drink||'—';$('#p-taco').textContent=passport.taco||'—';$('#p-song').textContent=passport.song||'—';$('#p-fact').textContent=passport.funFact||'—';$('#passport-seal').textContent=`${passport.avatar||'🌵 Agave'} Seal`;$('#bp-name').textContent=name;if(passport.photo)setPhoto(passport.photo);$('#crew-grid').innerHTML=CREW.map(([n,r,c])=>`<div class="crew-member ${c}"><div>${n}<br><small>${n===name?(passport.title||r):r}</small></div></div>`).join('')}
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
 passport.stamps=[...(passport.stamps||[]),'Fiesta Title Revealed'];
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
if('serviceWorker'in navigator){navigator.serviceWorker.register('service-worker.js').catch(()=>{})}
setupInvitation();hydrateForm();if(isComplete()){renderPlaza();show('plaza')}
