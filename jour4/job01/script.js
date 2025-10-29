document.getElementById('button').addEventListener('click', function() {
    fetch('expression.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors du chargement du fichier');
            }
            return response.text();
        })
        .then(data => {
            const paragraph = document.createElement('p');
            paragraph.textContent = data;
            
            const container = document.getElementById('expression');
            container.innerHTML = '';
            container.appendChild(paragraph);
        })
        .catch(error => {
            console.error('Erreur:', error);
            const container = document.getElementById('expression');
            container.innerHTML = '<p>Erreur lors du chargement de l\'expression</p>';
        });
});