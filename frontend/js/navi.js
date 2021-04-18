'use strict';

// ******************************************************************
// *********************** THE NAVIGATION ***************************
// ******************************************************************

const sections = document.querySelectorAll('.section');
const sectionDict = {};

for (const section of sections) {
    sectionDict[section.dataset.section] = section;
}

export function go(sectionName) {
    for (const section of sections) {
        section.classList.remove('active');
    }
    sectionDict[sectionName].classList.add('active');
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
