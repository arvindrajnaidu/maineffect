import { expect } from 'chai'
import { stub } from 'sinon'
import { load } from '../src/maineffect'

describe('casino', () => {
    const parsed = load(`${__dirname}/../src/examples/casino.js`, {
        ignoreFnCalls: 'log'
    })

    describe('handler()', () => {
        const handler = parsed.find('handler')
        it('should return undefined', async () => {
            const sendStub = stub()
            const result = await handler
                                    .destroy('log')
                                    .fold('myName', 'Joe')
                                    .provide('Math', {random: () => 1})
                                    .callWith({query: {user: 'James'}}, {send: sendStub})
                                    .result
            const expected = `Hello James. I am Joe. Your lucky number is 1`
            expect(sendStub.calledWithExactly(expected)).to.equal(true)
            expect(result).to.equal(undefined)
        })
    })

})
