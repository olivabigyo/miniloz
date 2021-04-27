'use strict';

import { sendRequest } from './request.js';
import * as User from './user.js';
import { go } from './navi.js';
import { displayErrors, clearPasswordFields, clearFeedback } from './feedback.js';
import { goRoom } from './room.js';

User.initUserStuff();

// ******************************************************************
// ************************* THE SUBMITS ****************************
// ******************************************************************

// ------------------------------------------------------------------
// Handling the submit buttons on the site
// ------------------------------------------------------------------

// Creating New Room
const newRoomForm = document.getElementById('submitNewRoom');
newRoomForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('roomname').value;
    const size = document.getElementById('roomsize').value;
    const density = document.getElementById('roomdensity').value;

    const data = await sendRequest('getNewRoom', { name, size, density });
    if (!data) return;
    goRoom(data.roomId);
});
// ------------------------------------------------------------------

// Login Form
const loginForm = document.getElementById('submitLogin');
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    // values
    const name = document.getElementById('username').value;
    const passwordField = document.getElementById('password');
    const password = passwordField.value;

    // send request
    const data = await sendRequest('login', { name, password });
    if (data) {
        clearPasswordFields();
        User.onLoggedIn(data.user);
        go('rooms');
    }
});
// ------------------------------------------------------------------

// Logout
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const data = await sendRequest('logout', {});
    User.onLoggedOut();
    go('home');
});
// ------------------------------------------------------------------

// Sign up Form
const signupForm = document.getElementById('submitSignup');
signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    // Values
    const name = document.getElementById('usernameSignup').value;
    const password = document.getElementById('passwordSignup').value;
    const password2 = document.getElementById('passwordSignupRep').value;
    // Validate values
    if (!name || !password || !password2) {
        displayErrors('Please fill out all fields.');
        clearPasswordFields();
        return;
    }
    if (name.length < 3) {
        displayErrors('Name too short (min. 3)');
        clearPasswordFields();
        return;
    }
    if (password.length < 4) {
        displayErrors('Password too short (min. 4)');
        clearPasswordFields();
        return;
    }
    if (password != password2) {
        displayErrors('Password and repeat password should match');
        clearPasswordFields();
        return;
    }

    // TODO: username exist on the flight validate

    // Send request
    const data = await sendRequest('createUser', { name, password: password });
    if (!data) return;

    clearPasswordFields();
    User.onLoggedIn(data.user);
    go('rooms');
});
// ------------------------------------------------------------------

// Form for changing password
const passwordForm = document.getElementById('submitPassword');
passwordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    // values
    let password = document.getElementById('passwordEx').value;
    let newpassword = document.getElementById('passwordNew').value;
    let newpassword2 = document.getElementById('passwordNewRep').value;
    // validate values
    if (!password || !newpassword || !newpassword2) {
        displayErrors('Please fill out all fields.');
        return;
    }
    if (newpassword.length < 4) {
        displayErrors('Password too short (min. 4)');
        return;
    }
    if (newpassword != newpassword2) {
        displayErrors("Passwords don't match");
        return;
    }

    // send request
    const data = await sendRequest('changePassword', { password, newpassword });
    if (!data) return;

    clearPasswordFields();
    // display as Success(green) not Error(red)
    displayErrors('Your password has been changed.', false);
});
// ------------------------------------------------------------------

// Changing Color Theme
const theme = document.getElementById('theme');
theme.addEventListener('change', (event) => {
    event.preventDefault();
    document.querySelector('body').dataset.theme = theme.value;
    clearFeedback();
})
// Save theme
const themeForm = document.getElementById('themeSettings');
themeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearFeedback();
    localStorage.setItem('mytheme', theme.value);
    displayErrors('We saved this theme for future visits.', false);
});
// Set theme
let savedTheme = localStorage.getItem('mytheme')
if (savedTheme) {
    document.querySelector('body').dataset.theme = savedTheme;
}
