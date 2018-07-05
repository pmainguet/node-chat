const express = require("express");
const path = require("path");
const socketIO = require("socket.io");
const http = require("http");

const {
    Message
} = require("./models/message.js");

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on("connection", socket => {
    console.log(`User with id ${socket.id} is connected`);

    //LOGIN MESSAGES

    //Send a message to the logged-in user
    const welcomeMessage = new Message("Admin", "Welcomee to our chat app");
    socket.emit("newMessage", welcomeMessage);

    //Send a message to all other logged-in users
    const newuserMessage = new Message(
        "Admin",
        `User ${socket.id} has just joined`
    );
    socket.broadcast.emit("newMessage", newuserMessage);

    //CREATE MESSAGES

    socket.on("createMessage", (message, callback) => {
        //Broadcast to all user, except emitter
        const newMessage = new Message(message.from, message.text);
        io.emit("newMessage", newMessage);
        callback(newMessage);
    });

    socket.on("createGeoLocMessage", (message, callback) => {
        const newGeolocmessage = new Message(message.from, message.link);
        io.emit("newMessage", newGeolocmessage);
        callback(newGeolocmessage);
    });

    //DISCONNECT MESSAGE

    socket.on("disconnect", () => {
        const text = `User with id ${socket.id} is gone`;
        console.log(text);
        const disconnectMessage = new Message("Admin", text);
        socket.broadcast.emit("newMessage", disconnectMessage);
    });
});

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});