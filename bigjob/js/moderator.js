// Moderation
let currentUser = null;
let requests = [];
let filter = 'all';

document.addEventListener('DOMContentLoaded', function() {
  const cu = localStorage.getItem('lp_currentUser');
  if (!cu) { window.location.href = 'connexion.html'; return; }
  currentUser = JSON.parse(cu);

  // Vérifier rôle
  const u = (JSON.parse(localStorage.getItem('lp_users') || '[]')).find(x => x.id === currentUser.id);
  if (!u || (u.role !== 'moderator' && u.role !== 'admin')) { window.location.href = 'dashboard.html'; return; }

  // Charger demandes
  requests = JSON.parse(localStorage.getItem('lp_attendance') || '[]');
  renderRequests();
  document.getElementById('year').textContent = new Date().getFullYear();
});

function renderRequests() {
  const tbody = document.getElementById('tbody');
  if (!tbody) return;
  const users = JSON.parse(localStorage.getItem('lp_users') || '[]');
  const visible = filter === 'all' ? requests : requests.filter(r => r.status === filter);
  if (!visible.length) { tbody.innerHTML = '<tr><td colspan="5">Aucune demande</td></tr>'; return; }

  tbody.innerHTML = visible.map(r => {
    const u = users.find(x => x.id === r.userId) || { prenom: '', nom: '', email: '' };
    const date = new Date(r.date).toLocaleDateString('fr-FR');
    const actions = r.status === 'pending' ? `<button onclick="updateRequest(${r.id}, 'accepted')">✓</button> <button onclick="updateRequest(${r.id}, 'rejected')">✗</button>` : '-';
    return `<tr><td>${u.prenom} ${u.nom}</td><td>${u.email}</td><td>${date}</td><td>${r.status}</td><td>${actions}</td></tr>`;
  }).join('');

  // Stats
  const pendingEl = document.getElementById('pending');
  const acceptedEl = document.getElementById('accepted');
  const rejectedEl = document.getElementById('rejected');
  if (pendingEl) pendingEl.textContent = requests.filter(r => r.status === 'pending').length;
  if (acceptedEl) acceptedEl.textContent = requests.filter(r => r.status === 'accepted').length;
  if (rejectedEl) rejectedEl.textContent = requests.filter(r => r.status === 'rejected').length;
}

function renderModerator() {
  try {
    requests = JSON.parse(localStorage.getItem('lp_attendance') || '[]');
    filter = window._mod_filter || 'all';
    renderRequests();
  } catch (e) { console.warn('[moderator] renderModerator failed', e); }
}

if (!window.renderModerator) window.renderModerator = renderModerator;
