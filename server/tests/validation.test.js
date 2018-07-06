const expect = require('expect');
const {
    isRealString
} = require('./../utils/validation.js');

describe('validateString', () => {
    it('should validate a string', () => {
        expect(isRealString('string')).toBe(true);
    });
    it('should not validate empty string', () => {
        expect(isRealString('')).toBe(false);
    });
    it('should not validate a number', () => {
        expect(isRealString(10)).toBe(false);
    });
});