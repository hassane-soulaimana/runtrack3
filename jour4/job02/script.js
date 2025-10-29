function jsonValueKey(jsonString, key) {
    try {
        const jsonObject = JSON.parse(jsonString);
        
        return jsonObject[key];
    } catch (error) {
        console.error("Erreur lors du parsing JSON:", error);
        return null;
    }
}


const jsonString = `{
    "name": "La Plateforme_",
    "address": "8 rue d'hozier",
    "city": "Marseille",
    "nb_staff": "11",
    "creation": "2019"
}`;

console.log(jsonValueKey(jsonString, "city"));
console.log(jsonValueKey(jsonString, "name"));
console.log(jsonValueKey(jsonString, "creation"));