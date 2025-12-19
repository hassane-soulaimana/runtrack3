// Navigation
(function(){
  function init(){
    try{
      const current = JSON.parse(localStorage.getItem('lp_currentUser') || 'null');
      // Mettre à jour l'année si l'élément est présent
      const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
      if (!current) return;

      const menu = document.getElementById('menu');
      if (menu) {
        // Remplacer les liens inscription/connexion s'ils existent
        const signA = menu.querySelector('a[href="inscription.html"]');
        const connA = menu.querySelector('a[href="connexion.html"]');

        if (signA) {
          const li = signA.closest('li');
          if (li) li.innerHTML = `<a href="dashboard.html" class="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-gray-100 shadow">Profil</a>`;
        }

        if (connA) {
          const li = connA.closest('li');
          if (li) li.innerHTML = `<a href="dashboard.html#calendar" class="px-4 py-2 border border-white text-white rounded-lg hover:bg-white/10">Calendrier</a>`;
        }

        // Ajouter le menu déroulant utilisateur si non présent
        if (!menu.querySelector('.user-dropdown')){
          const dropdownLi = document.createElement('li');
          dropdownLi.className = 'relative user-dropdown';
          dropdownLi.innerHTML = `
            <div class="relative">
              <button id="user-btn" class="flex items-center gap-2 text-white focus:outline-none">
                <span>Bonjour, ${current.prenom || current.email}</span>
                <i class="fas fa-caret-down ml-2 text-white"></i>
              </button>
              <div id="user-menu" class="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg hidden z-50">
                <a href="dashboard.html" class="block px-4 py-2 hover:bg-gray-100">Profil</a>
                <button id="logout-btn" class="w-full text-left px-4 py-2 hover:bg-gray-100">Se déconnecter</button>
              </div>
            </div>`;
          menu.appendChild(dropdownLi);

          const userBtn = dropdownLi.querySelector('#user-btn');
          const userMenu = dropdownLi.querySelector('#user-menu');
          const logoutBtn = dropdownLi.querySelector('#logout-btn');
          if (userBtn && userMenu){
            userBtn.addEventListener('click', function(e){ e.stopPropagation(); userMenu.classList.toggle('hidden'); });
            document.addEventListener('click', function(){ if (!userMenu.classList.contains('hidden')) userMenu.classList.add('hidden'); });
          }
          if (logoutBtn){ logoutBtn.addEventListener('click', doLogout); }
        }
      }

      // Footer
      const footerNav = document.querySelector('footer nav');
      if (footerNav){
        const ins = footerNav.querySelector('a[href="inscription.html"]');
        const con = footerNav.querySelector('a[href="connexion.html"]');
        if (ins) { ins.textContent = 'Profil'; ins.setAttribute('href','dashboard.html'); }
        if (con) { con.textContent = 'Calendrier'; con.setAttribute('href','dashboard.html#calendar'); }
        if (!footerNav.querySelector('.footer-logout')){
          const logoutA = document.createElement('a');
          logoutA.href = '#';
          logoutA.className = 'text-gray-300 hover:text-white ml-4 footer-logout';
          logoutA.textContent = 'Se déconnecter';
          logoutA.addEventListener('click', function(e){ e.preventDefault(); doLogout(); });
          footerNav.appendChild(logoutA);
        }
      }

    }catch(e){ console.warn('nav-auth init failed', e); }
  }

  function doLogout(){
    localStorage.removeItem('lp_currentUser');
    window.location.href = 'index.html';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
