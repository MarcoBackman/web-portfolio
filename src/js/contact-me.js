const MESSAGE_SERVER = "https://3.39.236.44:9091/message-service/sendFeedbackMessage";
const nameField = document.querySelector('#name-input');
const emailField = document.querySelector('#address-input');
const messageField = document.querySelector('#content-input');
const sendButton = document.querySelector('#send-button');

sendButton.addEventListener('click', function(e) {
    // prevent the actual submit event
    e.preventDefault();

    // form data
    const data = {
        name: nameField.value,
        email: emailField.value,
        content: messageField.value
    };

    // make the request
    fetch(MESSAGE_SERVER, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'no-cors',
        body: JSON.stringify(data)
    }).then(function(response) {
        if(response.ok) {
            console.log('Message sent!');
            // clear fields after successful send
            nameField.value = '';
            emailField.value = '';
            messageField.value = '';
        } else {
            console.log('An error occurred while sending the message.');
        }
    }).catch(function(error) {
        console.log('Fetch error: ', error);
    });
});