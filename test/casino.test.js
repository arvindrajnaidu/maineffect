import { expect } from 'chai'
import { stub } from 'sinon'
import { parseFn } from '../src/maineffect'

describe('casino', () => {
    const parsed = parseFn(`${__dirname}/../src/examples/casino.js`)

    describe('handler()', () => {
        const handler = parsed.find('handler')
        it('should return undefined', async () => {
            const sendStub = stub()

            // console.log(handler
            //     .destroy('log').source())
            
            // console.log(handler.destroy('log').fold('myName', 'Joe').provide('randomizer', () => 1).source())
            const result = await handler
                                    .destroy('log')
                                    .fold('myName', 'Joe')
                                    .provide('randomizer', () => 1)                              
                                    .callWith({query: {user: 'James'}}, {send: sendStub})
                                    .result
            const expected = `Hello James. I am Joe. Your lucky number is 1`
            expect(sendStub.calledWithExactly(expected)).to.equal(true)
            expect(result).to.equal(undefined)
        })
    })
})
