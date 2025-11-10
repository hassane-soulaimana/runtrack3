console.log('BigJob demo loaded');
(function ensureSample(){
  const key = 'lp_users';
  if(!localStorage.getItem(key)){
    const sample = [{ id: 1, prenom:'Admin', nom:'LP', email:'admin@laplateforme.io', password:'admin123', role:'admin' }];
    localStorage.setItem(key, JSON.stringify(sample));
    console.log('sample users created');
  }
})();
