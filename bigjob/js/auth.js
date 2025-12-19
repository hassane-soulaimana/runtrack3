// Authentification
const allowedDomain = 'laplateforme.io';
const USERS_KEY = 'lp_users';
const CURRENT_KEY = 'lp_currentUser';

function getUsers(){
  try{
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  }catch(e){
    return [];
  }
}

function saveUsers(users){
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function show(msg, containerId, autoHideMs){
  if (containerId){
    const el = document.getElementById(containerId);
    if (el){
      const inner = el.querySelector('#alertMessage') || el;
      inner.textContent = msg;
      el.style.display = 'block';
      if (autoHideMs) setTimeout(function(){ el.style.display = 'none'; }, autoHideMs);
      return;
    }
  }
  alert(msg);
}

document.addEventListener('DOMContentLoaded', function(){
  // Assure la présence de données d'exemple (utilisateurs + demandes)
  (function ensureSample(){
    try{
      const sample = [
        { id: 1, prenom: 'Admin', nom: 'LP', email: 'admin@laplateforme.io', password: 'Admin@123', role: 'admin' },
        { id: 2, prenom: 'Modérateur', nom: 'Test', email: 'moderator@laplateforme.io', password: 'Moderator@123', role: 'moderator' },
        { id: 3, prenom: 'Utilisateur', nom: 'Demo', email: 'user@laplateforme.io', password: 'User@123', role: 'user' }
      ];
      const uRaw = localStorage.getItem(USERS_KEY);
      if (!uRaw) { localStorage.setItem(USERS_KEY, JSON.stringify(sample)); }
      else { try{ const parsed = JSON.parse(uRaw); const hasAdmin = Array.isArray(parsed) && parsed.some(x=>x&&x.email==='admin@laplateforme.io'); if (!hasAdmin) localStorage.setItem(USERS_KEY, JSON.stringify(sample)); }catch(e){ localStorage.setItem(USERS_KEY, JSON.stringify(sample)); } }
      if (!localStorage.getItem('lp_attendance')){
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1).toISOString();
        const inTwo = new Date(now.getFullYear(), now.getMonth(), now.getDate()+2).toISOString();
        localStorage.setItem('lp_attendance', JSON.stringify([ { id:1, userId:3, date:tomorrow, status:'pending', createdAt: new Date().toISOString() }, { id:2, userId:3, date:inTwo, status:'pending', createdAt: new Date().toISOString() } ]));
      }
    }catch(e){ console.warn('[auth] ensureSample failed', e); }
  })();

  //Modification de la navigation //utilisateur connecté
  (function initNav(){
    try{
      const current = JSON.parse(localStorage.getItem(CURRENT_KEY) || 'null');
      const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
      if (!current) return;
      const menu = document.getElementById('menu');
      if (menu){
        const signA = menu.querySelector('a[href="inscription.html"]');
        const connA = menu.querySelector('a[href="connexion.html"]');
        if (signA){ const li = signA.closest('li'); if (li) li.innerHTML = `<a href="dashboard.html" class="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-gray-100 shadow">Profil</a>`; }
        if (connA){ const li = connA.closest('li'); if (li) li.innerHTML = `<a href="dashboard.html#calendar" class="px-4 py-2 border border-white text-white rounded-lg hover:bg-white/10">Calendrier</a>`; }
        if (!menu.querySelector('.user-dropdown')){
          const dropdownLi = document.createElement('li'); dropdownLi.className='relative user-dropdown';
          dropdownLi.innerHTML = `<div class="relative"><button id="user-btn" class="flex items-center gap-2 text-white focus:outline-none"><span>Bonjour, ${current.prenom||current.email}</span><i class="fas fa-caret-down ml-2 text-white"></i></button><div id="user-menu" class="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg hidden z-50"><a href="dashboard.html" class="block px-4 py-2 hover:bg-gray-100">Profil</a><button id="logout-btn" class="w-full text-left px-4 py-2 hover:bg-gray-100">Se déconnecter</button></div></div>`;
          menu.appendChild(dropdownLi);
          const userBtn = dropdownLi.querySelector('#user-btn'); const userMenu = dropdownLi.querySelector('#user-menu'); const logoutBtn = dropdownLi.querySelector('#logout-btn');
          if (userBtn && userMenu){ userBtn.addEventListener('click', e=>{ e.stopPropagation(); userMenu.classList.toggle('hidden'); }); document.addEventListener('click', ()=>{ if (!userMenu.classList.contains('hidden')) userMenu.classList.add('hidden'); }); }
          if (logoutBtn) logoutBtn.addEventListener('click', function(){ localStorage.removeItem(CURRENT_KEY); window.location.href='index.html'; });
        }
      }
      const footerNav = document.querySelector('footer nav');
      if (footerNav){ const ins=footerNav.querySelector('a[href="inscription.html"]'); const con=footerNav.querySelector('a[href="connexion.html"]'); if (ins){ ins.textContent='Profil'; ins.setAttribute('href','dashboard.html'); } if (con){ con.textContent='Calendrier'; con.setAttribute('href','dashboard.html#calendar'); } if (!footerNav.querySelector('.footer-logout')){ const logoutA = document.createElement('a'); logoutA.href='#'; logoutA.className='text-gray-300 hover:text-white ml-4 footer-logout'; logoutA.textContent='Se déconnecter'; logoutA.addEventListener('click', e=>{ e.preventDefault(); localStorage.removeItem(CURRENT_KEY); window.location.href='index.html'; }); footerNav.appendChild(logoutA); } }
    }catch(e){ console.warn('[auth] initNav failed', e); }
  })();

  const signup = document.getElementById('signup');
  if (signup){
    signup.addEventListener('submit', function(e){
      e.preventDefault();
      const f = signup.elements;
      const prenom = (f['prenom'].value || '').trim();
      const nom = (f['nom'].value || '').trim();
      const email = ((f['email'].value||'').trim()).toLowerCase();
      const password = f['password'].value || '';
      const confirm = f['passwordConfirm'].value || '';
      if (!prenom || !nom || !email || !password || !confirm){ show('Tous les champs sont obligatoires','alertsignup'); return; }
      if (!email.endsWith('@'+allowedDomain)){ show('Email invalide (doit finir par @'+allowedDomain+')','alertsignup'); return; }
      if (password.length < 8){ show('Mot de passe trop court (8 caractères min)','alertsignup'); return; }
      if (password !== confirm){ show('Les mots de passe ne correspondent pas','alertsignup'); return; }
      const users = getUsers();
      if (users.some(u => (u.email||'').toLowerCase() === email)){ show('Email déjà utilisé','alertsignup'); return; }
      const id = users.length ? Math.max(...users.map(u=>u.id||0))+1 : 1;
      users.push({ id, prenom, nom, email, password, role: 'user' });
      saveUsers(users);
      show('Inscription réussie !','alertsignup',1200);
      signup.reset();
      setTimeout(()=>window.location.href='connexion.html',1200);
    });
  }

  // Connexion
  const login = document.getElementById('login');
  if (login){
    login.addEventListener('submit', function(e){
      e.preventDefault();
      const f = login.elements;
      const email = ((f['email'].value||'').trim()).toLowerCase();
      const password = f['password'].value || '';
      const users = getUsers();
      const user = users.find(u => (u.email||'').toLowerCase() === email && u.password === password);
      if (!user){ show('Email ou mot de passe incorrect','alertlogin'); return; }
      localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
      show('Connexion réussie !','alertlogin',800);
      setTimeout(()=>window.location.href='dashboard.html',800);
    });
  }
});



