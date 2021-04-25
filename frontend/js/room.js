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
        const sec = now - room.modified;
        // Last activity in seconds
        let age = `${sec} secs ago`;
        // Last activity in minutes after 3 minutes
        if (sec > 180 && sec <= 5400) {
            age = `${Math.floor(sec / 60)} mins ago`;
        }
        // Last activity in hours after 90 minutes
        if (sec > 5400 && sec <= 129600) {
            age = `${Math.floor(sec / 3600)} hours ago`;

        }
        // Last acitvity in days after 36 hour
        if (sec > 129600) {
            age = `${Math.floor(sec / 86400)} days ago`;

        }
        table.innerHTML += `<tr>
          <td>${i}</td>
          <td>${room.name}</td>
          <td>${room.size}x${room.size}</td>
          <td>${age}</td>
          <td><a href="#game?id=${room.id}" data-room="${room.id}" class="btn btn-sm btn-theme go-room">Step in</a></td>
        </tr>`;
        i++;
    }

    for (const button of document.querySelectorAll('.go-room')) {
        button.addEventListener('click', roomButtonClick);
    }
}

export async function goRoom(id, replace) {
    const data = await sendRequest('getRoom', { id });
    if (!data) return;

    startGame(data.room);
    go('game', { params: `id=${id}`, replace });
}

function roomButtonClick(event) {
    event.preventDefault();
    const id = event.currentTarget.dataset.room;
    goRoom(id);
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
