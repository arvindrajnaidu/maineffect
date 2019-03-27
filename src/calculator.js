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

const doTaxes = async (bracket) => {
	const taxService = servicecore.create('taxservice', {transport: 'ppaas'})
	const taxes = await taxService.request('/api/v1/taxes', {
		method: 'POST',
		body: JSON.stringify({
			bracket
		})
	})
	return taxes
}


export default { sum, mul, sub, div, sumAsync, doTaxes }