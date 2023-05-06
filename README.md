# Maineffect
## Reflection based testing for Javascript

Maineffect enables you to write tests faster by helping you easily isolate the test execution path. It does so by using staticially analyzing the code and isolating the function under test. This enables one to ignore required modules and their dependencies. 

Maineffect "parses" the module under test into it's [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) representation. From there on it lets one traverse the AST to **find** functions they intend to test.

### Demo

[Watch the video](https://www.youtube.com/playlist?list=PLvTEsBHbZnNGwLD3Uy5YEBaKv417-tJGH)

### Installation

	$ npm install maineffectjs


### Example #1

**Parse/Load** the file (Do not require or import). **Find** the function you want to test by name and **callWith** arguments.

>math.js

	import log from 'logger'
	
	const add = (a,b) => a + b

>math.test.js

	import { parseFn } from '../maineffect'
	const math = parseFn(require.resolve('./math'))

	describe('add', () => {
		it('should return 2 when called with 1, 1', () => {
			const { result } = math.find('add').callWith(1, 1);
			expect(result).to.equal(2);
		})
	})


>Here, we wanted to test the **add** function of **math.js**. Generally we import the file into our test and call **add**. However with Maineffect, we parse the raw file, and find the **add** function. Just like finding a `div` element in the DOM. We then call it with our arguments.

#### Advantages

- We can now test private functions. In math.js above we did not even export add.
- We dot care about dependencies in the test. Like above, we don't even have a ``logger`` module installed.

### Example #2
**Provide** a variable with any value. **Fold** stuff you don't care about.

>taxes.js

	import log from 'Logger'
	import getTaxeRate from 'irs'

	const getAmountAfterTaxes = async (amount) => {
	  log('Inside getTaxes')
	  const taxRate = await getTaxeRate()
	  return amount - amount * taxRate
	}

>taxes.test.js

	import { expect } from 'chai'
	import { parseFn } from '../src/maineffect'
  
	const taxes = parseFn(require.resolve('./taxes'))

	describe('getAmountAfterTaxes', () => {
	    it('should return 50 when called with 100 and a rate of 0.5', async () => {
          	const { result } = taxes.find('getAmountAfterTaxes')
                            .provide('log', () => {})					
                            .fold('taxRate', 0.5)
                            .callWith(100)
          	expect(await result).to.equal(50)
	    })
	})

>Here, we want to test the **getAmountAfterTaxes** function of **taxes.js**. Once we ``find`` the function, we ``provide`` **log** as an empty function (stubs also work here). Then we ``fold`` the **taxRate** constant to the value **0.5** and call the function.

#### Advantages

- All we care about is the value of **taxRate**. We are not here to test getTaxeRate. So we **fold** the right-hand-side of that assignment to a value we like.
- We can mock dependencies like **log**

### Example #3
**Stubs** provide a fast way to stub out chained function calls.

>greet.js

	const getGreeting = async () => {
	  const greet = greeter.man('Joe').good().greeting();
	  return greet;
	};

>greet.test.js

	import { parseFn, Stubs } from '../src/maineffect';
  
	const hello = parseFn(require.resolve('./hello'));

	describe('getGreeting', () => {
	    it('should call man when greeting', async () => {
			const stubs = Stubs(jest.fn);
          	hello.find('getGreeting')
                            .stub('greeter.man().good().greeting()', stubs.createStub)
                            .callWith();
          	expect(stubs.getStubs().man).toBeCalledWith("Joe");
	    });
	});

>Here, we want to test a side-effect. We want to make sure the function ```man``` is called with ```"Joe"```. Instead of stubbing the value with an object that looks like the one below ..

	{
		greeter: {
			man: jest.fn().mockReturnValue({
					good: jest.fn().mockReturnValue({
						greeting: jest.fn()
					})
				})
		} 
	}

We can simply simply say this instead ..

	.stub('greeter.man().good().greeting()', stubs.createStub)
	
>Here the stub function take two arguments, a stub-keys and stub creator function. The stub-keys is simply a string that tells maineffectjs what keys should be stubbed with either an object or a stub. If you want a stub, make sure the key ends with a ```"()"```. The second parameter is a stub creator. This is wrapper for a Sinon ```(sinon.stub)``` or Jest ```(jest.fn)``` implementation of mock functions.

#### Advantages

- Provide stubs to your tests faster and easier.
- No need to reconstruct the entire fixture in the test and reset.

## Contributions

### Build

	npx webpack --config webpack.config.js

### Test

	npm run test

## Contact

Reach out to me at @buzzarvind on Twitter for anything. I'll do my best to help out.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2019-2024 Arvind Naidu [https://twitter.com/buzzarvind](https://twitter.com/buzzarvind)
