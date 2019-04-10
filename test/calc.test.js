import { expect } from 'chai'
import { parseFn } from '../src/mockoff'

const parsed = parseFn(`${__dirname}/../src/examples/calculator.js`)

describe('Calculator Functions', () => {
    describe('sum()', () => {
        it('should return the sum of two numbers', () => {
            const a = parsed.find('sum')
                            .callWith(1, 2).result
            expect(a).to.equal(-1)
        });
        it('should return the sum of two negative numbers', () => {
            const a = parsed.find('sum').callWith(2, 2).result
            expect(a).to.equal(4)
        });
    });
});