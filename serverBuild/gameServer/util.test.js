"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
describe('deepClone', () => {
    it('should clone deeply nested objects', () => {
        const obj = {
            a: 'foo',
            b: [1, 2, { a: 'b' }],
            c: {
                a: [1, 2],
                b: { a: [] },
            }
        };
        const copy = util_1.deepCopy(obj);
        expect(copy).toEqual(obj);
        expect(copy).not.toBe(obj);
        expect(copy.b).not.toBe(obj.b);
        expect(copy.b[2]).not.toBe(obj.b[2]);
        expect(copy.c.b.a).not.toBe(obj.c.b.a);
    });
});
