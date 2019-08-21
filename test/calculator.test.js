import { expect } from 'chai'
import { parseFn } from '../src/maineffect'

const parsed = parseFn(`${__dirname}/../src/examples/calculator.js`)

describe('sum()', () => {
    it('should return the sum of two numbers', () => {
        let { result } = parsed.find('sum').callWith(1, 2)
        expect(result).to.equal(3)
    })
})