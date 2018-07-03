const elements = {
    messageForm: $('.input__form'),
    messageText: $('.input__form__text'),
    messagesList: $('.messages ol'),
    notificationsList: $('.notifications')
};

const socket = io();
socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('newMessage', function (res) {
    console.log('New message: ', message);
    let li = $('<li class="messages__item"></li>');
    li.text(`From: ${res.from} - Message: ${res.text} - At ${res.createdAt}`);
    elements.messagesList.append(li);
    elements.messageText.val('');
});

socket.on('disconnect', function () {
    console.log('I am disconnected');
});

const emitCreatemessage = function (e) {
    e.preventDefault();
    elements.notificationsList.html('');
    if (elements.messageText.val() !== '') {
        const text = elements.messageText.val();
        socket.emit('createMessage', {
            from: 'Andrew',
            text,
        }, function (res) {
            console.log(res)
        });
    } else {
        let span = $('<span style="color:red"></span>');
        span.text('Merci de rentrer un message!');
        elements.notificationsList.append(span);
    }
}

//UX Listener
elements.messageForm.on('submit', emitCreatemessage);