import servicecore from 'servicecore'

const sum = (a, b) => a + b
const mul = (a, b) => a * b
const sub = (a, b) => a - b
const div = (a, b) => a / b

const sumAsync = async (a, b) => {
    let foo = await new Promise((resolve, reject) => {
        setTimeout(() => resolve(a + b), 500)
    })
    return foo
}

export default { sum, mul, sub, div, sumAsync }