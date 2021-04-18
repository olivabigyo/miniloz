'use strict';

// ******************************************************************
// *********************** THE NAVIGATION ***************************
// ******************************************************************

const sections = document.querySelectorAll('.section');
const sectionDict = {};

for (const section of sections) {
    sectionDict[section.dataset.section] = section;
}

function makeActive(sectionName) {
    if (!sectionDict[sectionName]) {
        throw new Error('Bad section name: ' + sectionName);
    }
    for (const section of sections) {
        section.classList.remove('active');
    }
    sectionDict[sectionName].classList.add('active');
    window.scrollTo(0, 0);
}

export function go(sectionName) {
    makeActive(sectionName);
    history.pushState({section: sectionName}, '', '#' + sectionName);
}

window.addEventListener('popstate', (event) => {
    // console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
    makeActive(event?.state?.section || 'home');
});

export function initSectionFromHash() {
    if (location.hash) {
        makeActive(location.hash.substr(1));
    }
}

// ------------------------------------------------------------------
// Handling the <a> buttons on the site
// ------------------------------------------------------------------

function selectSection(event) {
    event.preventDefault();
    // TODO: target??
    const elem = event.target;
    go(elem.dataset.go);
}

for (const elem of document.querySelectorAll('a[data-go]')) {
    elem.addEventListener('click', selectSection);
}
