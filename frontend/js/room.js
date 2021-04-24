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
          <td><button type="submit" data-room="${room.id}" class="btn btn-sm btn-theme go-room">Step in</button></td>
        </tr>`;
        i++;
    }

    for (const button of document.querySelectorAll('.go-room')) {
        button.addEventListener('click', roomButtonClick);
    }
}

async function roomButtonClick(event) {
    event.preventDefault();
    const id = event.currentTarget.dataset.room;
    const data = await sendRequest('getRoom', { id });
    if (!data) return;

    startGame(data.room);
    go('game');
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
