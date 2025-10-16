// Demo user credentials
const users = {
    'admin@company.com': { password: 'admin123', role: 'admin', name: 'Admin User' },
    'hr@company.com': { password: 'hr123', role: 'hr', name: 'HR Manager' },
    'manager@company.com': { password: 'manager123', role: 'manager', name: 'Team Manager' },
    'employee@company.com': { password: 'emp123', role: 'employee', name: 'John Employee' }
};

// DOM elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const roleSelect = document.getElementById('role');
const passwordToggle = document.getElementById('passwordToggle');
const loginBtn = document.querySelector('.login-btn');
const btnLoader = document.getElementById('btnLoader');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Password toggle functionality
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // Form submission
    loginForm.addEventListener('submit', handleLogin);

    // Real-time validation
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);
    roleSelect.addEventListener('change', validateRole);

    // Clear errors on input
    emailInput.addEventListener('input', () => clearError('emailError'));
    passwordInput.addEventListener('input', () => clearError('passwordError'));
    roleSelect.addEventListener('change', () => clearError('roleError'));
});

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const username = emailInput.value.trim();
    const password = passwordInput.value;
    // Clear previous errors
    clearAllErrors();
    // Validate inputs
    let isValid = true;
    if (!validateEmail()) isValid = false;
    if (!validatePassword()) isValid = false;
    if (!isValid) return;
    // Show loading state
    showLoading(true);
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (!response.ok) {
            showError('passwordError', data.error || 'Login failed');
            showLoading(false);
            return;
        }
        // Success: persist currentUser so dashboard can load
        if (data && data.user) {
            const { name, role, email } = data.user;
            localStorage.setItem('currentUser', JSON.stringify({ name, role, email }));
        } else {
            // Fallback for older backend that only returns message
            localStorage.setItem('currentUser', JSON.stringify({ name: username, role: 'employee', email: username }));
        }
        loginBtn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        loginBtn.innerHTML = '<i class="fas fa-check"></i> Login Successful!';
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } catch (error) {
        console.error('Login error:', error);
        showError('emailError', 'Server error, please try again later');
        showLoading(false);
    }
// ...existing code...
}

// Validation functions
function validateEmail() {
    const email = emailInput.value.trim();
    
    if (!email) {
        showError('emailError', 'Email is required');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        showError('emailError', 'Please enter a valid email address');
        return false;
    }
    
    return true;
}

function validatePassword() {
    const password = passwordInput.value;
    
    if (!password) {
        showError('passwordError', 'Password is required');
        return false;
    }
    
    if (password.length < 6) {
        showError('passwordError', 'Password must be at least 6 characters');
        return false;
    }
    
    return true;
}

function validateRole() {
    const role = roleSelect.value;
    
    if (!role) {
        showError('roleError', 'Please select your role');
        return false;
    }
    
    return true;
}

// Utility functions
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = '';
    errorElement.style.display = 'none';
}

function clearAllErrors() {
    clearError('emailError');
    clearError('passwordError');
    clearError('roleError');
}

function showLoading(show) {
    if (show) {
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
    } else {
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
    }
}

// Fill demo credentials
function fillCredentials(email, password, role) {
    emailInput.value = email;
    passwordInput.value = password;
    roleSelect.value = role;
    
    // Clear any existing errors
    clearAllErrors();
    
    // Add visual feedback
    const demoItems = document.querySelectorAll('.demo-item');
    demoItems.forEach(item => item.style.background = 'white');
    
    event.target.style.background = '#e8f5e8';
    setTimeout(() => {
        event.target.style.background = 'white';
    }, 1000);
}

// Load remembered user
window.addEventListener('load', function() {
    const rememberedUser = localStorage.getItem('rememberUser');
    if (rememberedUser) {
        emailInput.value = rememberedUser;
        document.getElementById('rememberMe').checked = true;
    }
});