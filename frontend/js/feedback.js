'use strict';

// ------------------------------------------------------------------
// Display freedback to the user
// ------------------------------------------------------------------

export function displayErrors(message, isError = true) {
    if (isError) {
        console.error(message);
    }

    // Remove old feedback
    clearFeedback();

    // Create and append new feedback
    let feedbackContainer = document.createElement('div');
    feedbackContainer.classList.add('feedback');
    if (isError) {
        feedbackContainer.classList.add('error');
    } else {
        feedbackContainer.classList.add('success');
    }
    feedbackContainer.innerText = message;
    document.querySelector('.active .placeFeedback').prepend(feedbackContainer);
}

// Empty input fields
export function clearPasswordFields() {
    document.querySelectorAll('input[type="password"]').forEach(element => {
        element.value = '';
    });
}

// Remove all exisitng feedback
export function clearFeedback() {
    document.querySelectorAll('.feedback').forEach(element => {
        element.remove();
    });
}
