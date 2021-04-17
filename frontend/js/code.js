'use strict';

const playground = document.getElementById('canvas')
const nullTile = { image: '', connections: '0000', rotation: 0 };
let game = {};
// const apiEndpoint = 'http://localhost/miniloz/backend/server.php';
const apiEndpoint = 'https://amongus.olivabigyo.site/loops-backend/server.php';

async function sendRequest(action, payload) {

    try {
        const request = await fetch(apiEndpoint, {
            method: 'POST',
            // credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action, payload })
        });

        if (request.status != 200) {
            throw Error('Fetch bad status: ' + request.status);
        }

        const data = await request.json();

        if (!data.ok) {
            throw Error('Server returned error: ' + data.error);
        }

        console.log('Successful request.', data);
        return data;

    } catch (err) {
        console.error(err);
    }
}

// define the tile from position
function getTile(r, c) {
    return game.tiles[r][c];
}

function init() {
    playground.innerHTML = "";
    let r = 0;
    for (const row of game.tiles) {
        let c = 0;
        for (const tile of row) {
            const elem = document.createElement('div');
            elem.classList.add('tile');
            tile.elem = elem;
            const tilewidth = 600 / game.w;
            elem.style.width = `${tilewidth}px`;
            elem.style.height = `${tilewidth}px`;
            tile.deg = tile.rotation * 90;
            elem.style.transform = `rotate(${tile.deg}deg)`;
            elem.style.backgroundImage = `url(img/${tile.image})`;
            playground.appendChild(elem);
            tile.r = r;
            tile.c = c;
            elem.addEventListener('click', () => {
                clicked(tile);
            });
            c++;
        }
        r++;
    }
    // Mark the connected tiles
    for (const row of game.tiles) {
        for (const tile of row) {
            isConnected(tile);
        }
    }
}

function clicked(tile) {
    // increase values
    tile.rotation = (tile.rotation + 1) % 4;
    tile.deg += 90;
    // rotate
    tile.elem.style.transform = `rotate(${tile.deg}deg)`;
    // mark new connections
    checkConnections(tile);
}

// Mark the clicked tile and neighbours if connected
function checkConnections(tile) {
    isConnected(tile);
    isConnected(topNeighbour(tile));
    isConnected(rightNeighbour(tile));
    isConnected(bottomNeighbour(tile));
    isConnected(leftNeighbour(tile));
}

// Define neigbouring tiles
function topNeighbour(t) {
    if (t.r > 0) {
        return getTile(t.r - 1, t.c);
    } else {
        return nullTile;
    }
};
function rightNeighbour(t) {
    if (t.c < game.w - 1) {
        return getTile(t.r, t.c + 1);
    } else {
        return nullTile;
    }
};
function bottomNeighbour(t) {
    if (t.r < game.h - 1) {
        return getTile(t.r + 1, t.c);
    } else {
        return nullTile;
    }
};
function leftNeighbour(t) {
    if (t.c > 0) {
        return getTile(t.r, t.c - 1);
    } else {
        return nullTile;
    }
};

// Directions
const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

// Mark a tile if it is connected in all side with neigbours
function isConnected(tile) {
    if (tile == nullTile) return;
    // using the rotation and connections-string of the tile we know
    // which side of the tile has a pipe-part to connect (1) and which hasn't (0)
    if (
        // comparing the right side of the tile with the left side of the neighbour tile
        (tile.connections[(4 + RIGHT - tile.rotation) % 4] == rightNeighbour(tile).connections[(4 + LEFT - rightNeighbour(tile).rotation) % 4])
        // comparing the bottom side of the tile with the top side of the neighbour tile
        && (tile.connections[(4 + DOWN - tile.rotation) % 4] == bottomNeighbour(tile).connections[(4 + UP - bottomNeighbour(tile).rotation) % 4])
        // comparing the left side of the tile with the right side of the neighbour tile
        && (tile.connections[(4 + LEFT - tile.rotation) % 4] == leftNeighbour(tile).connections[(4 + RIGHT - leftNeighbour(tile).rotation) % 4])
        // comparing the top side of the tile with the bottom side of the neighbour tile
        && (tile.connections[(4 + UP - tile.rotation) % 4] == topNeighbour(tile).connections[(4 + DOWN - topNeighbour(tile).rotation) % 4])
    ) {
        // tile is connected in all sides
        tile.elem.style.opacity = 1;
        tile.elem.style.border = 'none';
    } else {
        // at least on side doesn't fit with the neigbour tile
        tile.elem.style.opacity = 0.7;
        tile.elem.style.border = '2px solid rgb(148, 148, 148)';
    }
}

