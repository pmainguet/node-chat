const expect = require('expect');
const {
    Message
} = require('./../models/message.js');

describe('generateMessage', () => {
    it('should generate a corrected formated object', () => {
        const testMessage = new Message('Test', 'This is simply a test');
        expect(testMessage.createdAt).toBeA('number');
        expect(testMessage).toInclude({
            from: testMessage.from,
            text: testMessage.text
        })
    })
});