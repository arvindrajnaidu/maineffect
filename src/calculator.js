import servicecore from 'servicecore'
import logger from './logger'

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

const doTaxes1 = async (bracket) => {
	const taxService = servicecore.create('taxservice', {transport: 'ppaas'})
	const taxes = await taxService.request('/api/v1/taxes', {
		method: 'POST',
		body: JSON.stringify({
			bracket
		})
	})
	return taxes
}

const doTaxes2 = async (bracket) => {
    try {
        const taxService = servicecore.create('taxservice', {transport: 'ppaas'})
        const taxesResult = await taxService.request('/api/v1/taxes', {
            method: 'POST',
            body: JSON.stringify({
                bracket
            })
        })
        const taxes =  taxesResult.data
	    return taxes
    } catch (e) {
        const logResult = logger.error(e)
        return null
    }
}
const throwSomething = (bracket) => {
    let foo
    return foo.bar
}


export default { sum, mul, sub, div, sumAsync, doTaxes1, doTaxes2, doTaxes3 }