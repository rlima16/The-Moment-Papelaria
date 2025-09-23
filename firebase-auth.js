import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBhiNkiR7D_xI_W_2L2bLUG3gC1--HUn18",
    authDomain: "the-moment-b3e02.firebaseapp.com",
    projectId: "the-moment-b3e02",
    storageBucket: "the-moment-b3e02.appspot.com",
    messagingSenderId: "263728888202",
    appId: "1:263728888202:web:50fb8ce5b910a80a1e3073",
    measurementId: "G-4LP2H73973"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- GERENCIADOR DE ESTADO DO USUÁRIO ---
onAuthStateChanged(auth, (user) => {
    const userInfo = document.getElementById('user-info');
    const authLink = document.getElementById('auth-link');
    const logoutLink = document.getElementById('logout-link');

    if (user) {
        if (userInfo) {
            userInfo.textContent = `Olá, ${user.email.split('@')[0]}`;
            userInfo.classList.remove('hidden');
        }
        if (authLink) authLink.classList.add('hidden');
        if (logoutLink) logoutLink.classList.remove('hidden');
    } else {
        if (userInfo) userInfo.classList.add('hidden');
        if (authLink) authLink.classList.remove('hidden');
        if (logoutLink) logoutLink.classList.add('hidden');
    }
});

// --- EVENT LISTENERS PARA OS FORMULÁRIOS ---
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const loginError = document.getElementById('login-error');
            
            signInWithEmailAndPassword(auth, email, password)
                .then(() => { 
                    closeAuthModal(); 
                    if (loginError) loginError.classList.add('hidden');
                })
                .catch((error) => {
                    if (loginError) {
                        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                            loginError.textContent = "E-mail ou senha inválidos.";
                        } else {
                            loginError.textContent = "Ocorreu um erro. Tente novamente.";
                        }
                        loginError.classList.remove('hidden');
                    }
                });
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const registerError = document.getElementById('register-error');

            createUserWithEmailAndPassword(auth, email, password)
                .then(() => { 
                    closeAuthModal(); 
                    if (registerError) registerError.classList.add('hidden');
                })
                .catch((error) => {
                    if (registerError) {
                        if (error.code === 'auth/email-already-in-use') {
                            registerError.textContent = "Este e-mail já está em uso.";
                        } else if (error.code === 'auth/weak-password') {
                            registerError.textContent = "A senha precisa ter no mínimo 6 caracteres.";
                        } else {
                            registerError.textContent = "Ocorreu um erro. Tente novamente.";
                        }
                        registerError.classList.remove('hidden');
                    }
                });
        });
    }
});

// --- FUNÇÕES DE CONTROLE DO MODAL E LOGOUT ---
window.openAuthModal = function() {
    const authModal = document.getElementById('auth-modal');
    if (authModal) authModal.classList.remove('hidden');
    showLoginView();
};

window.closeAuthModal = function() {
    const authModal = document.getElementById('auth-modal');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    if (authModal) authModal.classList.add('hidden');
    if (loginError) loginError.classList.add('hidden');
    if (registerError) registerError.classList.add('hidden');
};

window.showRegisterView = function() {
    document.getElementById('login-view').classList.add('hidden');
    document.getElementById('register-view').classList.remove('hidden');
    document.getElementById('login-error').classList.add('hidden');
};

window.showLoginView = function() {
    document.getElementById('register-view').classList.add('hidden');
    document.getElementById('login-view').classList.remove('hidden');
    document.getElementById('register-error').classList.add('hidden');
};

window.logoutUser = function() {
    signOut(auth).catch((error) => console.error("Erro no logout:", error));
};
