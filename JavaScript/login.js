let registeredUsers = {};

if (localStorage.getItem('registeredUsers')) {
    registeredUsers = JSON.parse(localStorage.getItem('registeredUsers'));
}

document.addEventListener('DOMContentLoaded', function () {
    const loggedInUser = sessionStorage.getItem('loggedInUser');

    if (loggedInUser) {
        showWelcomeMessage(loggedInUser);
    }
});

function toggleForm(formId) {
    const forms = document.querySelectorAll('.form-container');
    forms.forEach(form => form.style.display = 'none');
    document.getElementById(formId).style.display = 'block';

    // Hide welcome message and logout button when switching forms
    document.getElementById('welcomeMessage').style.display = 'none';
    document.getElementById('logoutButton').style.display = 'none';
}

function showMessage(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

function handleRegistration() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const firstName = document.getElementById('register-firstname').value;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('registration-confirmation', "Invalid email format.");
        return false;
    }

    // Validate phone number format (allow only 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        showMessage('registration-confirmation', "Invalid phone number format.");
        return false;
    }

    // Validate first name (only alphabets)
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(firstName)) {
        showMessage('registration-confirmation', "Invalid first name format. Use only alphabets.");
        return false;
    }

    if (password !== confirmPassword) { //password message 
        showMessage('registration-confirmation', "Password and Confirm Password must match.");
        return false;
    }

    if (registeredUsers[username]) {//username exists message 
        showMessage('registration-confirmation', "Username already exists. Please choose another.");
        return false;
    }

    registeredUsers[username] = { password, email, phone, firstName };
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    showMessage('registration-confirmation', "Registration successful. You can now log in.");
    toggleForm('login-form');
    return false;
}


function handleLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (registeredUsers[username] && registeredUsers[username].password === password) {
        sessionStorage.setItem('loggedInUser', username);
        showWelcomeMessage(username);
    } else {
        showMessage('login-confirmation', "Incorrect username or password.");
    }

    return false;
}


function showWelcomeMessage(username) {
    // Hide login and register buttons
    document.querySelectorAll('.login-button, .register-button').forEach(button => {
        button.style.display = 'none';
    });

    // Show welcome message and logout button
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('welcomeMessage').style.display = 'block';
    document.getElementById('welcomeUser').textContent = username;
    document.getElementById('logoutButton').style.display = 'block';
}
function logout() {
    // Clear the logged-in user from sessionStorage
    sessionStorage.removeItem('loggedInUser');

    // Show login and register buttons
    document.querySelectorAll('.login-button, .register-button').forEach(button => {
        button.style.display = 'block';
    });

    // Hide welcome message and logout button
    document.getElementById('welcomeMessage').style.display = 'none';
    document.getElementById('logoutButton').style.display = 'none';

    // Show the login form
    toggleForm('login-form');
}