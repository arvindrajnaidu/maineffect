import { expect } from 'chai'
import { parseFn } from '../src/maineffect'

describe('This', () => {
    const parsed = parseFn(`${__dirname}/../src/examples/this.js`)
    
    describe('foo', () => {
        it('should return value of a', () => {
            const result = parsed
                                .find('getA')
                                .apply({a: 1}).result
            expect(result).to.equal(1)
        });
    });
});