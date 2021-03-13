const tilesDOM = document.querySelectorAll('.tiles');
const rowlength = 4;
const degrees = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const nullTile = { image: '', connections: '0000', rotation: 0 };
let tilesObject = [
    { image: 'two.svg', connections: '1001', rotation: 0 },
    { image: 'two-straight.svg', connections: '0101', rotation: 0 },
    { image: 'three.svg', connections: '1011', rotation: 0 },
    { image: 'one.svg', connections: '0100', rotation: 0 },
    { image: 'three.svg', connections: '1011', rotation: 0 },
    { image: 'two-straight.svg', connections: '0101', rotation: 0 },
    { image: 'four.svg', connections: '1111', rotation: 0 },
    { image: 'two.svg', connections: '1001', rotation: 0 },
    { image: 'two.svg', connections: '1001', rotation: 0 },
    { image: 'three.svg', connections: '1011', rotation: 0 },
    { image: 'three.svg', connections: '1011', rotation: 0 },
    { image: 'three.svg', connections: '1011', rotation: 0 },
    { image: 'null.svg', connections: '0000', rotation: 0 },
    { image: 'one.svg', connections: '0100', rotation: 0 },
    { image: 'null.svg', connections: '0000', rotation: 0 },
    { image: 'one.svg', connections: '0100', rotation: 0 }
];


for (let i = 0; i < tilesDOM.length; ++i) {
    tilesDOM[i].addEventListener('click', () => {
        console.log('clicked');
        tilesObject[i].rotation = (tilesObject[i].rotation + 1) % 4;
        degrees[i] += 90;
        tilesDOM[i].style.transform = `rotate(${degrees[i]}deg)`;
        // connections(i);
        // isConnected(i);
        checkConnections(i);
    })
}

// Neigbouring positions
function topNeighbour(i) {
    if (i - rowlength > -1) {
        return tilesObject[i - rowlength];
    } else {
        return nullTile;
    }
};
function rightNeighbour(i) {
    if (i % 4 != 3) {
        return tilesObject[i + 1];
    } else {
        return nullTile;
    }
};
function bottomNeighbour(i) {
    if (i + rowlength < 16) {
        return tilesObject[i + rowlength];
    } else {
        return nullTile;
    }
};
function leftNeighbour(i) {
    if (i % 4 != 0) {
        return tilesObject[i - 1];
    } else {
        return nullTile;
    }
};

// rotation
// tile.rotation = 0 to 3

// directions:
const topy = 0;
const right = 1;
const bottom = 2;
const left = 3;

// mytile.connections is a 4 character string and we want to compare all the four side with the neighboring sides

function connections(i) {
    // console.log('clicked tile: ',tilesObject[i]);

    console.log('tile is connected with:')
    if (tilesObject[i].connections[(4 + right - tilesObject[i].rotation) % 4] == rightNeighbour(i).connections[(4 + left - rightNeighbour(i).rotation) % 4]) {
        console.log("- right neigbour");
    }
    // console.log('bottom neighbour: ', bottomNeighbour(i));

    if (tilesObject[i].connections[(4 + bottom - tilesObject[i].rotation) % 4] == bottomNeighbour(i).connections[(4 + topy - bottomNeighbour(i).rotation) % 4]) {
        console.log("- bottom neigbour");
    }
    // console.log('left neghbour: ', leftNeighbour(i));

    if (tilesObject[i].connections[(4 + left - tilesObject[i].rotation) % 4] == leftNeighbour(i).connections[(4 + right - leftNeighbour(i).rotation) % 4]) {
        console.log("- left neigbour");
    }
    // console.log('top neighbour: ', topNeighbour(i));

    if (tilesObject[i].connections[(4 + topy - tilesObject[i].rotation) % 4] == topNeighbour(i).connections[(4 + bottom - topNeighbour(i).rotation) % 4]) {
        console.log("- top neigbour");
    }
}

function isConnected(i) {
    if ((tilesObject[i].connections[(4 + right - tilesObject[i].rotation) % 4] == rightNeighbour(i).connections[(4 + left - rightNeighbour(i).rotation) % 4])
        && (tilesObject[i].connections[(4 + bottom - tilesObject[i].rotation) % 4] == bottomNeighbour(i).connections[(4 + topy - bottomNeighbour(i).rotation) % 4])
        && (tilesObject[i].connections[(4 + left - tilesObject[i].rotation) % 4] == leftNeighbour(i).connections[(4 + right - leftNeighbour(i).rotation) % 4])
        && (tilesObject[i].connections[(4 + topy - tilesObject[i].rotation) % 4] == topNeighbour(i).connections[(4 + bottom - topNeighbour(i).rotation) % 4])) {
        console.log('YES!');
        tilesDOM[i].style.opacity = 1;
    } else {
        tilesDOM[i].style.opacity = 0.7;

    }
}

function checkConnections(i) {
    isConnected(i);
    if (i - rowlength > -1) {
        isConnected(i - rowlength);
    }
    if (i % 4 != 3) {
        isConnected(i + 1);
    }
    if (i + rowlength < 16) {
        isConnected(i + rowlength);
    }
    if (i % 4 != 0) {
        isConnected(i - 1);
    }


}
