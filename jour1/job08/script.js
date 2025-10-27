
function sommenombrespremiers(a, b) {
    function estNombrePremier(n) {
        
        if (n < 2) return false;
        
        
        for (let i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) return false;
        }
        
        return true;
    }
    
    
    if (estNombrePremier(a) && estNombrePremier(b)) {
        return a + b;
    } else {
        return false;
    }
}

// Tests
console.log(sommenombrespremiers(3, 5)); 
console.log(sommenombrespremiers(2, 7));  
console.log(sommenombrespremiers(4, 5));  
console.log(sommenombrespremiers(1, 3));  
console.log(sommenombrespremiers(11, 13));