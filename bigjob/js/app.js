console.log('BigJob loaded');
window.LP = window.LP || {};

// Change  les roles
window.LP.changeRole = function(id, role){
  try{
    const users = JSON.parse(localStorage.getItem('lp_users') || '[]');
    const u = users.find(x => x.id === id);
    if (!u) return alert('Utilisateur introuvable');
    const current = JSON.parse(localStorage.getItem('lp_currentUser') || 'null');
    if (current && current.id === id && role !== 'admin') return alert('Vous ne pouvez pas retirer votre rôle admin');
    u.role = role;
    localStorage.setItem('lp_users', JSON.stringify(users));
    if (current && current.id === id){ current.role = role; localStorage.setItem('lp_currentUser', JSON.stringify(current)); }
    if (typeof window.renderUsers === 'function') try{ window.renderUsers(); }catch(e){}
    if (typeof window.renderAll === 'function') try{ window.renderAll(); }catch(e){}
    console.log('[LP] changeRole', { id: u.id, email: u.email, newRole: u.role });
  }catch(e){ console.warn('[LP] changeRole failed', e); }
};

window.LP.removeRole = function(id){
  if (!confirm('Retirer le rôle de cet utilisateur ?')) return;
  try{
    const users = JSON.parse(localStorage.getItem('lp_users') || '[]');
    const u = users.find(x => x.id === id);
    if (!u) return alert('Utilisateur introuvable');
    const current = JSON.parse(localStorage.getItem('lp_currentUser') || 'null');
    if (current && current.id === id && current.role === 'admin') return alert('Vous ne pouvez pas retirer votre propre rôle admin');
    u.role = 'user';
    localStorage.setItem('lp_users', JSON.stringify(users));
    if (typeof window.renderUsers === 'function') try{ window.renderUsers(); }catch(e){}
    if (typeof window.renderAll === 'function') try{ window.renderAll(); }catch(e){}
    console.log('[LP] removeRole', { id: u.id, email: u.email });
  }catch(e){ console.warn('[LP] removeRole failed', e); }
};

// Logout
window.LP.logout = function(confirmArg){
  try{
    if (confirmArg === undefined) confirmArg = true;
    if (confirmArg){ if (!confirm('Déconnexion ?')) return; }
    localStorage.removeItem('lp_currentUser');
    window.location.href = 'index.html';
  }catch(e){ console.warn('[LP] logout failed', e); }
};

window.LP.updateRequest = function(id, status){
  try{
    const requests = JSON.parse(localStorage.getItem('lp_attendance') || '[]');
    const r = requests.find(x => x.id === id);
    if (!r) return alert('Demande introuvable');
    r.status = status;
    r.updatedAt = new Date().toISOString();
    const current = JSON.parse(localStorage.getItem('lp_currentUser') || 'null');
    if (current) r.moderatorId = current.id;
    localStorage.setItem('lp_attendance', JSON.stringify(requests));
    if (typeof window.renderRequests === 'function') try{ window.renderRequests(); }catch(e){}
    if (typeof window.renderModerator === 'function') try{ window.renderModerator(); }catch(e){}
  }catch(e){ console.warn('[LP] updateRequest failed', e); }
};

window.LP.flt = function(f){ try{ window._mod_filter = f; if (typeof window.renderModerator === 'function') window.renderModerator(); }catch(e){} };

window.LP.tabs = function(t){
  const sections = ['users','mods','admins'];
  sections.forEach(s => { const el = document.getElementById(s); if (el) el.style.display = (s === (t === 'moderators' ? 'mods' : t === 'admins' ? 'admins' : 'users')) ? 'block' : 'none'; });
  const mapBtn = { users: 'tu', moderators: 'tm', admins: 'ta' };
  Object.values(mapBtn).forEach(id => { const b = document.getElementById(id); if (b) b.classList && b.classList.remove('border-b-2','border-b-blue-500'); });
  const active = mapBtn[t] || mapBtn['users']; const activeBtn = document.getElementById(active); if (activeBtn) activeBtn.classList && activeBtn.classList.add('border-b-2','border-b-blue-500');
};
if (!window.changeRole) window.changeRole = window.LP.changeRole;
if (!window.removeRole) window.removeRole = window.LP.removeRole;
if (!window.logout) window.logout = window.LP.logout;
if (!window.updateRequest) window.updateRequest = window.LP.updateRequest;
if (!window.flt) window.flt = window.LP.flt;
if (!window.tabs) window.tabs = window.LP.tabs;

(function ensureSample(){
  const key = 'lp_users';
  const existing = localStorage.getItem(key);
  const sample = [
    { id: 1, prenom: 'Admin', nom: 'LP', email: 'admin@laplateforme.io', password: 'Admin@123', role: 'admin' },
    { id: 2, prenom: 'Modérateur', nom: 'Test', email: 'moderator@laplateforme.io', password: 'Moderator@123', role: 'moderator' },
    { id: 3, prenom: 'Utilisateur', nom: 'Demo', email: 'user@laplateforme.io', password: 'User@123', role: 'user' }
  ];

  if (!existing) {
    localStorage.setItem(key, JSON.stringify(sample));
    console.log('[app] Sample users created:', sample.map(u=>u.email));
  } else {
    try {
      const parsed = JSON.parse(existing);
      const hasAdmin = Array.isArray(parsed) && parsed.some(u => u && u.email === 'admin@laplateforme.io');
      if (!hasAdmin) {
        localStorage.setItem(key, JSON.stringify(sample));
        console.log('[app] lp_users looked unexpected — reseeded sample users');
      } else {
        console.log('[app] lp_users found, looks OK');
      }
    } catch (e) {
      // If parsing failed, reseed to recover
      localStorage.setItem(key, JSON.stringify(sample));
      console.warn('[app] Failed to parse lp_users, reseeded sample users', e);
    }
  }

  // Créer quelques demandes d'exemple
  const attKey = 'lp_attendance';
  if (!localStorage.getItem(attKey)) {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
    const inTwoDays = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2).toISOString();
    const sampleReq = [
      { id: 1, userId: 3, date: tomorrow, status: 'pending', createdAt: new Date().toISOString() },
      { id: 2, userId: 3, date: inTwoDays, status: 'pending', createdAt: new Date().toISOString() }
    ];
    localStorage.setItem(attKey, JSON.stringify(sampleReq));
    console.log('[app] Sample attendance requests created:', sampleReq.map(r=>({id:r.id, userId:r.userId, date:r.date}))); 
  }
})();
