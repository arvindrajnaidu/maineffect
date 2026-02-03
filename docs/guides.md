---
layout: default
title: Guides
---

[Home](./) | [Getting Started](./getting-started) | [How It Works](./how-it-works) | [API Reference](./api-reference) | [Guides](./guides) | [Examples](./examples) | [Why Maineffect?](./why-maineffect)

---

# Guides

## Testing React class components

Parse the file with `React` in the sandbox, then use `.getFn()` to extract the component for rendering.

```js
// Greeting.js
import React, { Component } from 'react'

class Greeting extends Component {
  render() {
    return <h1>{`Hello ${this.props.name}`}</h1>
  }
}
```

```js
// Greeting.test.js
import { parseFn } from 'maineffectjs'
import React, { Component } from 'react'
import { render, screen } from '@testing-library/react'

const parsed = parseFn(require.resolve('./Greeting'), {
  React,
  Component,
})

it('should render the greeting', () => {
  const Greeting = parsed.find('Greeting').getFn()
  render(<Greeting name="World" />)
  expect(screen.getByText('Hello World')).toBeTruthy()
})
```

## Testing React hooks components

Same approach — provide `React` and any hooks in the sandbox:

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

const parsed = parseFn(require.resolve('./GreetingWithHooks'), {
  React,
  useState,
})

it('should render and handle events', () => {
  const Greeting = parsed.find('Greeting').getFn()
  const { getByTestId } = render(<Greeting greet="FOO" />)
  fireEvent.click(getByTestId('greet'))
  expect(screen.getByText('Hello FOO the great')).toBeTruthy()
})
```

## Testing custom hooks

Custom hooks like `useStaleRefresh` can be tested by providing mock implementations of React hooks:

```js
// useStaleRefresh.js
import { useState, useEffect } from 'react'
const CACHE = {}

function useStaleRefresh(url, defaultValue) {
  const [data, setData] = useState(defaultValue)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const cacheID = url
    if (CACHE[cacheID] !== undefined) {
      setData(CACHE[cacheID])
      setLoading(false)
    } else {
      setLoading(true)
      setData(defaultValue)
    }
    fetch(url)
      .then((newData) => {
        CACHE[cacheID] = newData
        setData(newData)
        setLoading(false)
      })
  }, [url, defaultValue])

  return [data, isLoading]
}
```

Test the hook's initial state by providing simple mock hooks:

```js
import { parseFn, Stubs } from 'maineffectjs'

const parsed = parseFn(require.resolve('./useStaleRefresh'))

test('should return default state on first call', () => {
  const result = parsed
    .find('useStaleRefresh')
    .provide({
      useState: (...args) => [...args],
      useEffect: jest.fn(),
    })
    .callWith('foo', 'bar')
  expect(result).toEqual(['bar', true])
})
```

Test the `useEffect` callback independently using `.findCallback()`:

```js
test('should use cache if URL is cached', () => {
  const stub = Stubs(jest.fn)
  parsed
    .findCallback('useEffect', 0)
    .provide({
      CACHE: { foo: 'fooData' },
      url: 'foo',
      defaultValue: 'bar',
    })
    .stub('setLoading()', stub.createStub)
    .stub('setData()', stub.createStub)
    .stub('fetch().then().then()', stub.createStub)
    .callWith()

  expect(stub.getStubs().setLoading).toBeCalledWith(false)
  expect(stub.getStubs().setData).toBeCalledWith('fooData')
})
```

## Deep stub chains

When your code uses deeply chained calls, describe the full path as a dot-separated string. Keys ending with `()` become stub functions; everything else becomes a nested object:

```js
// All properties, function at the end
.stub('logger.stream.foo.bar.info()', stubs.createStub)

// All functions
.stub('logger().info().debug()', stubs.createStub)

// Mixed properties and functions
.stub('logger.info().severe.armageddon()', stubs.createStub)

// Chained promise-like calls
.stub('fetch().then().then()', stubs.createStub)
```

After stubbing, use `stubs.getStubs()` to get a map of all the leaf stubs for assertions:

```js
const stubs = Stubs(jest.fn)
parsed.find('fn')
  .stub('logger.stream.foo.bar.info()', stubs.createStub)
  .callWith()

expect(stubs.getStubs().info).toBeCalledWith('adding')
```

## Annotations for anonymous functions

Give names to anonymous functions with a comment annotation:

```js
// routes.js
import routes from 'routes'

const get = routes({
  method: 'GET',
  handler: /*name:vHandler*/() => {
    return 1
  }
})
```

```js
// routes.test.js
import { parseFn } from 'maineffectjs'

const parsed = parseFn(require.resolve('./routes'), { routes: () => {} })

it('should find annotated function', async () => {
  const result = await parsed.find('vHandler').callWith()
  expect(result).toBe(1)
})
```

The `/*name:identifier*/` comment immediately before a function expression tells Maineffect to treat it as a named function.

## Express / member expression callbacks with `findCallback`

Use `.findCallback()` to extract callbacks passed to member expressions like `app.get()` or `app.post()`:

```js
// routes.js
import app from 'express'

app.get('/hello', (req, res) => {
  res.send(`Hello ${req.params.name}`)
})

app.post('/items', (req, res) => {
  res.json({ created: true, body: req.body })
})
```

```js
// routes.test.js
import { parseFn } from 'maineffectjs'