(function initSignupControls(){
  const signupForm = document.getElementById('signup');
  if (!signupForm) return;

  const prenom = signupForm.elements['prenom'];
  const nom = signupForm.elements['nom'];
  const email = signupForm.elements['email'];
  const password = signupForm.elements['password'];
  const passwordConfirm = signupForm.elements['passwordConfirm'];
  const btn = document.getElementById('signupBtn');
  const alertBox = document.getElementById('alertsignup');

  function emailValidDomain(v){
    if (!v || v.indexOf('@') === -1) return false;
    return v.split('@')[1].toLowerCase() === allowedDomain;
  }

  function passwordOk(v){
    return v && v.length >= 8 && /[A-Z]/.test(v) && /[0-9]/.test(v) && /[^A-Za-z0-9]/.test(v);
  }

  function emailAvailable(v){
    try{ const users = getUsers(); return !users.some(u => (u.email||'').toLowerCase() === v.toLowerCase()); }catch(e){ return true; }
  }

  function showLocal(msg){
    if (!alertBox) { return alert(msg); }
    const inner = alertBox.querySelector('#alertMessage') || alertBox;
    inner.textContent = msg;
    alertBox.style.display = 'block';
  }
  function hideLocal(){ if (alertBox) alertBox.style.display = 'none'; }

  function validate(){
    hideLocal();
    const p = (prenom && prenom.value.trim()) || '';
    const n = (nom && nom.value.trim()) || '';
    const e = (email && email.value.trim()) || '';
    const pw = (password && password.value) || '';
    const pc = (passwordConfirm && passwordConfirm.value) || '';

    if (!p || !n) return { ok:false, reason: 'Prénom et nom requis.' };
    if (!e) return { ok:false, reason: 'Email requis.' };
    if (!emailValidDomain(e)) return { ok:false, reason: 'Email doit finir par @' + allowedDomain };
    if (!emailAvailable(e)) return { ok:false, reason: 'Email déjà utilisé.' };
    if (!pw) return { ok:false, reason: 'Mot de passe requis.' };
    if (!passwordOk(pw)) return { ok:false, reason: 'Mot de passe doit faire 8+ et contenir majuscule, chiffre et caractère spécial.' };
    if (pw !== pc) return { ok:false, reason: 'Les mots de passe ne correspondent pas.' };
    return { ok:true };
  }

  [prenom, nom, email, password, passwordConfirm].forEach(el => {
    if (!el) return;
    el.addEventListener('input', () => {
      try{ const res = validate(); btn.disabled = !res.ok; if (res.ok) hideLocal(); }catch(e){ btn.disabled = true; }
    });
  });

  // État initial du formulaire (bouton désactivé tant que non valide)
  if (btn) btn.disabled = true;

  // Empêche l'envoi final si le formulaire n'est pas valide (protection UX)
  signupForm.addEventListener('submit', function(e){
    const res = validate();
    if (!res.ok) { e.preventDefault(); showLocal(res.reason); return false; }
    hideLocal();
    return true;
  });
})();
