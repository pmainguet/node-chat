const elements = {
    messageForm: $('.message__form'),
    messageInput: $('.message__input'),
    messagesList: $('.chat__messages'),
    notificationsList: $('.chat__notifications'),
    geolocButton: $('.geoloc__button'),
    messageTemplate: $('#message-template'),
    viewPort: $(window),
    chatSidebar: $('.chat__sidebar .users')
};

const params = $.deparam(window.location.search);

//Abstract Notification & Message
const Message = function (res) {
    const template = elements.messageTemplate.html();
    const html = Mustache.render(template, {
        text: res.text,
        from: res.from,
        createdAt: moment(res.createdAt).format('h:mm a')

    });
    elements.messageInput.val('')
    return elements.messagesList.append(html);
}

const Notification = function (text, type) {
    const el = elements.notificationsList;
    el.html('').removeClass().addClass('chat__notifications');
    el.addClass('chat__notifications--' + type);
    el.text(text)
    return el.show().delay(3000).fadeOut('slow');
}

function scrollToBottom() {
    const messages = elements.messagesList;
    const newMessage = messages.children('li:last-child');

    const clientHeight = messages.prop('clientHeight');
    const scrollTop = messages.prop('scrollTop');
    const scrollHeight = messages.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

//Socket
const socket = io();
socket.on('connect', function () {
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        }
    })
});

socket.on('newMessage', function (res) {
    Message(res);
    scrollToBottom();
});

socket.on('updateUserList', function (list) {
    elements.chatSidebar.html('');
    let html = $('<ol></ol>');
    list.forEach(function (user) {
        html.append($('<li></li>').text(user));
    });
    return elements.chatSidebar.append(html);
})

socket.on('disconnect', function () {
    Notification('You are now disconnected', 'error');
});

//UX Listener
elements.messageForm.on('submit', function (e) {
    e.preventDefault();
    if (elements.messageInput.val() !== '') {
        const text = elements.messageInput.val();
        socket.emit('createMessage', {
            from: params.name,
            text,
        }, function (err) {
            if (err) {
                Notification('Merci de rentrer un message!', 'error');
            }
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
            from: params.name,
            link: `<a href="${url}" target="blank" class ="user__link">This is my current position</a>`,
        }, function (err) {
            if (err) {
                Notification('Merci de rentrer un message!', 'error');
            }
        });
    });
});