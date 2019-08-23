import { expect } from 'chai'
import { parseFn } from '../src/maineffect'

describe('sum()', () => {
    const parsed = parseFn(`${__dirname}/../src/examples/calculator.js`)
    it('should return the sum of two numbers', () => {
        let { result } = parsed.find('sum').callWith(1, 2)
        expect(result).to.equal(3)
    })
})
