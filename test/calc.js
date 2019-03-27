import { expect } from 'chai'
import { parseFn } from '../src/dhruv'

const parsed = parseFn(`${__dirname}/../src/calculator.js`)

describe('Calculator Functions', () => {
    describe('sum()', () => {
        it('should return the sum of two numbers', () => {
            let a = parsed.find('sum').callWith(1, 2)
            expect(a).to.equal(3)
        });
        it('should return the sum of two negative numbers', () => {
            let a = parsed.find('sum').callWith(-1, 2)
            expect(a).to.equal(1)
        });
    });
    describe('mul()', () => {
        it('should return the mul of two numbers', () => {
            let a = parsed.find('mul').callWith(5, 7)
            expect(a).to.equal(35)
        });
        it('should return the mul of two negative numbers', () => {
            let a = parsed.find('mul').callWith(-2, 3)
            expect(a).to.equal(-6)
        });
    });
    
    describe('sumAsync()', () => {
        it('should return the sumAsync of two numbers', async () => {
            let a = await parsed.find('sumAsync').callWith(5, 7)
            expect(a).to.equal(12)
        });
    });
});