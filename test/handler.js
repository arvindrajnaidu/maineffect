import { expect } from 'chai'
import sinon from 'sinon'
import { parseFn } from '../src/dhruv'

const parsed = parseFn(`${__dirname}/../src/handler.js`)

describe('Handler Functions', () => {
    const handler = parsed
        .find('creatorFunction')
        .find('handler')
    
    it.only('should return error if tracking type is not found', () => {
        let loggerStub = sinon.stub()
        let statusStub = sinon.stub()
        let foo = handler
                    .provide('logger', loggerStub)
                    .callWith({
                    }, {
                        status: statusStub
                    })
                    .result

        expect(foo).to.deep.equal({
            code: 400,
            json: { msg: 'No eventType found', skipTracking: true }
        })
        expect(loggerStub.called).to.equal(true)
        expect(statusStub.called).to.equal(true)
    });
});
