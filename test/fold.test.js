import { expect } from 'chai'
import { parseFn } from '../src/maineffect'

describe('fold', () => {
    const parsed = parseFn(`${__dirname}/../src/examples/fold.js`)
    it('should fold correctly', () => {
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
        // console.log(result)
        expect(result).contains('const a = __maineffect_a_replacement__')
    })
})
