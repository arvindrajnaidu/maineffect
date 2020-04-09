# Maineffect - [Beta]
## Testing so bold, it does not require anything.

Maineffect enables you to write tests faster by helping you easily isolate the test execution path. Instead of requiring modules and their dependencies, Maineffect "parses" the module to test into it's [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) representation.

From there on it one can traverse the tree to **find** functions they intend to test. Private functions, class methods and just about anything can be tested this way.

### Warning
This is not production ready at this point. Will be releasing a more stable version depending on feedback.

### Demo

https://www.youtube.com/playlist?list=PLvTEsBHbZnNGwLD3Uy5YEBaKv417-tJGH  

### Installation

`$ npm install maineffect`


### Quickstart

Let us dive right in with some examples.

#### Example #1

**Parse** the file (Do not require or import). **Find** the function you want to test by name and **CallWith** the test arguments.

##### math.js

	import log from 'logger'
	
	const add = (a,b) => a + b

##### math.test.js

	const {load} = import 'maineffect'
	const math = load(require.resolve('./math'))

	describe ('math', () => {
	  describe('add', () => {
	    it('should return 2 when called with 1, 1', () => {
		const {result} = math.find('add').callWith(1, 1)
		expect(result).to.equal(2)
	    })
	  })
	})

#### Explanation
Here, we wanted to test the **add** function of **math.js**. Generally we import the file into our test and call **sum**. However with Maineffect, we parse the raw file, and find the **add** function. Just like finding a `div` element in the DOM. We then call it with our arguments.

#### Advantages

- We can now test private functions. In math.js above we did not export add.
- We dot care about dependencies in the test. Like above, we don't even have a ``logger`` module installed.

#### How it works
We simply parse the raw math.js file to get the [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree "AST"). In that we **find** the node with name **add**. Then we generate code with that node. We test this code that we generated, not the original file.

#### Example #2
**Provide** a variable with any value. **Fold** stuff you don't care about.

##### taxes.js

	import log from 'Logger'
	import getTaxeRate from 'irs'

	const getAmountAfterTaxes = async (amount) => {
	  log('Inside getTaxes')
	  const taxRate = await getTaxeRate()
	  return amount - amount * taxRate
	}

##### taxes.test.js

	import { expect } from 'chai'
	import { load } from '../src/maineffect'
  
	const taxes = load(require.resolve('./taxes'))

	describe ('taxes', () => {
	  describe('getTaxes', () => {
	    it('should return 50 when called with 100 and a rate of 0.5', async () => {
          const {result} = taxes.find('getAmountAfterTaxes')
                            .provide('log', () => {})					
                            .fold('taxRate', 0.5)
                            .callWith(100)
          expect(await result).to.equal(50)
	    })
	  })
	})

#### Explanation
Here, we want to test the **getAmountAfterTaxes** function of **taxes.js**. Once we ``find`` the function, we ``provide`` log as an empty function (stubs also work here). Then we ``fold`` the **taxRate** constant to the value **0.5** and call the function.

#### Advantages
- All we care about is the value of **taxRate**. We are not here to test getTaxeRate. So we **fold** the right-hand-side of that assignment to a value we like.
- We can mock dependencies like **log**


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
