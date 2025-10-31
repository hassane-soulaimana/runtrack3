<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion des utilisateurs</title>
</head>

<body>
    <h1>Liste des utilisateurs</h1>

    <button id="update">Mettre à jour</button>

    <table id="usersTable" border="1">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody id="tableBody">

        </tbody>
    </table>

    <script>
        function chargerUtilisateurs() {
            fetch('users.php')
                .then(response => response.json())
                .then(users => {
                    const tbody = document.getElementById('tableBody');
                    tbody.innerHTML = '';
                    if (users.error) {
                        tbody.innerHTML = `<tr><td colspan="4">${users.error}</td></tr>`;
                        return;
                    }
                    users.forEach(user => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${user.id}</td>
                            <td>${user.nom}</td>
                            <td>${user.prenom}</td>
                            <td>${user.email}</td>
                        `;
                        tbody.appendChild(row);
                    });
                })
                .catch(error => {
                    console.error('Erreur:', error);
                    document.getElementById('tableBody').innerHTML =
                        '<tr><td colspan="4">Erreur de chargement</td></tr>';
                });
        }
        document.getElementById('update').addEventListener('click', chargerUtilisateurs);
    </script>
</body>

</html>