const form = document.getElementById('registerForm');
const btnSubmit = document.getElementById('btnSubmit');
const inputs = {
    nom: document.getElementById('nom'),
    prenom: document.getElementById('prenom'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    adresse: document.getElementById('adresse'),
    codePostal: document.getElementById('codePostal')
};

const errors = {
    nom: document.getElementById('nomError'),
    prenom: document.getElementById('prenomError'),
    email: document.getElementById('emailError'),
    password: document.getElementById('passwordError'),
    adresse: document.getElementById('adresseError'),
    codePostal: document.getElementById('codePostalError')
};

// Variables pour debounce sur email
let emailCheckTimeout = null;

const validations = {
    nom: {
        validate: async (value) => {
            if (!value.trim()) return "Le nom est requis";
            if (value.length < 2) return "Le nom doit contenir au moins 2 caractères";
            if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value)) return "Le nom contient des caractères invalides";
            return null;
        }
    },
    
    prenom: {
        validate: async (value) => {
            if (!value.trim()) return "Le prénom est requis";
            if (value.length < 2) return "Le prénom doit contenir au moins 2 caractères";
            if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value)) return "Le prénom contient des caractères invalides";
            return null;
        }
    },
    
    email: {
        validate: async (value) => {
            if (!value.trim()) return "L'email est requis";
            if (!isValidEmail(value)) return "Format d'email invalide";
            
            // Vérification asynchrone avec debounce
            const isAvailable = await checkEmailAvailable(value);
            if (!isAvailable) return "Cet email est déjà utilisé";
            return null;
        }
    },
    
    password: {
        validate: async (value) => {
            if (!value) return "Le mot de passe est requis";
            if (value.length < 6) return "Le mot de passe doit contenir au moins 6 caractères";
            
            const strength = await checkPasswordStrength(value);
            if (!strength.isStrong) return strength.message;
            return null;
        }
    },
    
    adresse: {
        validate: async (value) => {
            if (!value.trim()) return "L'adresse est requise";
            if (value.length < 5) return "L'adresse semble trop courte";
            if (!/^[a-zA-Z0-9\s\-,°']+$/.test(value)) return "L'adresse contient des caractères invalides";
            return null;
        }
    },
    
    codePostal: {
        validate: async (value) => {
            if (!value.trim()) return "Le code postal est requis";
            if (!/^[0-9]{5}$/.test(value)) return "Le code postal doit contenir 5 chiffres";
            
            // Vérification asynchrone de validité du code postal
            const isValid = await checkPostalCode(value);
            if (!isValid) return "Code postal invalide";
            return null;
        }
    }
};

// Écouteurs d'événements pour chaque champ
Object.keys(inputs).forEach(field => {
    inputs[field].addEventListener('blur', async () => {
        await validateField(field);
    });
    
    inputs[field].addEventListener('input', () => {
        clearError(field);
        // Debounce spécial pour email
        if (field === 'email') {
            clearTimeout(emailCheckTimeout);
            emailCheckTimeout = setTimeout(async () => {
                await validateField('email');
            }, 800);
        }
    });
});

// Soumission du formulaire avec validation complète asynchrone
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Désactiver le bouton et afficher l'état de validation
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Vérification...';
    
    // Valider tous les champs de façon asynchrone
    const validationResults = await Promise.all(
        Object.keys(inputs).map(field => validateField(field))
    );
    
    const hasErrors = validationResults.some(result => !result);
    
    // Réactiver le bouton
    btnSubmit.disabled = false;
    btnSubmit.textContent = "S'inscrire";
    
    if (!hasErrors) {
        alert('Inscription réussie !');
        // Ici : envoyer les données au serveur
        // form.submit(); ou fetch(...);
    }
});

// Fonction de validation asynchrone d'un champ
async function validateField(field) {
    const value = inputs[field].value;
    const error = await validations[field].validate(value);
    
    if (error) {
        showError(field, error);
        return false;
    } else {
        clearError(field);
        inputs[field].classList.add('valid');
        inputs[field].classList.remove('invalid');
        return true;
    }
}
// Utilitaires d'affichage d'erreur
function showError(field, message) {
    errors[field].textContent = message;
    inputs[field].classList.add('invalid');
    inputs[field].classList.remove('valid');
}

function clearError(field) {
    errors[field].textContent = '';
    inputs[field].classList.remove('invalid');
}

// Validation d'email (regex)
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Vérification asynchrone de disponibilité d'email (simulée)
async function checkEmailAvailable(email) {
    return new Promise(resolve => {
        setTimeout(() => {
            // Simuler : existant@example.com est déjà pris
            resolve(email !== 'existant@example.com');
        }, 800);
    });
}

// Vérification asynchrone de force du mot de passe (simulée)
async function checkPasswordStrength(password) {
    return new Promise(resolve => {
        setTimeout(() => {
            const hasNumber = /\d/.test(password);
            const hasUpper = /[A-Z]/.test(password);
            const hasLower = /[a-z]/.test(password);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            
            let score = 0;
            if (hasNumber) score++;
            if (hasUpper) score++;
            if (hasLower) score++;
            if (hasSpecial) score++;
            if (password.length >= 8) score++;
            
            if (score >= 4) {
                resolve({ isStrong: true, message: null });
            } else {
                resolve({ 
                    isStrong: false, 
                    message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial" 
                });
            }
        }, 500);
    });
}

// Vérification asynchrone de code postal (simulée)
async function checkPostalCode(code) {
    return new Promise(resolve => {
        setTimeout(() => {
            const isValid = /^[0-9]{5}$/.test(code);
            resolve(isValid);
        }, 300);
    });
}