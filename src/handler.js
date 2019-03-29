/**
 * Keen Tracking
 * Middleware to send tracking data to keen
 * paypal sdk sends tracking events to `https://www.paypal.com/targeting/track`
 * sdk lives here: `https://github.paypal.com/arnaidu/tracker/blob/master/PayPalShopping.md`
 */
import logger from 'beaver-logger-paypal'
import KeenTracking from 'keen-tracking'
import queryString from 'query-string'
import atob from 'atob'

/**
 * data received from sdk in base 64 encoded
 * data should be decoded before sending to keen
 */
const decodeData = data => JSON.parse(atob(decodeURIComponent(data)))

const creatorFunction = options => {
  /**
   * get keen creds from configuration
   * different environments might have different keen creds
   */
  const client = new KeenTracking({
    projectId: options.keenProjectId,
    writeKey: options.keenWriteKey
  })

  const handler = (req, res) => {
    let eventType
    let data
    let result

    if (req.params && req.params.trackingType) {
      eventType = req.params.trackingType
    } else {
      const result = {
        code: 400,
        json: { msg: 'No eventType found', skipTracking: true }
      }

      logger(req, 'tracker_middleware_error', {
        msg: result.msg
      })
      
      res.status(result.code)
      // .json(result.json)
      return result
    }
  }

  return handler
}

module.exports = creatorFunction
