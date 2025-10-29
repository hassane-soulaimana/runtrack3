document.getElementById('filtrer').addEventListener('click', function() {
    fetch('pokemon.json')
        .then(response => response.json())
        .then(data => {
            const id = document.getElementById('id').value.toLowerCase();
            const nom = document.getElementById('nom').value.toLowerCase();
            const type = document.getElementById('type').value;
            
            const resultats = data.filter(pokemon => {
                return (!id || pokemon.id.toString().includes(id)) &&
                       (!nom || pokemon.name.french.toLowerCase().includes(nom)) &&
                       (!type || pokemon.type.includes(type));
            });
            
            afficherResultats(resultats);
        });
});

function afficherResultats(pokemons) {
    const container = document.getElementById('resultats');
    
    if (pokemons.length === 0) {
        container.innerHTML = '<p>Aucun Pokémon trouvé</p>';
        return;
    }
    
    const html = pokemons.map(p => `
        <div>
            <h3>${p.name.french} (ID: ${p.id})</h3>
            <p>Type: ${p.type.join(', ')}</p>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Charger les types disponibles
fetch('pokemon.json')
    .then(response => response.json())
    .then(data => {
        const types = [...new Set(data.flatMap(p => p.type))];
        const select = document.getElementById('type');
        
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            select.appendChild(option);
        });
    });