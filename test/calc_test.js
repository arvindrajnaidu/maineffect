let chai = require('chai');
let should = chai.should();
let calc = require('../bootstrap');

describe('Calculator Functions', () => {
    describe('sum()', () => {
        it('should return the sum of two numbers', () => {
            let res = calc.sum(5,3);
            res.should.be.equal(8);
        });
    });
});