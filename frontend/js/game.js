'use strict';

// ******************************************************************
// ************************ THE GAME ********************************
// ******************************************************************

const playground = document.getElementById('canvas');
// We use the null tile as imaginary neighbour for the tiles on the edges
// We need this for checking if the tile is connected on each side to the neighbours
const nullTile = { image: '', connections: '0000', rotation: 0 };
let game = {};

// Initialize game from game object
export function startGame(gameData, gameName) {
    game = gameData;
    document.getElementById('game-name').innerText = `Game: ${gameName}`;
    playground.innerHTML = "";
    const tilewidth = Math.floor(600 / game.w);
    playground.style.gridTemplateColumns = `repeat(${game.w}, ${tilewidth}px)`;
    playground.style.gridTemplateRows = `repeat(${game.w}, ${tilewidth}px)`;
    let r = 0;
    for (const row of game.tiles) {
        let c = 0;
        for (const tile of row) {
            const elem = document.createElement('div');
            elem.classList.add('tile');
            tile.elem = elem;
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
                if (isWin(game)) {
                    setTimeout(endGame, 1000);
                }
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

// Define the tile from position
function getTile(r, c) {
    return game.tiles[r][c];
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
    if (tile == nullTile) return true;
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
        return true;
    } else {
        // at least on side doesn't fit with the neigbour tile
        tile.elem.style.opacity = 0.7;
        tile.elem.style.border = '1px solid rgb(148, 148, 148)';
        return false;
    }
}

function isWin(game) {
    for (const row of game.tiles) {
        for (const tile of row) {
            if (!isConnected(tile)) {
                // console.log('not yet')
                return false;
            }
        }
    }
    console.log('You win');
    return true;
}

function endGame() {
    const smile = document.createElement('div');
    smile.classList.add('win');
    playground.appendChild(smile);
    setTimeout(() => { smile.classList.add('hidden') }, 1900);
}
