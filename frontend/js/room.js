'use strict';

import { sendRequest } from './request.js';
import { startGame } from './game.js';
import { go } from './navi.js';

export async function updateRoomList() {
    const data = await sendRequest('listRooms', {});
    if (!data) return;

    const table = document.getElementById('room-list');
    table.innerHTML = '';

    const now = Math.floor(Date.now() / 1000);
    let i = 1;
    for (const room of data.rooms) {
        const age = `${now - room.modified} secs ago`;
        table.innerHTML += `<tr>
        <td>${i}</td>
        <td>${room.name}</td>
        <td>${room.size}x${room.size}</td>
        <td>${age}</td>
        <td><button type="submit" data-room="${room.id}" id="room${i}" class="btn btn-sm btn-theme go-room">Step in</button></td>
        </tr>
        `;
        i++;
    }
    initRoomListeners();
}

function initRoomListeners() {
    const roomButtons = document.querySelectorAll('.go-room');
    // console.log(roomButtons);
    let roomId = [];

    for (let i = 0; i < roomButtons.length; i++) {
        roomId[i] = roomButtons[i].dataset.room;
        // console.log(roomId[i]);
        roomButtons[i].addEventListener('click', async (event) => {
            event.preventDefault();
            console.log(roomId[i]);
            const id = roomId[i];
            const data = await sendRequest('getIntoRoom', {id});
            if (!data) {
                // TODO: kiirni ezt a hibat
                return;
            }
            // console.log(data);
            startGame(data.room.game, data.room.name);
            go('game');
        })
    };
}

let roomUpdater;

export function startRooms() {
    if (roomUpdater) {
        console.error('Rooms started while already running');
        clearInterval(roomUpdater);
    }
    roomUpdater = setInterval(updateRoomList, 50000);
}

export function stopRooms() {
    clearInterval(roomUpdater);
    roomUpdater = undefined;
}
