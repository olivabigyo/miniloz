'use strict';

import { sendRequest } from './request.js';
import { initSectionFromHash } from './navi.js';
import { startChat, stopChat } from './chat.js';
import { updateRoomList } from './room.js';

const theUser = {};

export function onLoggedIn(user) {
    theUser.name = user.name;
    theUser.id = user.id;

    document.getElementById('nav-right').classList.remove('hidden');
    document.getElementById('profile-name').innerText = user.name;
    startChat();
    updateRoomList();
}

export function onLoggedOut() {
    console('Logged out');
    theUser.name = undefined;
    theUser.id = undefined;

    document.getElementById('nav-right').classList.add('hidden');
    document.getElementById('profile-name').innerText = 'NoUser';
    stopChat();
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
    return !!theUser.name;
}
