import { expect } from 'chai'
import { parseFn } from '../maineffect'

const parsed = parseFn(require.resolve('./calculator'));

describe('sum()', () => {
    it('should return the sum of two numbers', () => {
        let result = parsed.find('sum').callWith(1, 2)
        expect(result).to.equal(3)
    })
})

describe('wrapper.subtract()', () => {
    it('should do a nested find and return the subtraction of two numbers', () => {
        let result = parsed.find('wrapper').find('subtract').callWith(2, 1)
        expect(result).to.equal(1)
    })
})