// ******************************************************************
// ******************************************************************

// ------------------------------------------------------------------
// Update chat messages
// --------------------

// fetch messages from the server then repopulate the site
async function getMessages() {
    const data = await sendRequest('getMessages', {});
    updateMessages(data.messages);
}

function updateMessages(messages) {
    const messageBox = document.getElementById('messages');
    // empty the box
    messageBox.innerHTML = '';
    for (const message of messages) {
        // create new divs
        const newMessage = document.createElement('div');
        newMessage.classList.add('message');
        // fill up with messages
        newMessage.innerText = message.name + ': ' + message.content;
        // place it in the DOM
        messageBox.appendChild(newMessage);
    }
    // We have a fix-height box for the messages and
    // we want to see the newest ones, which are at the bottom
    messageBox.scrollTop = messageBox.scrollHeight;
}

getMessages();
// We want to update in every 15 seconds
setInterval(getMessages, 15000);


// ------------------------------------------------------------------
// Submit the message
// ----------------------

async function addMessage(event) {
    // async function, we don't want to reload the site
    event.preventDefault();
    // save name in localstorage
    // yes, this is a tiny app without login for now
    saveName();
    const name = document.getElementById('name');
    const message = document.getElementById('message');
    // we log everything to the logs panel to learn and understand more :)
    console.log(`Sending new message from ${name.value}: ${message.value}`);
    // this is our async request
    const reply = await sendRequest('addMessage', {name: name.value, content: message.value});
    if (reply) {
        console.log('Message successfully sent.');
        message.value = '';
        // we repopulate the site and don't wait for the automatic repopulation which only happens in every 2 seconds
        getMessages();
    }
}

// ------------------------------------------------------------------
// Event Listener
// -------------------------

document.getElementById('chatform').addEventListener('submit', addMessage);

// ------------------------------------------------------------------
// Save name in localStorage
// -------------------------

function saveName() {
    const name = document.getElementById('name');
    localStorage.setItem('letsChatName', name.value);
}

document.getElementById('name').addEventListener('blur', saveName);

function restoreName() {
    const name = localStorage.getItem('letsChatName');
    if (!name) return;
    const nameElem = document.getElementById('name');
    nameElem.value = name;
}
// TODO: move to init()
restoreName();
// TODO: do something else?
// document.getElementById('message').focus();

// ******************************************************************
// ******************************************************************


const sections = document.querySelectorAll('.section');

const sectionDict = {
    home: document.querySelector('.home-section'),
    login: document.querySelector('.login-section'),
    signup: document.querySelector('.signup-section'),
    profile: document.querySelector('.profile-section'),
    colors: document.querySelector('.colors-section'),
    password: document.querySelector('.password-section'),
    rooms: document.querySelector('.rooms-section'),
    roomGenerator: document.querySelector('.room-generator-section'),
    game: document.querySelector('.game-section'),
};

function makeActive(selected) {
    for (const section of sections) {
        section.classList.remove('active');
    }
    selected.classList.add('active');
}

function selectSection(event) {
    event.preventDefault();
    // TODO: target??
    const elem = event.target;
    makeActive(sectionDict[elem.dataset.go]);
}

for (const elem of document.querySelectorAll('a[data-go]')) {
    elem.addEventListener('click', selectSection);
}

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
    game = data.room.game;
    init();
    makeActive(sectionDict.game);
});

const loginForm = document.getElementById('submitLogin');
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('username').value;
    const pwd = document.getElementById('password').value;
    console.log(name, pwd);

    const data = await sendRequest('login', { name, pwd });
});

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
