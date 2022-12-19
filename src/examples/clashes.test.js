import { expect } from 'chai'
import { parseFn } from '../maineffect'

describe.only('clashes', () => {
    const parsed = parseFn(require.resolve('./clashes'))

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
