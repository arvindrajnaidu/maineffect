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

module.exports = options => {
  /**
   * get keen creds from configuration
   * different environments might have different keen creds
   */
  const client = new KeenTracking({
    projectId: options.keenProjectId,
    writeKey: options.keenWriteKey
  })

  return (req, res) => {
    let eventType
    let data

    if (req.params && req.params.trackingType) {
      eventType = req.params.trackingType
    } else {
      logger.error(req, 'tracker_middleware_error', {
        msg: 'No eventType found'
      })
      return res
        .status(400)
        .json({ msg: 'No eventType found', skipTracking: true })
    }

    try {
      data = decodeData(req.query.data)
    } catch (e) {
      logger.error(req, 'tracker_middleware_error', {
        msg: 'Unable to decode query param `data`'
      })
      return res
        .status(400)
        .json({ msg: 'Error while decoding data', skipTracking: true })
    }

    try {
      // append paypal visitor information to the user data for tracking
      if (data.user && req.cookies && req.cookies.ts) {
        const guid = queryString.parse(req.cookies.ts).vr
        data.user.id = guid
        logger.info(req, 'tracker_middleware', {
          msg: 'user guid found...assigning to data'
        })
      }
    } catch (e) {
      logger.error(req, 'tracker_middleware_error', {
        msg: 'Error parsing ts cookie'
      })
      return res.status(400).json({ msg: 'Bad Cookie', skipTracking: true })
    }

    return client
      .recordEvent(eventType, data)
      .then(response => {
        logger.info(req, 'tracker_middleware', { msg: 'Keen record created' })
        return res.json({ ...response, skipTracking: true })
      })
      .catch(error => {
        logger.error(req, 'tracker_middleware_error', {
          msg: 'Error in creating keen record'
        })
        return res.status(500).send(error)
      })
  }
}