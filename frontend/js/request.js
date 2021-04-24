'use strict';

import { displayErrors } from './feedback.js';

// ******************************************************************
// ************************* THE REQUEST ****************************
// ******************************************************************

const apiEndpoint = '../backend/server.php';
// const apiEndpoint = 'https://amongus.olivabigyo.site/loops-backend/server.php';

export async function sendRequest(action, payload) {

    try {
        const request = await fetch(apiEndpoint, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action, payload })
        });

        if (request.status != 200) {
            throw Error('Fetch bad status: ' + request.status);
        }

        // We do this instead of `request.json()` directly to help debugging of the server side.
        // Most PHP errors result in the response being invalid JSON (PHP error messages), so it's
        // very helpful to see it immediately in the console.
        // Once the server side is stable, this can be turned back.
        const body = await request.text();
        let data;
        try {
            data = JSON.parse(body);
        } catch (err) {
            console.error('Bad JSON in response:', body);
            displayErrors('Server returned a bad response');
            return;
        }

        if (!data.ok) {
            displayErrors(data.error);
            return;
        }

        console.log('Successful request.', data);
        return data;

    } catch (err) {
        console.error(err);
    }
}
