'use strict';

import { sendRequest } from './request.js';
import { go } from './navi.js';
import { startChat } from './chat.js';

let user;
let userId;

function onLoggedIn(user) {
    user = user.name;
    userId = user.id;

    document.getElementById('nav-right').classList.remove('hidden');
    document.getElementById('profile-name').innerText = user;
    startChat();
    go('rooms');
}

export async function initUserStuff() {
    const status = await sendRequest('checkLogin', {});
    console.log(status);

    if (status.loggedIn) {
        onLoggedIn(status.user);
    } else {

    }
}
