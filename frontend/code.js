const canvas = document.getElementById('canvas')
const nullTile = { image: '', connections: '0000', rotation: 0 };
let room = {
    id: 1, name: 'main', w: 4, h: 4, tiles:
        [[
            { image: 'two.svg', connections: '1001', rotation: 0 },
            { image: 'two-straight.svg', connections: '0101', rotation: 0 },
            { image: 'three.svg', connections: '1011', rotation: 0 },
            { image: 'one.svg', connections: '0100', rotation: 0 },
        ],
        [
            { image: 'three.svg', connections: '1011', rotation: 0 },
            { image: 'two-straight.svg', connections: '0101', rotation: 0 },
            { image: 'four.svg', connections: '1111', rotation: 0 },
            { image: 'two.svg', connections: '1001', rotation: 0 },
        ],
        [
            { image: 'two.svg', connections: '1001', rotation: 0 },
            { image: 'three.svg', connections: '1011', rotation: 0 },
            { image: 'three.svg', connections: '1011', rotation: 0 },
            { image: 'three.svg', connections: '1011', rotation: 0 },
        ],
        [
            { image: 'null.svg', connections: '0000', rotation: 0 },
            { image: 'one.svg', connections: '0100', rotation: 0 },
            { image: 'null.svg', connections: '0000', rotation: 0 },
            { image: 'one.svg', connections: '0100', rotation: 0 },
        ]]
};

function getTile(r, c) {
    return room.tiles[r][c];
}

function init() {
    let r = 0;
    for (const row of room.tiles) {
        let c = 0;
        for (const tile of row) {
            // console.log('just do it!');
            const elem = document.createElement('div');
            elem.classList.add('tile');
            tile.elem = elem;
            tile.deg = tile.rotation * 90;
            elem.style.transform = `rotate(${tile.deg}deg)`;
            elem.style.backgroundImage = `url(img/${tile.image})`;
            canvas.appendChild(elem);
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
    for (const row of room.tiles) {
        for (const tile of row) {
            isConnected(tile);
        }
    }
}

// init();

function clicked(tile) {
    // console.log('row: ', tile.r, 'column: ', tile.c);
    tile.rotation = (tile.rotation + 1) % 4;
    tile.deg += 90;
    tile.elem.style.transform = `rotate(${tile.deg}deg)`;
    checkConnections(tile);
}

function checkConnections(tile) {
    isConnected(tile);
    isConnected(topNeighbour(tile));
    isConnected(rightNeighbour(tile));
    isConnected(bottomNeighbour(tile));
    isConnected(leftNeighbour(tile));
}

// directions:
const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

// Neigbouring positions
function topNeighbour(t) {
    if (t.r > 0) {
        return getTile(t.r - 1, t.c);
    } else {
        return nullTile;
    }
};
function rightNeighbour(t) {
    if (t.c < room.w - 1) {
        return getTile(t.r, t.c + 1);
    } else {
        return nullTile;
    }
};
function bottomNeighbour(t) {
    if (t.r < room.h - 1) {
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

function isConnected(tile) {
    if (tile == nullTile) return;
    if (
        (tile.connections[(4 + RIGHT - tile.rotation) % 4] == rightNeighbour(tile).connections[(4 + LEFT - rightNeighbour(tile).rotation) % 4])
        && (tile.connections[(4 + DOWN - tile.rotation) % 4] == bottomNeighbour(tile).connections[(4 + UP - bottomNeighbour(tile).rotation) % 4])
        && (tile.connections[(4 + LEFT - tile.rotation) % 4] == leftNeighbour(tile).connections[(4 + RIGHT - leftNeighbour(tile).rotation) % 4])
        && (tile.connections[(4 + UP - tile.rotation) % 4] == topNeighbour(tile).connections[(4 + DOWN - topNeighbour(tile).rotation) % 4])
    ) {
        tile.elem.style.opacity = 1;
    } else {
        tile.elem.style.opacity = 0.7;
    }
}




//
//
// ////////////////////////////////////////////////////////////////////////////

const apiEndpoint = 'http://localhost/miniloz/backend/server.php';

async function getRoom() {
    // log(`Requesting ${operation} from server...`);

    try {
        const request = await fetch(apiEndpoint, {
            // method: 'POST',
            // headers: {
                // 'Content-Type': 'application/json'
            // },
            // body: JSON.stringify({ operation, payload })
        });
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
        room = data.room;
        init();
    } catch (err) {
        // Error handling
        console.log(err);
        // logError('Exeption: ' + err);
    }
}

getRoom();
