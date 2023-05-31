import { expect } from 'chai'
import { parseFn } from '../maineffect'

describe('This', () => {
    const parsed = parseFn(require.resolve('./this'))
    beforeEach(() => {
        parsed.reset();
    })
    
    it('should return value of a', () => {
        const result = parsed
                            .find('getA')
                            .apply({a: 1})
        expect(result).to.equal(1)
    });
});