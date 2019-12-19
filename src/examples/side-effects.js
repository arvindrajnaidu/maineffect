import { request } from 'http';

const generateFoo = () => {
    return 'foo'
}

const generateFooService = async () => {
    const word = await request('/foo')
    return word
}
