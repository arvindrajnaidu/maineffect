import { expect } from 'chai'
import { parseFn } from '../maineffect'

describe('clashes', () => {
    const parsed = parseFn(require.resolve('./clashes'))
    beforeEach(() => {
        parsed.reset();
    })
    describe('getPayment()', () => {
        it('should return the sum of two numbers', () => {
            const result = parsed
                            .find('getPayment')
                            .provide('taxRate', 0.15)
                            .callWith(100)
            expect(result).to.equal(15)
        })
    })
})
