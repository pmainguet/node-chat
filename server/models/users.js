const User = require('./user.js');

class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        const newUser = new User(id, name, room);
        this.users.push(newUser);
    }

    removeUser(id) {
        const index = this.users.findIndex(e => e.id == id);
        if (index) {
            this.users.splice(index, 1);
        }
        return id;
    }

    getUser(id) {
        return this.users.find(e => e.id == id);
    }

    getUsersList(room) {
        const users = this.users.filter(e => e.room == room);
        return users.map(e => e.name);
    }
}

module.exports = Users