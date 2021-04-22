export function displayErrors(error, bool = 'true') {

    // Remove old feedback
    if (document.querySelector('.feedback')) {
        document.querySelectorAll('.feedback').forEach(element => {
            element.remove();
        });
    }
    // Create and append new feedback
    let feedbackContainer = document.createElement('div');
    feedbackContainer.classList.add('feedback');
    if (bool) {
        feedbackContainer.classList.add('error');
    } else {
        feedbackContainer.classList.add('success');
    }
    feedbackContainer.innerText = error;
    document.querySelector('.active .placeFeedback').prepend(feedbackContainer);
}

export function emptyFields() {
    document.querySelectorAll('input[type="password"]').forEach(element => {
        element.value = '';
    });
}
