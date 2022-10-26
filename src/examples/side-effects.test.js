import { expect } from 'chai'
import { parseFn } from '../maineffect'

describe('Side Effects', () => {
    const parsed = parseFn(require.resolve('./side-effects.js'))
    
    describe('generateFoo()', () => {
        it('should return a word', () => {
            const result = parsed.find('generateFoo').callWith().result
            expect(result).to.equal('foo')
        });
    });
    describe('generateFooService()', () => {
        it('should return a word using a service', async () => {
            const result = await parsed
                                    .find('generateFooService')
                                    .provide('request', () => 'foo')
                                    .callWith()
                                    .result
            expect(result).to.equal('foo')
        });
    });
});