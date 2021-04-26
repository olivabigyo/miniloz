# Rooms of Loops

Author: Katalin Lukacsne Toth
Version: 1.0.0

By making this game I wanted to create a place where people can play together. Where you can share a room with others or just play alone. A game which is easy to learn, yet difficult to put down. I chose to develop my version of the puzzle game ``Loops of Zen''. Intuitive gameplay -- tap tiles to rotate and complete the loops. :)

---

## Overview

- This is an application with a simple login system
- a puzzle game, where the player has to use the rotation mechanic of the tiles to connect all the lines
- a room configurator system; with a new version of the puzzle in each room
- multiplayer: multiple users are able to play in the same room at the same time
- a chat system to make the experience of playing together more social

---

## Installation

Database settings: `backend/prefs/config.php`

``` php
$db_user  = 'root';
$db_pass  = '';
$db_name  = 'loops';
$db_host  = 'localhost';
$db_port  = 3306;
```

Initialize the database from `backend/loops.sql`

You can also access a live version of the application at https://amongus.olivabigyo.site/loops/frontend/

## Structure

Rooms of Loops is a Single Page Web Application that communicates asynchronously with the backend. It is served by a simple JSON based API. The backend is written in object oriented PHP 7 with PDO.

The application is developed in a way that the frontend and the backend are completely independent and can be hosted separately. So care was taken to handle authenticated cross-origin requests properly. (In the current state requests from any origin are accepted, but this can be easily restricted in `backend/request_init.php`)

You can check out the frontend hosted on GitHub here: https://olivabigyo.github.io/miniloz/frontend/ and see how it talks to the same backend.

### Requests

The sign up, login, and the password changing forms of the user system are (after basic client-side validation) handled and validated on the server side via asynchronous requests.
The app uses asynchronous game-state updates and the chat also uses asynchronous messages.
The app sends automatic requests to the server to update the chat messages, the room list and the game state of the active game.
(Everything is awes..s..synchronous!)

The whole API currently consists of ## different request, which all follow the following simple pattern.

Request, Client -> Server: `{"action": ..., "payload": ...}`

Response, Server -> Client: `{"ok": true, response_data}`, or in the case of error: `{"ok": false, "error": "error message"}`

For example, this is the very first request that the app does, to determine whether the user is already logged in or not:

```json
{
    "action": "checkLogin",
    "payload": {}
}
```

```json
{
    "loggedIn": true,
    "user": {
        "id": 1,
        "name": "kata"
    },
    "ok": true
}
```

### Database

User data, chat messages, the rooms with game states and the game moves are stored in a MySQL database with the following schema:
(screenshot)

### Game

The rotation mechanic of the tiles is created with DOM manipulation and transform transition. A click event on a tile triggers an asyncronous request to save the tile-move in the database. After the move another async request fetches all the moves made in this game since the last fetch and updates the playground. This request is also repeated periodically every second (with `setInterval`).
On the backend, MySQL transactions are used to correctly handle potential simultaneous moves made by multiple players.

### Chat

The communication system uses two kind of asynchronous requests. One post request to send and save a new message in the database and another one to get the 10 newest messages from the database. The later one occurs after a message is sent and is also repeated every 3 seconds using `setInterval`.
The user can hide the chat panel to avoid distractions and concentrate on the game.

### URL History and Navigation

This a Single Page Application with asynchronous requests, so it has a single URL without subpages or GET parameters.
For users to be able to use the browser's back, forward, and reload buttons we manage the URL history with the `window.history` API and display the name of the active section in the hash part of the URL.
The navigation uses the URL hash and some data attributes of the link tags to display and hide sections of the Single Page Application.

### Themes

The user can set the color theme of the site and save this setting in the `localStorage`.

## Future features

This application can be seen as an early prototype for the game. In the future I am planning to implement to following improvements:

- Using Server Side Events for sending updates from the database, instead of polling every couple of seconds.
- Drawing on Canvas for a smoother tile display and scaling, instead of DOM manipulation.
- Message history: users should be able to see old messages, not just the 10 newest messages.
- Browse all rooms not just the 10 most recently active rooms with table pagination, or in a separate section with a more detailed room list.
- In the detailed roomlist show whether the puzzle in the room is completed.
- In the detailed roomlist show the room creator's name.
- Implement a unique roomname generator to spare the user from choosing a unique name.
- Implement a Garbage Collector for rooms which are inactive and/or completed.
- Implement a room chat, not just a global one.
- Make a toroid topology for the game (where the opposite sides wrap around).
