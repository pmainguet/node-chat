const elements = {
    messageForm: $('.message__form'),
    messageText: $('.message'),
    messagesList: $('.chat__messages'),
    notificationsList: $('.chat__notifications'),
    geolocButton: $('.geoloc__button'),
    messageTemplate: $('#message-template')
};

//Abstract Notification & Message

const Message = function (res) {
    const template = elements.messageTemplate.html();
    const html = Mustache.render(template, {
        text: res.text,
        from: res.from,
        createdAt: moment(res.createdAt).format('h:mm a')

    });
    return elements.messagesList.append(html);
}

const Notification = function (text, type) {
    elements.notificationsList.html('').removeClass().addClass('chat__notifications');
    elements.notificationsList.addClass('chat__notifications--' + type);
    return elements.notificationsList.text(text);
}

//Socket
const socket = io();
socket.on('connect', function () {
    Notification(`Hello ${socket.id}, you are now connected to the chat`, 'success');
});

socket.on('newMessage', function (res) {
    Message(res);
});

socket.on('disconnect', function () {
    Notification('You are now disconnected', 'error');
});

//UX Listener
elements.messageForm.on('submit', function (e) {
    e.preventDefault();
    if (elements.messageText.val() !== '') {
        const text = elements.messageText.val();
        socket.emit('createMessage', {
            from: 'Andrew',
            text,
        }, function (res) {
            //Notification(`Message has been created: ${res.text}`, 'success');
        });
    } else {
        Notification('Merci de rentrer un message!', 'error');
    }
});

elements.geolocButton.on('click', function (e) {
    if (!navigator.geolocation) {
        return Notification('You cannot use geolocation with your browser!', 'error');
    }
    elements.geolocButton.attr('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition(function (position) {
        elements.geolocButton.removeAttr('disabled');
        const url = `https://maps.google.com?q=${position.coords.latitude},${position.coords.longitude}`;
        socket.emit('createGeoLocMessage', {
            from: 'Andrew',
            link: `<a href="${url}" target="blank" class ="user__link">This is my current position</a>`,
        }, function (res) {
            Notification(`Message has been created: Position Link`, 'success');
        });
    });
});