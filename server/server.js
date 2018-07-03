const express = require("express");
const path = require("path");
const socketIO = require('socket.io');
const http = require('http');

const {
    Message
} = require('./models/message.js');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
    console.log('User is connected');
    //Send a message to the logged-in user
    const welcomeMessage = new Message('Admin', 'Welcome to our chat app');
    socket.emit('newMessage', welcomeMessage);
    //Send a message to all other logged-in users
    const newuserMessage = new Message('Admin', 'A new user has just joined');
    socket.broadcast.emit('newMessage', newuserMessage)
    socket.on('createMessage', (message, callback) => {
        //console.log('Creation of message', message)

        //Broadcast to all user, including emitter
        // io.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })
        //Broadcast to all user, except emitter
        socket.broadcast.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        })
        callback({
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    })
    socket.on('disconnect', () => {
        console.log('User is disconnected');
    });
});

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});