const MESSAGE_SERVER = "https://3.39.236.44:9091/message-service/sendFeedbackMessage";
const nameField = document.querySelector('#name-input');
const emailField = document.querySelector('#address-input');
const messageField = document.querySelector('#content-input');
const enableSSL = document.querySelector('#allow-self-signed-host');
const sendButton = document.querySelector('#send-button');

enableSSL.addEventListener('click', function(e) {
    e.preventDefault();
    alert("인증서(CA) 등록 중. 계속 하려면 사이트 접속을 허가해주세요.");
    window.open('https://3.39.236.44:9091/message-service/sendFeedbackMessage', '_blank');
});

sendButton.addEventListener('click', function(e) {
    // prevent the actual submit event
    e.preventDefault();

    // form data
    const data = {
        name: nameField.value,
        email: emailField.value,
        content: messageField.value
    };
    console.log(data);
    // make the request
    fetch(MESSAGE_SERVER, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        mode: 'cors',
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
        alert("사이트 허용을 해주세요.");
        console.log('Fetch error: ', error);
    });
});