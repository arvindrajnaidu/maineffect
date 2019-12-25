import { expect } from 'chai'
import { parseFn } from '../src/maineffect'

const expectedSourceCode = `const a = __maineffect_a_replacement__;
const b = __maineffect_b_replacement__;
const {c, d} = __maineffect_c_replacement__;
let e = __maineffect_e_replacement__;
var f = __maineffect_f_replacement__;
const g = () => {
    const h = __maineffect_h_replacement__;
};`

describe('fold', () => {
    const parsed = parseFn(`${__dirname}/../src/examples/fold.js`)
    it('should correctly', () => {
        const result = parsed
                        .fold('a', null)
                        .fold('b', null)
                        .foldWithObject({
                          c: null,
                          e: null
                        })
                        .fold('f', {})
                        .fold('h', {})
                        .source()
        expect(result).to.equal(expectedSourceCode)
    })
})
