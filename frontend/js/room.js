'use strict';

import { sendRequest } from './request.js';

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
        <td>${i++}</td>
        <td>${room.name}</td>
        <td>${room.size}x${room.size}</td>
        <td>${age}</td>
        <td><a href="#" data-go="game" class="btn btn-theme">Step in</a></td>
        </tr>
        `;
    }
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
