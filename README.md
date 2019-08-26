# Maineffect

Writing tests by redacting source code, instead of mocking.

In software testing, each test exercises a particular branch of execution. Maineffect helps you isolate this branch for easier testing.

### Installation

` $ npm install maineffect`

### Quickstart

Let us dive right in with some examples.

#### Example #1

**Parse** the file (Do not require or import). **Find** the function you want to test by name and **CallWith** the test arguments.

##### Calculator.js

	const logger = import('Logger')
	const sum = (a,b) => a + b

##### Calculator.test.js

	const {parseFn} = import 'maineffect'
	const parsed = parseFn(`${__dirname}/calculator.js`)

	describe('sum()', () => {
		it('should return the sum of two numbers', () => {
			let { result } = parsed.find('sum').callWith(1, 2)
			expect(result).to.equal(3)
		})
	})

#### Explanation
Here, we wanted to test the **sum** function of **Calculator.js**. Generally we import the file into our test and call **sum**. Instead we parsed the raw file, and found the **sum** function and called it with the arguments.

- We never had to import **Logger**. This let's us test files ignoring it's dependencies. *Awesome!*
- We did not even care if **sum** was exported. *What?*
- And we still tested the function. *Black Magic*

#### How it works
We simply parse the raw text of the js file to get the [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree "AST"). In that we **find** the node with name **sum**. Then we generate code with that node. We test this code that we generated, not the original file.

##### Example #2
**Provide** a variable with any value. **Fold** stuff you don't care about. **Destroy** function calls that are useless for the test.

##### Casino.js

	import log from 'Logger'
	import fetch from './fetcher'
	import randomizer from 'randomizer'

	const handler = async (req, res) => {
		log.info('Inside handler')
		const dealerName = await fetch('/dealer')
		let message = `Hello ${req.query.user}. I am ${dealerName}. Your lucky number is ${randomizer()}`
		return res.send(message)
	}

export default handler

##### Casino.test.js

	import { expect } from 'chai'
	import { stub } from 'sinon'
	import { parseFn } from '../src/maineffect'

	const parsed = parseFn(`${__dirname}/../src/examples/handler.js`)

	describe('handler()', () => {
		const handler = parsed.find('handler')
		it('should return undefined', async () => {
			const sendStub = stub()
			const result = await handler
									.destroy('log')
									.fold('dealerName', 'Joe')
									.provide('randomizer', () => 1)
									.callWith({
										query: {
											user: 'James'
										}
									}, {send: sendStub})
									.result
			const expected = `Hello James. I am Joe. Your lucky number is 1`
			expect(sendStub.calledWithExactly(expected)).to.equal(true)
		})
	})

#### Explanation
Here, we want to test the **handler** function of **Casino.js**. The function takes **request** and **response** objects as arguments. Logs something, fetches a name asynchronously, gets a random number and assembles a message. Finally, it writes this message to the response.

- Instead of stubbing **log.info**, we **destroy** that call. *Boom!*
- All we care about is the value of **dealerName**. We are not here to test fetch. So let us **fold** the right-hand-side of that assignment to a value we like. *Wait you could do that?*
- Finally we need a randomizer function. Let us **provide** it to the execution environment. *This is cheating.*
- And we still tested the function. *Voodoo shit.*

## Development
### Build
npx webpack --config webpack.config.js

### Test
yarn run test

### Test in Developer mode
yarn run test-dev

## Contact
Reach out to me at @buzzarvind on Twitter for anything. I'll do my best to help out.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2019-2019 Arvind Naidu [https://twitter.com/buzzarvind](https://twitter.com/buzzarvind)
