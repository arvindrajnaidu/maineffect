---
layout: default
title: Examples
---

[Home](./) | [Getting Started](./getting-started) | [How It Works](./how-it-works) | [API Reference](./api-reference) | [Guides](./guides) | [Examples](./examples) | [Why Maineffect?](./why-maineffect)

---

# Examples

All examples are in the [`src/examples/`](https://github.com/arvindrajnaidu/maineffect/tree/master/src/examples) directory of the repository. Each example has a source file and a corresponding test file.

## Example catalog

| Example | Source | Test | What it demonstrates |
|---------|--------|------|----------------------|
| **Basic** | `basic/basic.js` | `basic/basic.test.js` | Sum, async, spread, function declarations, error throwing |
| **Async** | `asyncFn.js` | `asyncFn.test.js` | Async/await with Promises |
| **Side Effects** | `side-effects.js` | `side-effects.test.js` | Injecting dependencies with `.provide()` |
| **Stubs** | `stubs.js` | `stubs.test.js` | Deep stub chains with `Stubs()` |
| **Annotations** | `annotations.js` | `annotations.test.js` | `/*name:id*/` comment annotations for anonymous functions |
| **React Class** | `Greeting.js` | `Greeting.test.js` | React class component with `.getFn()` |
| **React Hooks** | `GreetingWithHooks.js` | `GreetingWithHooks.test.js` | React hooks component with `useState` |
| **Custom Hook** | `useStaleRefresh.js` | `useStaleRefresh.test.js` | Custom hook testing with `findCallback` and stubs |
| **Calculator** | `calculator.js` | `calculator.test.js` | Object method discovery with nested `.find()` |
| **Casino** | `casino.js` | `casino.test.js` | Multiple provides including globals (`Math`, `log`) |
| **Modules** | `modules.js` | `modules.test.js` | Cross-function provide with `.getFn()`, removed imports |
| **Nested Functions** | `partner.js` | `partner.test.js` | Finding functions defined inside other functions |
| **This Context** | `this.js` | `this.test.js` | Using `.apply()` for `this` context |
| **String Input** | — | `stringInput.test.js` | `parseFnStr` for inline source strings |
| **API Gateway** | `apigwSimulator.js` | `apigwSimulator.test.js` | Nested function testing, process.env injection |
| **Clashes** | `clashes.js` | `clashes.test.js` | Destructured variable provide |
| **Function Expression** | `fnExpression.js` | `fnExpression.test.js` | Named, anonymous, and variable-assigned function expressions |
| **Class Expression** | `classExpression.js` | `classExpression.test.js` | Class expressions assigned to variables |
| **Member Callbacks** | `memberCallback.js` | `memberCallback.test.js` | `findCallback` with `app.get()` / `app.post()` member expressions |
| **TypeScript** | `typescript/useAccounts.ts` | `typescript/useAccounts.test.ts` | TypeScript with generics, `react-query` |

---

## Basic

Sum, async, spread, error throwing, and function declarations.

**Source (`basic/basic.js`):**

```js
export const sum = (a, b) => a + b

export const sumAsync = async (a, b) => {
  const result = await new Promise((resolve) => {
    setTimeout(() => resolve(a + b), 0)
  })
  return result
}

export const pitcher = message => {
  throw new Error(message)
}

export const copyUserObject = (user, newName) => {
  const newUser = {...user}
  newUser.name = newName
  return newUser
}

function simpleFunction() {
  return true
}
```

**Test (`basic/basic.test.js`):**

```js
import { parseFn } from 'maineffectjs'

const parsed = parseFn(require.resolve('./basic'))

describe('basic', () => {
  it('should return the sum of two numbers', () => {
    const result = parsed.find('sum').callWith(51, 82)
    expect(result).to.equal(133)
  })

  it('should handle async', async () => {
    const result = await parsed.find('sumAsync').callWith(51, 82)
    expect(result).to.equal(133)
  })

  it('should throw an error', () => {
    expect(() => parsed.find('pitcher').callWith('foo')).throws('foo')
  })

  it('should support spread', () => {
    const result = parsed
      .find('copyUserObject')
      .callWith({ name: 'blah', age: 950 }, 'amazon')
    expect(result).to.deep.equal({ name: 'amazon', age: 950 })
  })

  it('should find function declarations', () => {
    const result = parsed.find('simpleFunction').callWith()
    expect(result).to.equal(true)
  })
})
```

---

## Side Effects

Injecting dependencies with `.provide()`.

**Source (`side-effects.js`):**

```js
import { request } from 'http'

const generateFooService = async () => {
  const word = await request('/foo')
  return word
}
```

**Test (`side-effects.test.js`):**

```js
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

---

## Stubs

Deep stub chains with `Stubs()`.

**Source (`stubs.js`):**

```js
import logger from 'logger'

const one = () => {
  logger.stream.foo.bar.info('adding')
  return 1
}
```

**Test (`stubs.test.js`):**

```js
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

---

## Member Callbacks

Testing Express-style route handlers with `findCallback`.

**Source (`memberCallback.js`):**

```js
import app from 'express'

app.get('/hello', (req, res) => {
  res.send(`Hello ${req.params.name}`)
})

app.post('/items', (req, res) => {
  res.json({ created: true, body: req.body })
})
```

**Test (`memberCallback.test.js`):**

```js
import { parseFn } from 'maineffectjs'

const parsed = parseFn(require.resolve('./memberCallback'), {
  app: { get: jest.fn(), post: jest.fn() },
})

it('should find a callback passed to app.get', () => {
  const sendStub = jest.fn()
  parsed
    .findCallback('app.get', 1)
    .callWith({ params: { name: 'World' } }, { send: sendStub })
  expect(sendStub).toBeCalledWith('Hello World')
})

it('should find a callback passed to app.post', () => {
  const jsonStub = jest.fn()
  parsed
    .findCallback('app.post', 1)
    .callWith({ body: { item: 'test' } }, { json: jsonStub })
  expect(jsonStub).toBeCalledWith({ created: true, body: { item: 'test' } })
})
```

---

## API Gateway

Nested function testing with process.env injection.

**Source (`apigwSimulator.js`):**

```js
const apigwSimulator = server => {
  if (process.env.NODE_ENV !== 'development') return
  const onPreHandler = (request, h) => {
    const authToken = request.headers['z-auth-token']
    if (!authToken) return h.continue
    if (!request.headers['z-apigw-role-id'] || !request.headers['z-apigw-cognito-user-id']) {
      const decrypted = jwt.decode(authToken)
      request.headers['z-apigw-cognito-user-id'] = decrypted.sub
      request.headers['z-apigw-role-id'] = decrypted['custom:roleID']
      request.headers['z-apigw-partner-id'] = decrypted['custom:partnerID']
    }
    return h.continue
  }
  server.ext('onPreHandler', onPreHandler)
}
```

**Test (`apigwSimulator.test.js`):**

```js
import { parseFn } from 'maineffectjs'

const prod = parseFn(require.resolve('./apigwSimulator')).provide('process', {
  env: { NODE_ENV: 'production' },
})
const dev = parseFn(require.resolve('./apigwSimulator')).provide('process', {
  env: { NODE_ENV: 'development' },
})

it('should not call ext in production', () => {
  const extStub = jest.fn()
  prod.find('apigwSimulator').callWith({ ext: extStub })
  expect(extStub).toBeCalledTimes(0)
})

it('should call ext in development', () => {
  const extStub = jest.fn()
  dev.find('apigwSimulator').callWith({ ext: extStub })
  expect(extStub).toBeCalled()
})

it('should set headers when z-auth-token is present', () => {
  const headers = { 'z-auth-token': 'token' }
  dev
    .find('onPreHandler')
    .provide('jwt', {
      decode: () => ({
        'custom:roleID': 'foo',
        sub: 'bar',
        'custom:partnerID': 'foobar',
      }),
    })
    .callWith({ headers }, { continue: jest.fn() })
  expect(headers['z-apigw-cognito-user-id']).toEqual('bar')
  expect(headers['z-apigw-role-id']).toEqual('foo')
})
```

---

## Casino

Multiple provides including globals.

**Source (`casino.js`):**

```js
import Logger from 'util'
import { request } from 'https'

export const handler = async (req, res) => {
  log.info('Inside handler')
  const myName = await request('/name/me')
  let message = `Hello ${req.query.user}. I am ${myName}. Your lucky number is ${Math.random()}`
  return res.send(message)
}
```

**Test (`casino.test.js`):**

```js
import { parseFn } from 'maineffectjs'

const parsed = parseFn(require.resolve('./casino'), {
  request: () => 'Joe',
})

it('should inject multiple deps including globals', async () => {
  const sendStub = jest.fn()
  await parsed.find('handler')
    .provide('log', { info: () => {} })
    .inject('Math', { random: () => 1 })
    .callWith({ query: { user: 'James' } }, { send: sendStub })
  expect(sendStub).toBeCalledWith(
    'Hello James. I am Joe. Your lucky number is 1'
  )
})
```

---

## String Input

`parseFnStr` for inline source strings.

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
