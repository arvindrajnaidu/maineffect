import { assert, expect } from 'chai'
import { parseFn } from '../maineffect'
// import basic from './basic'

describe('annotations', () => {    
    const parsed = parseFn(require.resolve('./annotations'))

    beforeEach(() => {
        parsed.reset();
    });

    describe('foo()', () => {
        it('should find annotated fn', async () => {
            const result = await parsed
                            .find('vHandler')
                            .callWith()
            assert.equal(result, 1)
        })
    })

    describe('barHandler()', () => {
        it('should find annotated fn', async () => {
            const result = await parsed
                            .find('barHandler')
                            .callWith()
            assert.equal(result, 2)
        })
    })
});