import { expect } from 'chai'
import { parseFn } from '../maineffect'

describe('This', () => {
    const parsed = parseFn(require.resolve('./this'))
    
    describe('foo', () => {
        it('should return value of a', () => {
            const result = parsed
                                .find('getA')
                                .apply({a: 1}).result
            expect(result).to.equal(1)
        });
    });
});