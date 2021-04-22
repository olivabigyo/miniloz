'use strict';

import { sendRequest } from './request.js';
import { initSectionFromHash } from './navi.js';
import { startChat, stopChat } from './chat.js';
import { startRooms, stopRooms, updateRoomList } from './room.js';

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

    if (status.loggedIn) {
        onLoggedIn(status.user);
    } else {
        onLoggedOut();
    }
    initSectionFromHash(status.loggedIn);
}

export function loggedIn() {
    return !!theUser;
}
