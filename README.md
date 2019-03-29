

# Dhruv

A faster way to write unit tests.


### Simple

**Parse** Parse the file.
**Find** Find the node you want to test.
**CallWith** Call with the arguments.

```
\\ Calculator.js`
const  sum  = (a, b) =>  a  +  b

\\ Calculator.test.js`
const  parsed  =  parseFn(`${__dirname}/../src/calculator.js`)

describe('sum()', () => {
	it('should return the sum of two numbers', () => {
		let  a  =  parsed.find('sum').callWith(1, 2).result
		expect(a).to.equal(3)
	});
})
```

### Throws
To test something that throws.
```
\\ Thrower.js`
const throwUndefined = (bracket) => {
	let foo
	return foo.bar
}

\\ Thrower.test.js`
const  parsed  =  parseFn(`${__dirname}/../src/thrower.js`)

describe('throwSomething()', () => {
	it('should throw', () => {
		let ex = parsed
					.find('throwSomething')
					.fold('foo',`undefined`)
					.callWith(5)
					.exception
		expect(!!ex).to.equal(true)
});
```

### Async
To test something async.
```
// SumAsync.js
const  sumAsync  =  async (a, b) => {
	let  foo  =  await  new  Promise((resolve, reject) => {
		setTimeout(() =>  resolve(a  +  b), 500)
	})
	return  foo
}

// SumAsync.test.js
const  parsed  =  parseFn(`${__dirname}/../src/async.js`)

describe('sumAsync()', () => {
	it('should return the sumAsync of two numbers', async () => {
		let a = await parsed
						.find('sumAsync')
						.callWith(5, 7)
						.result
		expect(a).to.equal(12)
	});
});
```
### Destroy
This destroys the Call Expression that starts with the `key`.
```
// Handler.js
const handler  = (req, res) => {
	res.end()
	return true
}

// Handler.test.js
const  parsed  =  parseFn(`${__dirname}/../src/Handler.js`)

describe('handler()', () => {
	parsed.find('handler')
	it('should return true', () => {
		let foo  =  handler
						.destroy('res')						
						.callWith({}, {})
						.result
		expect(foo).to.equal(true)
	});
});
```
### Provide
This reduces the Variable Declarator's initialization for the `key` to the the value provided.

```
// Handler.js
const handler  = (req, res) => {
	res.end()
	return true
}

// Handler.test.js
import  sinon  from  'sinon'
const  parsed  =  parseFn(`${__dirname}/../src/Handler.js`)

describe('handler()', () => {
	parsed.find('handler')
	it('should return true', () => {
		let resStub = sinon.stub()
		let foo = handler
					.provide('res', resStub)						
					.callWith({}, {})
					.result
		expect(resStub.called).to.equal(true)						
		expect(foo).to.equal(true)
	});
});
```
