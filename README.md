# Maineffect

![Tests](https://github.com/arvindrajnaidu/maineffect/actions/workflows/ci.yml/badge.svg)
![npm](https://img.shields.io/npm/v/maineffectjs)

**Unit test any JavaScript function with zero dependencies installed.**

Maineffect is a testing library that isolates functions from their dependencies at the source level. It parses your code into an [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree), strips all imports, and lets you inject only what you need. The function under test runs in a sandbox — no module resolution, no dependency installation, no complex mocking setup.

This means you can test code that depends on databases, APIs, loggers, or any external module **without installing any of them**.

## Why not just use Jest mocking?

Jest's mocking model is powerful but complex. Developers frequently struggle with:

- `jest.mock()` vs `jest.fn()` vs `jest.spyOn()` — three overlapping mechanisms with different behaviors
- Invisible hoisting — `jest.mock()` is silently moved above imports, leading to confusing execution order
- Factory functions, `__mocks__` directories, `mockImplementation` vs `mockReturnValue` — layers of API
- Partial mocking with `jest.requireActual()` — a workaround that reveals the awkwardness
- ES modules vs CommonJS — mocking behaves differently depending on module system

The result: developers litter tests with `console.log` statements just to verify their mocks are working. The tool hasn't made the state of things obvious.

**Maineffect's model is flat.** Imports don't exist. You provide what the function needs. You call it. There's nothing hidden, no hoisting, no module resolution to reason about. A beginner can understand it in minutes.

## How it works

1. **Parse** — Maineffect reads your source file and converts it to an AST using Babel
2. **Strip** — All `import` and `require` statements are removed
3. **Find** — You locate the function you want to test by name
4. **Provide** — You inject mock values for any dependencies the function uses
5. **Call** — The function executes in an isolated sandbox and returns the result

This is the same AST parse/transform/generate pipeline that Babel, TypeScript, and Webpack already use in every modern JavaScript project. Maineffect simply adds one transform: removing imports.

And since unit tests should not be concerned with side effects, stripping imports isn't a compromise — it's doing exactly what a unit test should do.

## Installation

```
npm install maineffectjs
```

## Quick start

### Parse, find, call

**Parse** the file (don't require or import it). **Find** the function by name. **Call** it with arguments.

```js
// math.js
import log from 'logger'

const add = (a, b) => a + b
```

```js
// math.test.js
import { parseFn } from 'maineffectjs'

const math = parseFn(require.resolve('./math'))

describe('add', () => {
  it('should return the sum of two numbers', () => {
    const result = math.find('add').callWith(51, 82)
    expect(result).to.equal(133)
  })
})
```

Notice: `add` is not exported. The `logger` module is not installed. The test works anyway.

### Inject dependencies with `provide`

When a function uses an external dependency, supply it with `provide`.

```js
// side-effects.js
import { request } from 'http'

const generateFooService = async () => {
  const word = await request('/foo')
  return word
}
```

```js
// side-effects.test.js
import { parseFn } from 'maineffectjs'

const parsed = parseFn(require.resolve('./side-effects'))

it('should return a word using a service', async () => {
  const result = await parsed
    .find('generateFooService')
    .provide('request', () => 'foo')
    .callWith()
  expect(result).to.equal('foo')
})
```

No `http` module needed. No `jest.mock()`. Just provide the value and call the function.

### Stub chained calls

Real code often has deeply chained calls like `logger.stream.foo.bar.info()`. With Jest, you'd write:

```js
{
  logger: {
    stream: {
      foo: {
        bar: {
          info: jest.fn().mockReturnValue(...)
        }
      }
    }
  }
}
```

With Maineffect, describe the chain as a string:

```js
// stubs.js
import logger from 'logger'

const one = () => {
  logger.stream.foo.bar.info('adding')
  return 1
}
```

```js
// stubs.test.js
import { parseFn, Stubs } from 'maineffectjs'

const parsed = parseFn(require.resolve('./stubs'))

test('should handle chain of objects', () => {
  const stubs = Stubs(jest.fn)
  parsed
    .find('one')
    .stub('logger.stream.foo.bar.info()', stubs.createStub)
    .callWith()
  expect(stubs.getStubs().info).toBeCalledWith('adding')
})
```

Keys ending with `()` become stub functions. Everything else becomes a plain object. Works with any mix of properties and function calls:

```js
.stub('logger().info().debug()', stubs.createStub)       // all functions
.stub('logger.info().severe.armageddon()', stubs.createStub) // mixed
```

### Test anonymous functions

Give names to anonymous functions with a comment annotation, then find them like any other function.

```js
// annotations.js
import routes from 'routes'

const get = routes({
  method: 'GET',
  handler: /*name:vHandler*/() => {
    return 1
  }
})
```

```js
// annotations.test.js
import { parseFn } from 'maineffectjs'

const parsed = parseFn(require.resolve('./annotations'), { routes: () => {} })

it('should find annotated fn', async () => {
  const result = await parsed.find('vHandler').callWith()
  expect(result).toBe(1)
})
```

### Test React components

Extract components with `getFn()` and render them with your preferred testing library.

```js
// GreetingWithHooks.js
import React, { useState } from 'react'

const Greeting = ({ greet }) => {
  const [name, setName] = useState(greet)
  return (
    <>
      <h1>{`Hello ${name}`}</h1>
      <button data-testid="greet" onClick={() => setName(`${name} the great`)} />
    </>
  )
}
```

```js
// GreetingWithHooks.test.js
import { parseFn } from 'maineffectjs'
import React, { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

const parsed = parseFn(require.resolve('./GreetingWithHooks.js'), {
  React,
  useState,
})

it('should render', () => {
  const Greeting = parsed.find('Greeting').getFn()
  const { getByTestId } = render(<Greeting greet="FOO" />)
  fireEvent.click(getByTestId('greet'))
  expect(screen.getByText('Hello FOO the great')).to.be.ok
})
```

## API

### `parseFn(filePath, sandbox?, options?)`

Parse a source file. Returns a chainable `CodeFragment` object.

Aliases: `load`, `parse`

### `parseFnStr(filePath, sourceString, sandbox?, options?)`

Parse a source string instead of a file.

### CodeFragment methods

| Method | Description |
|--------|-------------|
| `.find(name)` | Locate a function by name |
| `.findCallback(name, index)` | Extract a callback from a call expression |
| `.provide(key, value)` | Inject a dependency by name |
| `.provide({ key: value, ... })` | Inject multiple dependencies |
| `.inject(key, value)` | Alias for `provide` |
| `.stub(path, stubCreator)` | Generate nested stubs from a dot-path string |
| `.callWith(...args)` | Execute the function with arguments |
| `.apply(thisArg, ...args)` | Execute with a specific `this` context |
| `.getFn()` | Return the function without executing it |
| `.source()` | Return the generated source code |
| `.print()` | Print the generated source code |
| `.reset()` | Clear all injected dependencies |
| `.getProvisions()` | Return all currently injected values |
| `.getAST()` | Return the raw AST |
| `.getSandbox()` | Return the sandbox object |

### `Stubs(stubImplementation)`

Factory for creating stubs. Pass `jest.fn` or `sinon.stub`.

Returns `{ createStub, getStubs }` — use `createStub` with `.stub()` and `getStubs()` to access the generated mocks for assertions.

## Works everywhere

Maineffect ships two builds:

- **Node.js** — executes in a `vm` sandbox
- **Browser** — executes via `eval()`

Because dependencies are stripped at the AST level, there is no module system to hook into. Tests can run in a browser with no bundler, no `node_modules`, no build pipeline.

## Supports

- JavaScript and TypeScript
- Async/await and Promises
- Function declarations, expressions, and arrow functions
- Class methods and React lifecycle methods
- React hooks and functional components
- Jest, Mocha/Chai, and Sinon

## Demo

[Watch the video](https://www.youtube.com/playlist?list=PLvTEsBHbZnNGwLD3Uy5YEBaKv417-tJGH)

## Build

```
npx webpack --config webpack.config.js
```

## Test

```
npm run test
```

## Contributions

The core library is ~570 lines. Feel free to send a PR with any feature you think would be useful.

## Contact

Reach out to me at @buzzarvind on Twitter.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2019-2024 Arvind Naidu [https://twitter.com/buzzarvind](https://twitter.com/buzzarvind)
