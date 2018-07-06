const expect = require("expect");
const Users = require("../models/users.js");
const User = require("../models/user.js");

describe("Users", () => {
    let users;
    beforeEach(() => {
        users = new Users();
        users.users = [{
                id: 10,
                name: "Pierre",
                room: "Room1"
            },
            {
                id: 11,
                name: "Pierre2",
                room: "Room2"
            },
            {
                id: 12,
                name: "Pierre3",
                room: "Room1"
            }
        ];
    });

    it("should add a user", () => {
        const users = new Users();

        const user = {
            id: 13,
            name: "Pierre4",
            room: "Room4"
        };

        users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([new User(user.id, user.name, user.room)]);
    });

    it("should remove a user", () => {

        const userId = 11;
        const usersInitLength = users.users.length;

        users.removeUser(userId);

        expect(users.users.findIndex(e => e.id == userId)).toBe(-1);
        expect(users.users.length).toBe(usersInitLength - 1);
    });

    it("should get a user", () => {
        const userId = 11;
        const foundUser = users.getUser(userId);
        expect(foundUser).toNotBe(undefined);
        expect(foundUser).toEqual(users.users.find(e => e.id == userId));
    });

    it('should return the user list name', () => {
        const room = 'Room1';
        const usersName = users.users.filter(e => e.room === room).map(e => e.name);
        expect(users.getUsersList(room)).toEqual(usersName);
    });
});