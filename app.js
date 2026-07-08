const CREW=[['Cesar','👑 El Rey de la Fiesta','king'],['Daniel','🤵 El Padrino',''],['Kevin','Traveler',''],['Gerardo','Traveler',''],['David','Traveler',''],['Chucky','Traveler',''],['Jose','Traveler',''],['Arturo','Traveler',''],['Frank','Traveler','']];

const TITLE_COPY={
 'El Fuego':'Always brings the energy when the weekend needs a spark.',
 'El Nocturno':'The night does not truly begin until he arrives.',
 'El Compadre':'The one everyone can count on from first toast to final flight.',
 'El Explorador':'Always ready for the next trail, stop, or story.',
 'El Catador':'A man of taste, timing, and one more pour.',
 'El Bandido':'Here for legendary stories and questionable decisions.'
};

const VERSION='RC1.01 — The Invitation';
const STORAGE_KEY='fiestaPassport';

let passport=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null')||{};
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

function toast(message){
 const existing=document.querySelector('.toast');
 if(existing) existing.remove();
 const el=document.createElement('div');
 el.className='toast';
 el.textContent=message;
 document.body.appendChild(el);
 setTimeout(()=>el.remove(),2600);
}

function show(scene){
 const current=document.querySelector('.scene.active');
 if(current){
   current.classList.add('leaving');
   setTimeout(()=>current.classList.remove('leaving'),230);
 }
 $$('.scene').forEach(x=>x.classList.remove('active'));
 const next=$('#scene-'+scene);
 if(next) next.classList.add('active');
 window.scrollTo({top:0,behavior:'smooth'});
}

function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(passport));}

function isComplete(){return Boolean(passport.firstName&&passport.title);}

function setupInvitation(){
 const continueBtn=$('#continue-btn');
 if(!continueBtn) return;
 if(isComplete()){
   continueBtn.hidden=false;
   continueBtn.textContent=`Welcome back, ${passport.firstName}`;
   continueBtn.addEventListener('click',()=>{renderPlaza();show('plaza');toast('Your Fiesta Passport is ready.');});
 }
}

function hydrateForm(){
 if(!passport.firstName) return;
 const fields=['firstName','drink','taco','song','funFact','avatar'];
 fields.forEach(id=>{const el=$('#'+id); if(el && passport[id]!==undefined) el.value=passport[id];});
}

function renderPlaza(){
 const name=passport.firstName||'Traveler';
 $('#welcome-line').textContent=`Bienvenido, ${name}`;
 $('#plaza-name').textContent=`${passport.avatar||'🌵 Agave'} ${name}`;
 $('#plaza-title').textContent=passport.title?`${passport.title} — ${TITLE_COPY[passport.title]||'Your story begins now.'}`:'Your story begins now.';
 $('#p-drink').textContent=passport.drink||'—';
 $('#p-taco').textContent=passport.taco||'—';
 $('#p-song').textContent=passport.song||'—';
 $('#p-fact').textContent=passport.funFact||'—';
 $('#crew-grid').innerHTML=CREW.map(([n,r,c])=>`<div class="crew-member ${c}"><div>${n}<br><small>${n===name?(passport.title||r):r}</small></div></div>`).join('');
}

function revealTitle(title){
 passport.title=title;
 save();
 $('#reveal-name').textContent=passport.firstName||'Traveler';
 $('#reveal-title').textContent=passport.title;
 $('#reveal-copy').textContent=TITLE_COPY[passport.title]||'Your story begins now.';
 show('reveal');
 setTimeout(()=>toast('Passport stamped. Title revealed.'),550);
}

$$('[data-go]').forEach(btn=>btn.addEventListener('click',()=>show(btn.dataset.go)));

const form=$('#passport-form');
if(form){
 form.addEventListener('submit',e=>{
   e.preventDefault();
   passport={...passport,
     firstName:$('#firstName').value.trim(),
     drink:$('#drink').value.trim(),
     taco:$('#taco').value.trim(),
     song:$('#song').value.trim(),
     funFact:$('#funFact').value.trim(),
     avatar:$('#avatar').value
   };
   save();
   toast('Passport details saved.');
   show('quiz');
 });
}

const quiz=$('#quiz-options');
if(quiz){
 quiz.addEventListener('click',e=>{
   const b=e.target.closest('button');
   if(!b) return;
   revealTitle(b.dataset.title);
 });
}

const resetBtn=$('#reset-btn');
if(resetBtn){
 resetBtn.addEventListener('click',()=>{
   if(confirm('Clear your local Fiesta Passport?')){
     localStorage.removeItem(STORAGE_KEY);
     passport={};
     location.reload();
   }
 });
}

const enterPlazaBtn=document.querySelector('#scene-reveal [data-go="plaza"]');
if(enterPlazaBtn){
 enterPlazaBtn.addEventListener('click',()=>renderPlaza());
}

if('serviceWorker'in navigator){navigator.serviceWorker.register('service-worker.js').catch(()=>{});}

setupInvitation();
hydrateForm();
if(isComplete()){
  // Returning travelers start at the Plaza, but the splash still has a welcome-back path if they reset later.
  renderPlaza();
  show('plaza');
}
