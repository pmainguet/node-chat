const socket = io();
socket.on('connect', function () {
    socket.emit('createMessage', {
        from: 'Andrew',
        text: 'I am fine',
        createAt: 234
    })
});

socket.on('newMessage', function (message) {
    console.log('New message: ', message);
});

socket.on('disconnect', function () {
    console.log('I am disconnected');
});