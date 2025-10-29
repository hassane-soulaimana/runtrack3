<?php
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'utilisateurs';
$username = 'root';
$password = '';
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->query("SELECT * FROM utilisateurs");
    $utilisateurs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($utilisateurs);
    
} catch(PDOException $e) {
    echo json_encode(['error' => 'Erreur de connexion: ' . $e->getMessage()]);
}
?>