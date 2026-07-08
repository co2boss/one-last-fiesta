const CREW=[['Cesar','👑 El Rey de la Fiesta','king'],['Daniel','🤵 El Padrino',''],['Kevin','Traveler',''],['Gerardo','Traveler',''],['David','Traveler',''],['Chucky','Traveler',''],['Jose','Traveler',''],['Arturo','Traveler',''],['Frank','Traveler','']];
const TITLE_COPY={
 'El Fuego':'Always brings the energy when the weekend needs a spark.',
 'El Nocturno':'The night does not truly begin until he arrives.',
 'El Compadre':'The one everyone can count on from first toast to final flight.',
 'El Explorador':'Always ready for the next trail, stop, or story.',
 'El Catador':'A man of taste, timing, and one more pour.',
 'El Bandido':'Here for legendary stories and questionable decisions.'
};
let passport=JSON.parse(localStorage.getItem('fiestaPassport')||'null')||{};
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
function show(scene){$$('.scene').forEach(x=>x.classList.remove('active'));$('#scene-'+scene).classList.add('active');window.scrollTo(0,0)}
function save(){localStorage.setItem('fiestaPassport',JSON.stringify(passport))}
function hydrate(){if(passport.firstName&&passport.title){renderPlaza();show('plaza')}}
function renderPlaza(){
 const name=passport.firstName||'Traveler';
 $('#welcome-line').textContent=`Bienvenido, ${name}`;
 $('#plaza-name').textContent=`${passport.avatar||'🌵'} ${name}`;
 $('#plaza-title').textContent=passport.title?`${passport.title} — ${TITLE_COPY[passport.title]||'Your story begins now.'}`:'Your story begins now.';
 $('#p-drink').textContent=passport.drink||'—';$('#p-taco').textContent=passport.taco||'—';$('#p-song').textContent=passport.song||'—';$('#p-fact').textContent=passport.funFact||'—';
 $('#crew-grid').innerHTML=CREW.map(([n,r,c])=>`<div class="crew-member ${c}"><div>${n}<br><small>${n===name?(passport.title||r):r}</small></div></div>`).join('');
}
$$('[data-go]').forEach(btn=>btn.addEventListener('click',()=>show(btn.dataset.go)));
$('#passport-form').addEventListener('submit',e=>{e.preventDefault();passport={...passport,firstName:$('#firstName').value.trim(),drink:$('#drink').value.trim(),taco:$('#taco').value.trim(),song:$('#song').value.trim(),funFact:$('#funFact').value.trim(),avatar:$('#avatar').value};save();show('quiz')});
$('#quiz-options').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;passport.title=b.dataset.title;save();$('#reveal-name').textContent=passport.firstName||'Traveler';$('#reveal-title').textContent=passport.title;$('#reveal-copy').textContent=TITLE_COPY[passport.title]||'Your story begins now.';show('reveal')});
$('#reset-btn').addEventListener('click',()=>{if(confirm('Clear your local Fiesta Passport?')){localStorage.removeItem('fiestaPassport');passport={};location.reload()}});
if('serviceWorker'in navigator){navigator.serviceWorker.register('service-worker.js').catch(()=>{})}
hydrate();
