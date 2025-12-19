// Tableau
const currentUser = JSON.parse(localStorage.getItem('lp_currentUser') || 'null');
const page = window.location.pathname.split('/').pop();
const protectedPages = (window.PROTECTED_PAGES && Array.isArray(window.PROTECTED_PAGES))
  ? window.PROTECTED_PAGES
  : ['dashboard.html', 'admin.html', 'moderator.html'];
if (protectedPages.includes(page)) {
  if (!currentUser) {
    // non connecté -> rediriger vers la page de connexion
    window.location.href = 'connexion.html';
  }
}

// Récupérer les utilisateurs
let users = JSON.parse(localStorage.getItem('lp_users') || '[]');

// Affiche les informations de l'utilisateur courant et les utilisateurs (admin page)
function renderUsers() {
  const tbodyUsers = document.getElementById('tbody1');
  const tbodyMods = document.getElementById('tbody2');
  const tbodyAdmins = document.getElementById('tbody3');
  if (!tbodyUsers || !tbodyMods || !tbodyAdmins) return;

  tbodyUsers.innerHTML = '';
  tbodyMods.innerHTML = '';
  tbodyAdmins.innerHTML = '';

  users.forEach(u => {
    const row = `<tr>
      <td class="px-6 py-4">${u.prenom}</td>
      <td class="px-6 py-4">${u.nom}</td>
      <td class="px-6 py-4">${u.email}</td>
      <td class="px-6 py-4">${u.role}</td>
      <td class="px-6 py-4 text-center">`;

    if (u.role === 'user') {
      tbodyUsers.innerHTML += row + `<button onclick="setRole(${u.id}, 'moderator')">Mettre modérateur</button></td></tr>`;
    } else if (u.role === 'moderator') {
      tbodyMods.innerHTML += row + `<button onclick="setRole(${u.id}, 'admin')">Promouvoir en admin</button></td></tr>`;
    } else if (u.role === 'admin') {
      tbodyAdmins.innerHTML += row + `<span>—</span></td></tr>`;
    }
  });

  // Statistiques simples
  const usersStat = document.getElementById('users_stat');
  const modsStat = document.getElementById('mods_stat');
  const adminsStat = document.getElementById('admins_stat');
  if (usersStat) usersStat.textContent = users.length;
  if (modsStat) modsStat.textContent = users.filter(u => u.role === 'moderator').length;
  if (adminsStat) adminsStat.textContent = users.filter(u => u.role === 'admin').length;
}

// Change le rôle d'un utilisateur (trouve par id)
function setRole(id, newRole) {
  users = users.map(u => u.id === id ? Object.assign({}, u, { role: newRole }) : u);
  localStorage.setItem('lp_users', JSON.stringify(users));
  renderUsers();
}

// Initialisation
// Afficher le nom et email en haut
document.addEventListener('DOMContentLoaded', function() {
  if (currentUser) {
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const roleEl = document.getElementById('role');
    if (nameEl) nameEl.textContent = currentUser.prenom || currentUser.email.split('@')[0];
    if (emailEl) emailEl.textContent = currentUser.email;
    if (roleEl) roleEl.textContent = (currentUser.role || 'user');

    // Montrer les liens de navigation selon le rôle
    if (currentUser.role === 'moderator' || currentUser.role === 'admin') {
      const nav1 = document.getElementById('nav1');
      if (nav1) nav1.style.display = 'inline-block';
    }
    if (currentUser.role === 'admin') {
      const nav2 = document.getElementById('nav2');
      if (nav2) nav2.style.display = 'inline-block';
    }
  }

  renderUsers();
  renderRequests();
});

// Rendre la liste des demandes de l'utilisateur (mes demandes)
function renderRequests() {
  const list = document.getElementById('list');
  const nomsg = document.getElementById('nomsg');
  const all = JSON.parse(localStorage.getItem('lp_attendance') || '[]');
  const mine = all.filter(r => r.userId === currentUser.id);
  console.log('[dashboard] renderRequests - found', mine.length, 'requests for', currentUser?.email);
  if (!list || !nomsg) return;
  if (!mine.length) {
    list.innerHTML = '';
    nomsg.style.display = 'block';
    return;
  }
  nomsg.style.display = 'none';
  list.innerHTML = mine.map(r => {
    const date = new Date(r.date).toLocaleDateString('fr-FR');
    return `<div class="p-4 border rounded-md"> <div class="flex justify-between"><div><strong>${date}</strong><div class="text-sm text-gray-600">Statut: ${r.status}</div></div><div>${r.status==='pending'?'<span class="text-yellow-600">En attente</span>':''}</div></div></div>`;
  }).join('');
}

