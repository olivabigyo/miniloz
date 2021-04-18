'use strict';

// ******************************************************************
// ************************* THE REQUEST ****************************
// ******************************************************************

const apiEndpoint = 'http://localhost/miniloz/backend/server.php';
// const apiEndpoint = 'https://amongus.olivabigyo.site/loops-backend/server.php';

export async function sendRequest(action, payload) {

    try {
        const request = await fetch(apiEndpoint, {
            method: 'POST',
            // credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action, payload })
        });

        if (request.status != 200) {
            throw Error('Fetch bad status: ' + request.status);
        }

        const data = await request.json();

        if (!data.ok) {
            throw Error('Server returned error: ' + data.error);
        }

        console.log('Successful request.', data);
        return data;

    } catch (err) {
        console.error(err);
    }
}
