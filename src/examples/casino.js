import Logger from 'util';
import { request } from 'https';

export const handler = async (req, res) => {    
    log.info('Inside handler')
    const myName = await request('/name/me')
    let message = `Hello ${req.query.user}. I am ${myName}. Your lucky number is ${Math.random()}`
    return res.send(message)
}

export default handler
