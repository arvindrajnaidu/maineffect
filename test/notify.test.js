import { expect } from 'chai'
import { parseFn } from '../src/dhruv'

const parsed = parseFn(`${__dirname}/../src/examples/notify.js`)

describe('generateNotificationsPayload()', () => {
    it('should ', () => {
        let a = parsed
                    .find('generateNotificationsPayload')
                    .fold('generateFptiAlertLink', `() => {}`)
                    .fold('offerLandingURL', 5)
                    .fold('customData', 6)
                    .fold('issuerNames', `{value: JSON.stringify({"merchantEAN": "bar"})}`)
                    .fold('businessName', 7)
                    .fold('offerExpiryDate', 8)
                    .fold('formattedOfferExpiryDate', 9)
                    .fold('valueIssued', '"bar"')
                    .fold('encrEmail', '"encrEmail"')
                    .fold('formattedOfferExp', '"formattedOfferExp"')
                    .callWith({}, {
                        consumerDetails: {
                            name: 'foo'
                        },
                        merchantEAN: 'sdasdf'
                    })
                    .result
        expect(a.mrid).to.equal('sdasdf')
    });
});