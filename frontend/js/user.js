'use strict';

import { sendRequest } from './request.js';
import { initSectionFromHash } from './navi.js';
import { startChat, stopChat } from './chat.js';

let user;
let userId;

export function onLoggedIn(user) {
    user = user.name;
    userId = user.id;

    document.getElementById('nav-right').classList.remove('hidden');
    document.getElementById('profile-name').innerText = user;
    startChat();
}

export function onLoggedOut() {
    user = undefined;
    userId = undefined;

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
    return !!user;
}