// liste de toutes les demandes avec actions possibles
function renderModerator(){
  try{
    const tbody = document.getElementById('tbody');
    const nomsg = document.getElementById('nomsg');
    const all = JSON.parse(localStorage.getItem('lp_attendance') || '[]');
    const usersList = JSON.parse(localStorage.getItem('lp_users') || '[]');
    const filter = window._mod_filter || 'all';
    const visible = filter === 'all' ? all : all.filter(r => r.status === filter);
    if (!tbody) return;
    if (!visible.length){ tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center">Aucune demande</td></tr>'; if (nomsg) nomsg.style.display='block'; return; }
    nomsg && (nomsg.style.display='none');
    tbody.innerHTML = visible.map(r => {
      const u = usersList.find(x=>x.id === r.userId) || { prenom: '', nom: '', email: '' };
      const date = new Date(r.date).toLocaleDateString('fr-FR');
      const requested = new Date(r.createdAt).toLocaleDateString('fr-FR');
      const actions = r.status === 'pending' ? `<button class="px-2 py-1 bg-green-100 rounded mr-2" onclick="updateRequest(${r.id}, 'accepted')">✓</button><button class="px-2 py-1 bg-red-100 rounded" onclick="updateRequest(${r.id}, 'rejected')">✗</button>` : '-';
      return `<tr class="border-b"><td class="px-6 py-4">${u.prenom} ${u.nom}</td><td class="px-6 py-4">${u.email}</td><td class="px-6 py-4">${date}</td><td class="px-6 py-4">${r.status}</td><td class="px-6 py-4">${requested}</td><td class="px-6 py-4 text-center">${actions}</td></tr>`;
    }).join('');

    // Met à jour les statistiques
    const pendingEl = document.getElementById('pending');
    const acceptedEl = document.getElementById('accepted');
    const rejectedEl = document.getElementById('rejected');
    if (pendingEl) pendingEl.textContent = all.filter(x=>x.status==='pending').length;
    if (acceptedEl) acceptedEl.textContent = all.filter(x=>x.status==='accepted').length;
    if (rejectedEl) rejectedEl.textContent = all.filter(x=>x.status==='rejected').length;
  }catch(e){ console.warn('[dashboard] renderModerator failed', e); }
}


let calendarDate = new Date(); // mois affiché

function formatDateISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return y + '-' + m + '-' + day;
}

function renderCalendar() {
  const grid = document.getElementById('grid');
  const title = document.getElementById('title');
  if (!grid || !title) return;

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  title.textContent = calendarDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

  // index du premier jour du mois (0 = dimanche)
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();

  // load attendance
  const all = JSON.parse(localStorage.getItem('lp_attendance') || '[]');

  grid.innerHTML = '';

  // Complète les cases vides en début de grille (lundi considéré comme premier jour)
  const shift = (firstDay + 6) % 7; // convertit dimanche(0) -> 6, lundi(1)->0
  for (let i=0;i<shift;i++) {
    const cell = document.createElement('div');
    cell.className = 'h-24 bg-white rounded p-2';
    grid.appendChild(cell);
  }

  const today = new Date();
  const todayKey = formatDateISO(today);

  for (let d=1; d<=daysInMonth; d++) {
    const dt = new Date(year, month, d);
    const key = formatDateISO(dt);

    const reqForDay = all.find(r => (new Date(r.date)).toISOString().slice(0,10) === key && r.userId === currentUser.id);
    const reqAny = all.find(r => (new Date(r.date)).toISOString().slice(0,10) === key);

    const isPast = new Date(key) < new Date(todayKey);

    const btn = document.createElement('button');
    btn.className = 'h-24 w-full text-left p-2 rounded';
    btn.innerHTML = `<div class="text-sm font-medium">${d}</div>`;

    let colorClass = 'bg-white';
    if (reqForDay) {
      colorClass = reqForDay.status === 'accepted' ? 'bg-green-100' : reqForDay.status === 'rejected' ? 'bg-red-100' : 'bg-yellow-100';
    } else if (reqAny) {
      colorClass = 'bg-gray-50';
    } else if (isPast) {
      colorClass = 'bg-gray-100';
    }
    btn.classList.add(colorClass);

    btn.onclick = function() {
      if (isPast) { alert('Impossible de demander pour une date passée'); return; }
      const userExisting = all.find(r => (new Date(r.date)).toISOString().slice(0,10) === key && r.userId === currentUser.id);
      if (userExisting) { alert('Vous avez déjà une demande pour cette date.'); return; }
      if (!confirm('Créer une demande de présence pour le ' + dt.toLocaleDateString('fr-FR') + ' ?')) return;

      // Génération d'un nouvel id simple
      const newId = all.length ? Math.max.apply(null, all.map(function(r){ return r.id || 0; })) + 1 : 1;
      const req = { id: newId, userId: currentUser.id, date: dt.toISOString(), status: 'pending', createdAt: new Date().toISOString() };
      all.push(req);
      localStorage.setItem('lp_attendance', JSON.stringify(all));
      console.log('[dashboard] Request created', { id: req.id, userId: req.userId, date: req.date });
      renderRequests();
      renderCalendar();
      alert('Demande créée');
    };

    const cell = document.createElement('div');
    cell.className = 'p-1';
    cell.appendChild(btn);
    grid.appendChild(cell);
  }
}

function prev() { calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth()-1, 1); renderCalendar(); }
function next() { calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth()+1, 1); renderCalendar(); }

