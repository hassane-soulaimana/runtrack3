
const allowedDomain = 'laplateforme.io';

function getUsers(){
  try{ return JSON.parse(localStorage.getItem('lp_users') || 'null') || []; }catch(e){return []}
}
function saveUsers(users){ localStorage.setItem('lp_users', JSON.stringify(users)); }

function showAlert(container, message, type='danger'){
  const el = document.getElementById(container);
  el.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
}

// Inscription
const formIns = document.getElementById('formInscription');
if(formIns){
  formIns.addEventListener('submit', function(e){
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());

    // basic checks
    if(!data.email || !data.password || !data.passwordConfirm) return;
    const parts = data.email.split('@');
    if(parts.length !== 2 || parts[1].toLowerCase() !== allowedDomain){
      showAlert('alertPlaceholder', `Email invalide : utilisez un email @${allowedDomain}`);
      return;
    }
    if(data.password !== data.passwordConfirm){
      showAlert('alertPlaceholder', 'Les mots de passe ne correspondent pas.');
      return;
    }

    const users = getUsers();
    if(users.find(u=>u.email.toLowerCase() === data.email.toLowerCase())){
      showAlert('alertPlaceholder', 'Un compte existe déjà avec cet email.');
      return;
    }

    const newUser = {
      id: Date.now(),
      prenom: data.prenom || '',
      nom: data.nom || '',
      email: data.email.toLowerCase(),
      password: data.password, // NOTE: cleartext for demo only
      role: 'user'
    };
    users.push(newUser);
    saveUsers(users);
    showAlert('alertPlaceholder', 'Inscription réussie — vous pouvez maintenant vous connecter.', 'success');
    form.reset();
  });
}

// Connexion
const formConn = document.getElementById('formConnexion');
if(formConn){
  formConn.addEventListener('submit', function(e){
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const users = getUsers();
    const user = users.find(u => u.email === (data.email || '').toLowerCase() && u.password === data.password);
    if(!user){
      showAlert('alertLogin', 'Identifiants invalides.');
      return;
    }
    // simulate login
    localStorage.setItem('lp_currentUser', JSON.stringify({ id: user.id, email: user.email, role: user.role }));
    showAlert('alertLogin', 'Connexion réussie.', 'success');
    setTimeout(()=>{ window.location.href = 'index.html'; }, 800);
  })
}
