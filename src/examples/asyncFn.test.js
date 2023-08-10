import { expect } from 'chai'
import { parseFn } from '../maineffect'
// import basic from './basic'

describe('asyncFn', () => {    
    const parsed = parseFn(require.resolve('./asyncFn'))
    describe('foo()', () => {
        it('should return the sum of two numbers', async () => {
            const result = await parsed
                            .find('foo')
                            .callWith()
            expect(result).to.equal(10)
        })
    })
});