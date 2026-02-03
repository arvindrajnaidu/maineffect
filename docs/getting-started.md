---
layout: default
title: Getting Started
---

[Home](./) | [Getting Started](./getting-started) | [How It Works](./how-it-works) | [API Reference](./api-reference) | [Guides](./guides) | [Examples](./examples) | [Why Maineffect?](./why-maineffect)

---

# Getting Started

## Installation

```
npm install maineffectjs
```

Maineffect works with Jest, Mocha/Chai, or any other test runner. No additional configuration is needed.

## Walkthrough 1: Basic function testing

Start with a simple source file:

```js
// basic.js
export const sum = (a, b) => a + b

export const sumAsync = async (a, b) => {
  const result = await new Promise((resolve) => {
    setTimeout(() => resolve(a + b), 0)
  })
  return result
}

function simpleFunction() {
  return true
}
```

Test it without importing or exporting anything:

```js
// basic.test.js
import { parseFn } from 'maineffectjs'

const parsed = parseFn(require.resolve('./basic'))

describe('basic', () => {
  it('should return the sum of two numbers', () => {
    const result = parsed.find('sum').callWith(51, 82)
    expect(result).to.equal(133)
  })

  it('should handle async functions', async () => {
    const result = await parsed.find('sumAsync').callWith(51, 82)
    expect(result).to.equal(133)
  })

  it('should find function declarations', () => {
    const result = parsed.find('simpleFunction').callWith()
    expect(result).to.equal(true)
  })
})
```

Key points:
- `parseFn()` reads the file and parses it into an AST. It does **not** execute or import the file.
- `.find('sum')` locates the function by name — it doesn't need to be exported.
- `.callWith(51, 82)` runs the function in an isolated sandbox.

## Walkthrough 2: Injecting dependencies with `.provide()`

When a function uses an external dependency, supply it with `.provide()`:

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

## Walkthrough 3: Stubbing chained calls

Real code often has deeply chained calls like `logger.stream.foo.bar.info()`. With Maineffect, describe the chain as a string:

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

Keys ending with `()` become stub functions. Everything else becomes a plain object.

## Next steps

- [How It Works](./how-it-works) — understand the AST pipeline
- [API Reference](./api-reference) — full method documentation
- [Guides](./guides) — React, TypeScript, annotations, and more
- [Examples](./examples) — browse all example pairs
