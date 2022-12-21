import { expect } from 'chai'
import { parseFnStr } from '../maineffect'

describe('string input test', () => {    
    const parsed = parseFnStr('/Users/anaidu/myws/maineffect/src/sometest.js', `export const sumAsync = async (a, b) => {
        const result = await new Promise((resolve) => {
            setTimeout(() => resolve(a + b), 0)
        })
        return result
    }`)
    describe('sumAsync()', () => {
        it('should return the sum of two numbers', async () => {
            const result = await parsed
                                    .find('sumAsync')
                                    .callWith(51, 82)
            expect(result).to.equal(133)
        })
    })
})
