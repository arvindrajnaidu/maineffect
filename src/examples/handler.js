import log from 'Logger'
import fetch from './fetcher'
import randomizer from 'randomizer'

const handler = async (req, res) => {
    log.info('Inside handler')
    const myName = await fetch('/name/me')

    const luckyNumber = randomizer().get()
    let message = `Hello ${req.query.user}. I am ${myName}. Your lucky number is ${luckyNumber}`
    return res.send(message)
}

export default handler
