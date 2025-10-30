const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const form = document.getElementById('loginForm');
const btnSubmit = document.getElementById('btnSubmit');

// Variables pour suivre l'état de validation
let validationState = {
    email: false,
    password: false
};

// Validation asynchrone de l'email
emailInput.addEventListener('blur', async function() {
    await validateEmail();
});

emailInput.addEventListener('input', function() {
    clearError(emailError, emailInput);
});

// Validation asynchrone du mot de passe
passwordInput.addEventListener('blur', async function() {
    await validatePassword();
});

passwordInput.addEventListener('input', function() {
    clearError(passwordError, passwordInput);
});

// Soumission du formulaire avec validation complète
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Désactiver le bouton pendant la validation
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Vérification...';
    
    // Valider tous les champs de façon asynchrone
    const [emailValid, passwordValid] = await Promise.all([
        validateEmail(),
        validatePassword()
    ]);
    
    // Réactiver le bouton
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Se connecter';
    
    if (emailValid && passwordValid) {
        // Tout est valide - soumettre le formulaire
        alert('Connexion réussie !');
        // form.submit(); // Décommenter pour vraie soumission
    }
});

// Fonction de validation email
async function validateEmail() {
    const email = emailInput.value.trim();
    
    if (!email) {
        showError(emailError, emailInput, "L'email est requis");
        validationState.email = false;
        return false;
    }
    
    if (!isValidEmail(email)) {
        showError(emailError, emailInput, "Format d'email invalide");
        validationState.email = false;
        return false;
    }

    // Vérification asynchrone de l'existence de l'email
    const isAvailable = await checkEmailAvailability(email);
    if (!isAvailable) {
        showError(emailError, emailInput, "Aucun compte trouvé avec cet email");
        validationState.email = false;
        return false;
    }
    
    clearError(emailError, emailInput);
    emailInput.classList.add('valid');
    validationState.email = true;
    return true;
}

// Fonction de validation mot de passe
async function validatePassword() {
    const password = passwordInput.value;
    
    if (!password) {
        showError(passwordError, passwordInput, "Le mot de passe est requis");
        validationState.password = false;
        return false;
    }
    
    if (password.length < 6) {
        showError(passwordError, passwordInput, "Le mot de passe doit contenir au moins 6 caractères");
        validationState.password = false;
        return false;
    }
    
    // Vérification asynchrone de la force du mot de passe
    const isStrong = await checkPasswordStrength(password);
    if (!isStrong) {
        showError(passwordError, passwordInput, "Mot de passe trop faible (majuscule, minuscule, chiffre requis)");
        validationState.password = false;
        return false;
    }
    
    clearError(passwordError, passwordInput);
    passwordInput.classList.add('valid');
    validationState.password = true;
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(errorElement, inputElement, message) {
    errorElement.textContent = message;
    inputElement.classList.add('invalid');
    inputElement.classList.remove('valid');
}

function clearError(errorElement, inputElement) {
    errorElement.textContent = '';
    inputElement.classList.remove('invalid');
}

// Simulation de vérification d'existence d'email (asynchrone)
async function checkEmailAvailability(email) {
    return new Promise(resolve => {
        setTimeout(() => {
            // Simuler : test@example.com existe
            resolve(email === 'test@example.com');
        }, 500);
    });
}

// Simulation de vérification de force du mot de passe (asynchrone)
async function checkPasswordStrength(password) {
    return new Promise(resolve => {
        setTimeout(() => {
            const hasNumber = /\d/.test(password);
            const hasUpper = /[A-Z]/.test(password);
            const hasLower = /[a-z]/.test(password);
            resolve(hasNumber && hasUpper && hasLower);
        }, 300);
    });
}