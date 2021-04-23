'use strict';

import { sendRequest } from './request.js';
import * as User from './user.js';
import { startGame } from './game.js';
import { go } from './navi.js';
import { displayErrors, emptyFields } from './feedback.js';

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
    console.log(name, size, density);

    const data = await sendRequest('getNewRoom', { name, size, density });
    // TODO: kell ez ide? a request.js ezt kezeli mar sztem...
    if (!data) {
        displayErrors('Something went wrong.');
        return;
    }
    emptyFields();
    startGame(data.room.game, data.room.name);
    go('game');
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
        emptyFields();
        User.onLoggedIn(data.user);
        go('rooms');
    } else {
        // TODO: kell ez ide? a request.js ezt kezeli mar sztem...
        console.error('Login failed');
        displayErrors('Login failed.');
    };
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
        emptyFields();
        return;
    }
    if (name.length < 3) {
        displayErrors('Name too short (min. 3)');
        emptyFields();
        return;
    }
    if (password.length < 5) {
        displayErrors('Password too short (min. 4)');
        emptyFields();
        return;
    }
    if (password != password2) {
        displayErrors('Password and repeat password should match');
        emptyFields();
        return;
    }

    // TODO: username exist on the flight validate

    // Send request
    const data = await sendRequest('createUser', { name, password: password });
    if (data) {
        emptyFields();
        User.onLoggedIn(data.user);
        go('rooms');
    } else {
        // TODO: kell ez ide? a request.js ezt kezeli mar sztem...
        console.error('createUser failed');
        displayErrors('Something went wrong.');
    };
});
// ------------------------------------------------------------------

// Form for changing password
const passwordForm = document.getElementById('submitPassword');
passwordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    // values
    const name = document.getElementById('usernameEx').value;
    let password = document.getElementById('passwordEx').value;
    let newpassword = document.getElementById('passwordNew').value;
    let newpassword2 = document.getElementById('passwordNewRep').value;
    // validate values
    if (!password || !newpassword || !newpassword2) {
        displayErrors('Please fill out all fields.');
        emptyFields();
        return;
    }
    if (newpassword.length < 4) {
        displayErrors('Password too short (min. 4)');
        emptyFields();
        return;
    }
    if (newpassword != newpassword2) {
        displayErrors('Password and repeat password should match');
        emptyFields();
        return;
    }
    // send request
    const data = await sendRequest('changePassword', { name, password, newpassword, newpassword2 });
    if (data) {
        emptyFields();
        // display as Success(green) not Error(red)
        displayErrors('Your password was changed.', false);
    } else {
        // TODO: kell ez ide? a request.js ezt kezeli mar sztem...
        console.error('Changing password failed');
        displayErrors('Something went wrong.');
    }
});
// ------------------------------------------------------------------

// Changing Color Theme
const theme = document.getElementById('theme');
theme.addEventListener('change', (event) => {
    event.preventDefault();
    document.querySelector('body').dataset.theme = theme.value;

})
// Save theme
const themeForm = document.getElementById('themeSettings');
themeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    localStorage.setItem('mytheme', theme.value);
});
// Set theme
let savedTheme = localStorage.getItem('mytheme')
if (savedTheme) {
    document.querySelector('body').dataset.theme = savedTheme;
}
