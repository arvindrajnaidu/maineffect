import { expect } from 'chai'
import { load } from '../src/maineffect'

describe.only('Counter', () => {
    const parsed = load('../src/examples/counter.js')
    it('should correctly', () => {
        const result = parsed
                        .find('render')
                        .source()
                        // .fold('b', null)
                        // .foldWithObject({
                        //   c: null,
                        //   e: null
                        // })
                        // .fold('f', {})
                        // .fold('h', {})
                        // .callWith()
        console.log(result)
        // expect(result).to.equal(expectedSourceCode)
    })
})