const parsed = parseFn(require.resolve('./routes'), {
  app: { get: jest.fn(), post: jest.fn() },
})

it('should test the GET handler', () => {
  const sendStub = jest.fn()
  parsed
    .findCallback('app.get', 1)
    .callWith({ params: { name: 'World' } }, { send: sendStub })
  expect(sendStub).toBeCalledWith('Hello World')
})

it('should test the POST handler', () => {
  const jsonStub = jest.fn()
  parsed
    .findCallback('app.post', 1)
    .callWith({ body: { item: 'test' } }, { json: jsonStub })
  expect(jsonStub).toBeCalledWith({ created: true, body: { item: 'test' } })
})
```

The second argument to `findCallback` is the zero-based argument index — `1` means "the second argument passed to that call".

## TypeScript

Maineffect supports TypeScript files natively. Parse `.ts` or `.tsx` files the same way:

```ts
// useAccount.ts
import { useQuery, UseQueryResult } from 'react-query'
import { fetch } from 'src/app/services'
import { Account } from '../types'

export const useAccount = <T extends Account = Account>(
  accountId: string,
): UseQueryResult<T, Error> => {
  return useQuery<T, Error>(
    ['accounts', accountId],
    async () => {
      const endpoint = new URL(`/api/accounts/${accountId}`, window.location.origin).href
      const resp = await fetch(endpoint)
      const body = (await resp.json()) as { account: Account } | Account
      if ((body as { account: Account })?.account) {
        return (body as { account: Account })?.account as T
      }
      return body as T
    },
    { enabled: !!accountId && accountId.length > 0 },
  )
}
```

```ts
// useAccount.test.ts
import { parseFn, Stubs } from 'maineffectjs'

const mockedUseQuery = jest.fn()
const parsed = parseFn(require.resolve('./useAccount'), {
  useQuery: mockedUseQuery,
})

test('should call useQuery with correct parameters', () => {
  const stub = Stubs(jest.fn)
  parsed
    .find('useAccount')
    .stub('URL()', stub.createStub)
    .stub('fetch().json()', stub.createStub)
    .callWith('foo')
  expect(mockedUseQuery).toBeCalled()
})
```

All TypeScript type annotations are stripped during parsing — only the runtime code is executed.

## Nested functions

Maineffect can find functions defined inside other functions:

```js
// partner.js
function Conversation() {
  const replyTo = () => {
    return 2
  }
  return { replyTo }
}
```

```js
// partner.test.js
import { parseFn } from 'maineffectjs'

const parsed = parseFn(require.resolve('./partner'))

it('should call the outer function', () => {
  parsed.find('Conversation').callWith()
})

it('should call the inner function directly', () => {
  const result = parsed.find('replyTo').callWith(1)
  // replyTo is found even though it's nested inside Conversation
})
```

## Using `this` context with `.apply()`

When a function uses `this`, provide the context with `.apply()`:

```js
// this.js
export const foo = {
  a: 1,
  getA: function () {
    return this.a
  }
}
```

```js
// this.test.js
import { parseFn } from 'maineffectjs'

const parsed = parseFn(require.resolve('./this'))

it('should return value of a', () => {
  const result = parsed.find('getA').apply({ a: 1 })
  expect(result).to.equal(1)
})
```

## Using `parseFnStr` for inline source

When you want to test code defined as a string rather than in a file:

```js
import { parseFnStr } from 'maineffectjs'

const parsed = parseFnStr('/virtual/path.js', `
  export const sumAsync = async (a, b) => {
    const result = await new Promise((resolve) => {
      setTimeout(() => resolve(a + b), 0)
    })
    return result
  }
`)

it('should return the sum', async () => {
  const result = await parsed.find('sumAsync').callWith(51, 82)
  expect(result).to.equal(133)
})
```

The first argument is a virtual file path used for error messages — it doesn't need to point to an actual file.

## Cross-function provide

You can extract one function and provide it to another using `.getFn()`:

```js
// modules.js
import util from 'util'
import fs from 'fs'
import log from './logger'

const foo = () => {
  return 'foo'
}

export const show = (obj) => {
  util.inspect(obj)
  return foo()
}
```

```js
// modules.test.js
import util from 'util'
import { parseFn } from 'maineffectjs'

const parsed = parseFn(require.resolve('./modules'))

it('should provide a private function to another', () => {
  const result = parsed
    .find('show')
    .provide({ util, foo: parsed.find('foo').getFn() })
    .callWith({ foo: 'bar' })
  expect(result).toBe('foo')
})
```

This extracts the private `foo` function and injects it into `show` as a dependency — without `foo` ever being exported.

## Providing globals

You can provide values for global references like `process`, `Math`, or `console`:

```js
// Provide process.env
const parsed = parseFn(require.resolve('./myModule')).provide('process', {
  env: { NODE_ENV: 'production' },
})

// Provide Math with deterministic random
parsed.find('handler')
  .provide('Math', { random: () => 0.5 })
  .callWith()
```

## Using `.reset()` for test isolation

Call `.reset()` in `beforeEach` to clear all injected dependencies between tests:

```js
const parsed = parseFn(require.resolve('./my-module'))

beforeEach(() => {
  parsed.reset()
})
```

This ensures each test starts with a clean slate.
