'use strict';

import { loggedIn } from './user.js';
import { goRoom, updateRoomList } from './room.js';
import { clearFeedback } from './feedback.js';

// ******************************************************************
// *********************** THE NAVIGATION ***************************
// ******************************************************************

// This is a single page application
// Only the active section is displayed on the page
// By navigating on the site the active section name is pushed to the history
// The name of the active section is displayed in the url

const sections = document.querySelectorAll('.section');
const sectionDict = {};

for (const section of sections) {
    sectionDict[section.dataset.section] = section;
}

function makeActive(sectionName) {
    if (!sectionDict[sectionName]) {
        throw new Error('Bad section name: ' + sectionName);
    }
    // hide all the sections
    for (const section of sections) {
        section.classList.remove('active');
    }
    // display the chosen one
    sectionDict[sectionName].classList.add('active');
    window.scrollTo(0, 0);
}

export function go(sectionName, options) {
    makeActive(sectionName);
    let url = '#' + sectionName;
    if (options?.params) {
        url += '?' + options.params;
    }
    if (options?.replace) {
        history.replaceState({ section: sectionName }, '', url);
    } else {
        history.pushState({ section: sectionName }, '', url);
    }
    clearFeedback();
}

window.addEventListener('popstate', (event) => {
    if (event?.state?.section) {
        makeActive(event.state.section);
    } else {
        makeActive(loggedIn() ? 'rooms' : 'home');
    }
});

export function initSectionFromHash(loggedIn) {
    if (loggedIn) {
        if (!location.hash) {
            makeActive('rooms');
            return;
        }

        const hash = location.hash.substr(1);
        if (hash == 'home') {
            go('rooms', { replace: true });
        } else if (hash.startsWith('game?')) {
            const params = new URLSearchParams(hash.substr(5));
            goRoom(params.get('id'), true);
        } else {
            makeActive(hash);
        }
        return;
    }

    // Not logged in
    if (!location.hash || location.hash == '#home') {
        makeActive('home');
    } else {
        go('home', { replace: true });
    }
}

// ------------------------------------------------------------------
// Handling the <a> buttons on the site
// ------------------------------------------------------------------

function selectSection(event) {
    event.preventDefault();
    const elem = event.currentTarget;
    go(elem.dataset.go);
}

for (const elem of document.querySelectorAll('a[data-go]')) {
    elem.addEventListener('click', selectSection);
}

// ------------------------------------------------------------------
// Home link
// ------------------------------------------------------------------

document.getElementById('home-link').addEventListener('click', (event) => {
    event.preventDefault();
    if (loggedIn()) {
        go('rooms');
        updateRoomList();
    } else {
        go('home');
    }
});
