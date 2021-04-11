const playground = document.getElementById('canvas')
const nullTile = { image: '', connections: '0000', rotation: 0 };
let game = {};
const apiEndpoint = 'http://localhost/miniloz/backend/server.php';

async function getRoom() {
    // console.log('Requesting new room from server...');

    try {
        const request = await fetch(apiEndpoint);

        if (request.status != 200) {
            console.log('Fetch bad status: ' + request.status);
            return;
        }

        const data = await request.json();

        if (!data.ok) {
            console.log('Server returned error: ' + data.error);
            return;
        }

        console.log('Successful request.', data);

        game = data.room.game;
        init();

    } catch (err) {
        console.log(err);
    }
}

getRoom();

// This is a 4x4 room for the first prototype before writing getRoom and without the serverside createRoom:
// The directions in the connections-string are: up, right, down, left
// let room = {
//     id: 1, name: 'main', w: 4, h: 4, tiles:
//         [[
//             { image: 'two.svg', connections: '1001', rotation: 0 },
//             { image: 'two-straight.svg', connections: '0101', rotation: 0 },
//             { image: 'three.svg', connections: '1011', rotation: 0 },
//             { image: 'one.svg', connections: '0100', rotation: 0 },
//         ],
//         [
//             { image: 'three.svg', connections: '1011', rotation: 0 },
//             { image: 'two-straight.svg', connections: '0101', rotation: 0 },
//             { image: 'four.svg', connections: '1111', rotation: 0 },
//             { image: 'two.svg', connections: '1001', rotation: 0 },
//         ],
//         [
//             { image: 'two.svg', connections: '1001', rotation: 0 },
//             { image: 'three.svg', connections: '1011', rotation: 0 },
//             { image: 'three.svg', connections: '1011', rotation: 0 },
//             { image: 'three.svg', connections: '1011', rotation: 0 },
//         ],
//         [
//             { image: 'null.svg', connections: '0000', rotation: 0 },
//             { image: 'one.svg', connections: '0100', rotation: 0 },
//             { image: 'null.svg', connections: '0000', rotation: 0 },
//             { image: 'one.svg', connections: '0100', rotation: 0 },
//         ]]
// };

// define the tile from position
function getTile(r, c) {
    return game.tiles[r][c];
}

function init() {
    let r = 0;
    for (const row of game.tiles) {
        let c = 0;
        for (const tile of row) {
            // console.log('just counting...');
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
                // console.log('clicked');
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
    // console.log('row: ', tile.r, 'column: ', tile.c);

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


// ********************************


const sections = document.querySelectorAll('.section');

const sectionDict = {
    home: document.querySelector('.home-section'),
    login: document.querySelector('.login-section'),
    signup: document.querySelector('.signup-section'),
    profile: document.querySelector('.profile-section'),
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
