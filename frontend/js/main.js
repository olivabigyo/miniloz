'use strict';

import { sendRequest } from './request.js';
import { initChat } from './chat.js';
import { startGame } from './game.js';
import { go, initSectionFromHash } from './navi.js';

initSectionFromHash();
initChat();

// ******************************************************************
// ******************** THE FORM SUBMITTING *************************
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
    if (!data) {
        // TODO: kiirni ezt a hibat
        return;
    }
    startGame(data.room.game);
    go('game');
});

// Login Form
const loginForm = document.getElementById('submitLogin');
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = await sendRequest('login', { name, password });
});

// Logout
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const data = await sendRequest('logout', {});
    go('home');
});

// Sign up Form
const signupForm = document.getElementById('submitSignup');
signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('usernameSignup').value;
    const password = document.getElementById('passwordSignup').value;
    const pwd2 = document.getElementById('passwordSignupRep').value;
    // TODO: validate
    // TODO: username exist on the flight validate
    console.log(name, password, pwd2);

    const data = await sendRequest('createUser', { name, password });
});

// Form for changing password
const passwordForm = document.getElementById('submitPassword');
passwordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('usernameEx').value; // ez nyilvan nem valaszthato, gondolom jon valami sessionbol
    const pwd = document.getElementById('passwordEx').value;
    const newpwd = document.getElementById('passwordNew').value;
    const newpwd2 = document.getElementById('passwordNewRep').value;
    console.log(name, pwd, newpwd, newpwd2);

    const data = await sendRequest('changePassword', { name, pwd, newpwd, newpwd2 });
});
