import log from 'Logger'
import fetch from './fetcher'
import randomizer from 'randomizer'

export const handler = async (req, res) => {
    log.info('Inside handler')
    const myName = await fetch('/name/me')
    let message = `Hello ${req.query.user}. I am ${myName}. Your lucky number is ${randomizer()}`
    return res.send(message)
}

export default handler
