

# Dhruv

A faster way to write unit tests.

### Simple
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
```
\\ Thrower.js`
const throwUndefined = (bracket) => {
	let foo
	return foo.bar
}

\\ Thrower.test.js`
const  parsed  =  parseFn(`${__dirname}/../src/thrower.js`)

describe('throwUndefined()', () => {
	it('should throw', () => {
		let ex = parsed
					.find('throwUndefined')
					.fold('foo',`undefined`)
					.callWith(5)
					.exception
		expect(!!ex).to.equal(true)
});
```

### Cheatsheet

#### parse
Parse the file you want to test

#### find
Find the function you want to test

#### fold
Do a left-fold. A

#### provide
Give the function globals

#### destroy
Remove a line starting with a particular function call.

#### callWith
Call the function with arguments

### FAQ
