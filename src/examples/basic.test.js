import { expect } from 'chai'
import { parseFn } from '../maineffect'

describe('basic', () => {
    // console.log(require.resolve('../src/examples/basic'))
    const parsed = parseFn(require.resolve('./basic'))

    // console.log(parsed.source())

    describe('sum()', () => {
        it('should return the sum of two numbers', () => {
            const result = parsed
                            .find('sum')
                            // .source()
                            .callWith(51, 82)
                            .result
            // console.log(result)
            expect(result).to.equal(133)
        })
    })
    describe('sumAsync()', () => {
        it('should return the sum of two numbers', async () => {
            const result = await parsed
                                    .find('sumAsync')
                                    .callWith(51, 82)
                                    .result
            expect(result).to.equal(133)
        })
    })
    describe('pitcher()', () => {
        it('should throw an error with the argument as message', () => {
            const result = parsed.find('pitcher')
                                    .callWith('foo')
                                    .exception
            expect(result.message).to.equal('foo')
        })
    })
    describe('pitcherAsync()', () => {
        it('should throw an error with the argument as message', async () => {
            try {
                const result = await parsed
                        .find('pitcherAsync')
                        .callWith('foo')
                        .result
            } catch (e) {
                expect(e.message).to.equal('foo')
            }
        })
    })
    describe('copyUserObject()', () => {
        it('should support spread operation correctly', () => {
            const result = parsed
                    .find('copyUserObject')
                    .callWith({name: 'blah', age: 950}, 'amazon')
                    .result
            expect(result).to.deep.equal({name: 'amazon', age: 950})
        })
    })
})
