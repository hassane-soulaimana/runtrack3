// Administration
let currentUser = null;
let users = [];

document.addEventListener('DOMContentLoaded', function() {
  try {
    const cuRaw = localStorage.getItem('lp_currentUser');
    if (!cuRaw) {
      alert('Veuillez vous connecter en tant qu\'administrateur.');
      return window.location.href = 'connexion.html';
    }
    currentUser = JSON.parse(cuRaw);

    // Charger les utilisateurs depuis le stockage (lecture à jour)
    users = JSON.parse(localStorage.getItem('lp_users') || '[]');

    // Vérifier le rôle
    const me = users.find(u => u.id === currentUser.id);
    if (!me || me.role !== 'admin'){
      alert('Accès réservé aux administrateurs.');
      return window.location.href = 'admin.html';
    }

    const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
    renderAll();
  } catch (e) {
    console.error('[admin] init failed', e);
    window.location.href = 'connexion.html';
  }
});

function save() {
  localStorage.setItem('lp_users', JSON.stringify(users));
}


function renderAll() {
  users = JSON.parse(localStorage.getItem('lp_users') || '[]');

  if (typeof window.renderUsers === 'function'){
    try { window.renderUsers(); return; } catch(e){ console.warn('[admin] renderUsers failed, falling back', e); }
  }

  const tbody = document.getElementById('tbody1');
  if (!tbody) return;
  tbody.innerHTML = users.map(u => {
    const safeEmail = u.email || '';
    const safePrenom = u.prenom || '';
    const safeNom = u.nom || '';
    const role = u.role || 'user';
    const actions = `
      <button onclick="changeRole(${u.id}, 'moderator')" class="mr-2 px-2 py-1 bg-yellow-100 rounded">Mod</button>
      <button onclick="changeRole(${u.id}, 'admin')" class="mr-2 px-2 py-1 bg-green-100 rounded">Admin</button>
        <button onclick="changeRole(${u.id}, 'user')" class="px-2 py-1 bg-gray-100 rounded">User</button>
        <button onclick="removeRole(${u.id})" class="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded">Retirer rôle</button>
    `;
    return `<tr class="border-b"><td class="px-6 py-4">${safePrenom}</td><td class="px-6 py-4">${safeNom}</td><td class="px-6 py-4">${safeEmail}</td><td class="px-6 py-4">${role}</td><td class="px-6 py-4 text-center">${actions}</td></tr>`;
  }).join('');
}

