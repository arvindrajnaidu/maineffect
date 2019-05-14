import wordService from 'wordservice'

const generateFoo = () => {
    return 'foo'
}

const generateFooService = async () => {
    const word = await wordService.generateFoo()
    return word
}
