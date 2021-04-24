'use strict';

import { sendRequest } from './request.js';
import { initSectionFromHash } from './navi.js';
import { startChat, stopChat } from './chat.js';
import { startRooms, stopRooms, updateRoomList } from './room.js';
import { displayErrors } from './feedback.js';

let theUser;

export function onLoggedIn(user) {
    theUser = user;

    document.getElementById('nav-right').classList.remove('hidden');
    document.getElementById('profile-name').innerText = user.name;
    document.getElementById('usernameEx').value = user.name;
    startChat();
    updateRoomList();
    startRooms();
}

export function onLoggedOut() {
    console.log('Logged out');
    theUser = undefined;

    document.getElementById('nav-right').classList.add('hidden');
    document.getElementById('profile-name').innerText = 'NoUser';
    stopChat();
    stopRooms();
}

export async function initUserStuff() {
    const status = await sendRequest('checkLogin', {});

    if (!status) {
        displayErrors('Error connecting to server');
    }

    const loggedIn = !! status?.loggedIn;
    if (loggedIn) {
        onLoggedIn(status.user);
    } else {
        onLoggedOut();
    }
    initSectionFromHash(loggedIn);
}

export function loggedIn() {
    return !!theUser;
}
