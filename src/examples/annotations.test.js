import { expect } from 'chai'
import { parseFn } from '../maineffect'
// import basic from './basic'

describe('annotations', () => {    
    const parsed = parseFn(require.resolve('./annotations'))
    describe('foo()', () => {
        it('should find annotated fn', async () => {
            const result = await parsed
                            .find('vHandler')
                            .callWith()
            console.log(result)
        })
    })
});