'use strict';

import { sendRequest } from './request.js';

// ******************************************************************
// ************************* THE CHAT *******************************
// ******************************************************************


// ------------------------------------------------------------------
// Update chat messages
// ------------------------------------------------------------------

// fetch messages from the server then repopulate the site
async function getMessages() {
    const data = await sendRequest('getMessages', {});
    updateMessages(data.messages);
}

function updateMessages(messages) {
    const messageBox = document.getElementById('messages');
    // empty the box
    messageBox.innerHTML = '';
    for (const message of messages) {
        // create new divs
        const newMessage = document.createElement('div');
        newMessage.classList.add('message');
        // fill up with messages
        newMessage.innerText = message.name + ': ' + message.content;
        // place it in the DOM
        messageBox.appendChild(newMessage);
    }
    // We have a fix-height box for the messages and
    // we want to see the newest ones, which are at the bottom
    messageBox.scrollTop = messageBox.scrollHeight;
}


// ------------------------------------------------------------------
// Submit the message
// ----------------------

async function addMessage(event) {
    // async function, we don't want to reload the site
    event.preventDefault();
    const message = document.getElementById('message');
    if (!message.value) return;

    const reply = await sendRequest('addMessage', {content: message.value});
    if (reply) {
        // console.log('Message successfully sent.');
        message.value = '';
        // we repopulate the site and don't wait for the automatic repopulation which only happens in every 2 seconds
        getMessages();
    }
}

// ------------------------------------------------------------------
// Initializing the chat module
// -------------------------

export function startChat() {
    document.getElementById('lets-chat').classList.remove('hidden');

    getMessages();
    // We want to update in every ... seconds
    setInterval(getMessages, 60000);

    // Event Listeners
    document.getElementById('chatform').addEventListener('submit', addMessage);
}
