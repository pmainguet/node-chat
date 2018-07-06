const express = require("express");
const path = require("path");
const socketIO = require("socket.io");
const http = require("http");
const {
    isRealString
} = require('./utils/validation.js')

const {
    Message
} = require("./models/message.js");

const Users = require("./models/users.js");

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

let users = new Users();

io.on("connection", socket => {
    console.log(`User with id ${socket.id} is connected`);

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Please provide a correct user and room names.')
        }

        users.addUser(socket.id, params.name, params.room);
        const user = users.getUser(socket.id);
        socket.join(user.room);

        //Send a message to the logged-in user
        const welcomeMessage = new Message("Admin", `Hello ${user.name}, welcome to the ${user.room} channel.`);
        socket.emit("newMessage", welcomeMessage);

        //Send a message to all other logged-in users
        const newuserMessage = new Message(
            "Admin",
            `User ${user.name} has just joined`
        );
        socket.broadcast.to(user.room).emit("newMessage", newuserMessage);
        io.to(user.room).emit("updateUserList", users.getUsersList(user.room));

        return callback();
    });

    socket.on("createMessage", (message, callback) => {
        //Broadcast to all user, except emitter
        const user = users.getUser(socket.id);
        if (user && isRealString(message.text)) {
            const newMessage = new Message(user.name, message.text);
            io.to(user.room).emit("newMessage", newMessage);
            callback(newMessage);
        } else {
            callback('Erreur');
        }
    });

    socket.on("createGeoLocMessage", (message, callback) => {
        const user = users.getUser(socket.id);
        if (user) {
            const newGeolocmessage = new Message(user.name, message.link);
            io.to(user.room).emit("newMessage", newGeolocmessage);
            callback(newGeolocmessage);
        }
    });

    socket.on("disconnect", () => {
        const user = users.getUser(socket.id);
        if (user) {
            users.removeUser(socket.id);
            io.to(user.room).emit("updateUserList", users.getUsersList(user.room));
            const disconnectMessage = new Message("Admin", `User ${user.name} is gone`);
            socket.broadcast.to(user.room).emit("newMessage", disconnectMessage);
        }
    });
});

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});