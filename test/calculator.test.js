import { expect } from 'chai'
import { parseFn } from '../src/maineffect'

const parsed = parseFn(require.resolve('../src/examples/calculator'))
describe('sum()', () => {
    it('should return the sum of two numbers', () => {
        let { result } = parsed.find('sum').callWith(1, 2)
        expect(result).to.equal(3)
    })
})

describe('math()', () => {
    it('should do a nested find and return the sum of two numbers', () => {
        let { result } = parsed.find('wrapper').find('add').callWith(1, 2)
        expect(result).to.equal(3)
    })
})
