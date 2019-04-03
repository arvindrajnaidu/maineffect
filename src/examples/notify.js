import { centsToDollar } from '../../../lib/storecash-util'
import crypt from '../../../lib/crypt'
import get from 'lodash/get'
import moment from 'moment'

export const generateNotificationsPayload = (
  req,
  {
    offerProgram,
    offerId,
    offerDecryptedID,
    offerProgramId,
    offerProgramDecryptedID,
    createOfferResponse,
    merchantEAN,
    visitorAN,
    visitorEAN,
    consumerDetails,
    visitorId,
    eventStatus
  }
) => {
  const generateFptiAlertLink = eventName => {
    return `https://www.paypal.com/tagmanager/track?comp=musenodeweb&framework_call_type=si&enrich=n&mrid=${merchantEAN}&cust=${visitorEAN}&item=return_to_merchant&event_name=${eventName}&subtype=new&offer_program_id=${offerProgramId}&offer_id=${offerId}&redirect_url=${encodeURIComponent(
      offerLandingURL
    )}`
  }
  const offerLandingURL = get(
    createOfferResponse,
    'body.localized_attributes[0].landing_url',
    ''
  )
  const customData = get(createOfferResponse, 'body.custom_data')
  /* TODO: what if createOfferResponse.body.custom_data is undefined */

  let transactionMerchant
  const issuerNames = customData.find(data => data.name === 'ISSUER_NAMES')
  const businessName = customData.find(data => data.name === 'BUSINESS_NAME')

  if (issuerNames && issuerNames.value) {
    transactionMerchant = JSON.parse(issuerNames.value)[merchantEAN]
  } else if (businessName && businessName.value) {
    transactionMerchant = businessName.value
  }

  const offerExpiryDate = get(
    createOfferResponse,
    'body.redemption_end_time',
    ''
  )

  const formattedOfferExpiryDate = moment(offerExpiryDate || '').format(
    'MM/DD/YYYY'
  )

  const valueIssued = centsToDollar(
    get(offerProgram, 'computation_rules[0].offer_value.value'),
    2
  )
  const encrEmail = crypt.encryptDES(req, consumerDetails.email)

  const formattedOfferExp = formattedOfferExpiryDate
                                .match(/\d{2}\/\d{2}\/\d{4}/)
                                    ? formattedOfferExpiryDate : ''
  return {
    mrid: merchantEAN,
    cust: visitorEAN,
    merchant_name: transactionMerchant,
    continue_link: offerLandingURL,
    fpti_continue_link_8ball: generateFptiAlertLink(
      'store_cash_8ball_notification_center_click'
    ),
    fpti_continue_link_venice: generateFptiAlertLink(
      'store_cash_venice_notification_center_click'
    ),
    user_name: consumerDetails.name,
    transmission_id: null,
    value_issued: valueIssued,
    formattedOfferExpiryDate: formattedOfferExp,
    encr_email: encrEmail,
    offerExpiryDate,
    offerId,
    offerDecryptedID,
    offerProgramId,
    offerProgramDecryptedID,
    visitorAN,
    visitorId,
    eventStatus
  }
}