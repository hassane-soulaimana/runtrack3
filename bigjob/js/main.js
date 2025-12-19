// Orchestrateur
document.addEventListener('DOMContentLoaded', function(){
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
  // Appelle les fonctions de rendu spécifiques aux pages si elles existent
  ['renderUsers','renderRequests','renderCalendar','renderModerator','initNav'].forEach(name => {
    try{ if (typeof window[name] === 'function') window[name](); }catch(e){}
  });
});
