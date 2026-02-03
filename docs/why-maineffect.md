---
layout: default
title: Why Maineffect?
---

[Home](./) | [Getting Started](./getting-started) | [How It Works](./how-it-works) | [API Reference](./api-reference) | [Guides](./guides) | [Examples](./examples) | [Why Maineffect?](./why-maineffect)

---

# Why Maineffect?

## Problems with Jest mocking

Jest's mocking model is powerful but complex. Developers frequently struggle with:

- **`jest.mock()` vs `jest.fn()` vs `jest.spyOn()`** — three overlapping mechanisms with different behaviors
- **Invisible hoisting** — `jest.mock()` is silently moved above imports, leading to confusing execution order
- **Factory functions, `__mocks__` directories, `mockImplementation` vs `mockReturnValue`** — layers of API surface
- **Partial mocking with `jest.requireActual()`** — a workaround that reveals the awkwardness
- **ES modules vs CommonJS** — mocking behaves differently depending on module system

The result: developers litter tests with `console.log` statements just to verify their mocks are working. The tool hasn't made the state of things obvious.

## Side-by-side comparison

### The function under test

```js
// userService.js
import { db } from './database'
import { logger } from './logger'

export const getUser = async (id) => {
  logger.info(`Fetching user ${id}`)
  const user = await db.query('SELECT * FROM users WHERE id = ?', [id])
  return user
}
```

### Jest approach

```js
// userService.test.js (Jest)
import { getUser } from './userService'
import { db } from './database'
import { logger } from './logger'

// Must be hoisted above imports — invisible reordering
jest.mock('./database')
jest.mock('./logger')

describe('getUser', () => {
  it('should fetch a user', async () => {
    // Configure the mock
    db.query.mockResolvedValue({ id: '1', name: 'Alice' })
    logger.info = jest.fn()

    const user = await getUser('1')

    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE id = ?',
      ['1']
    )
    expect(user).toEqual({ id: '1', name: 'Alice' })
  })
})
```

Things you have to know:
- `jest.mock()` is hoisted above imports automatically
- The `db` import is now a mock object, not the real module
- You need to know whether `db` uses default or named exports
- ES module mocking has additional constraints
- The `./database` and `./logger` modules must be installed (or have `__mocks__` directories)

### Maineffect approach

```js
// userService.test.js (Maineffect)
import { parseFn } from 'maineffectjs'

const parsed = parseFn(require.resolve('./userService'))

describe('getUser', () => {
  it('should fetch a user', async () => {
    const user = await parsed
      .find('getUser')
      .provide('logger', { info: jest.fn() })
      .provide('db', {
        query: () => ({ id: '1', name: 'Alice' })
      })
      .callWith('1')

    expect(user).toEqual({ id: '1', name: 'Alice' })
  })
})
```

Things you need to know:
- `parseFn` reads the file; it doesn't import it
- `.provide()` sets values for stripped identifiers
- `.callWith()` executes the function
- That's it

No hoisting. No module resolution. No `__mocks__` directories. No difference between ESM and CommonJS.

## Maineffect's model is flat

In Jest, mocking operates at the **module** level. You intercept the module system, replace the resolved module with a mock, and then the code under test imports the mock instead of the real thing. This means:

1. You need the module system to cooperate
2. The mock must match the module's export shape
3. Hoisting, factory functions, and timing all matter
4. The real module's code still gets parsed/loaded

In Maineffect, there is no module system. Imports are removed. The function is just code with unresolved references, and you fill in those references. There's nothing hidden, no hoisting, no module resolution to reason about.

A beginner can understand Maineffect in minutes:

```
Parse the file → Find the function → Provide what it needs → Call it
```

## When to use each tool

**Use Jest mocking when:**
- You need integration-level tests that verify module wiring
- You're testing how modules interact with each other
- You need `jest.spyOn()` to observe calls without replacing implementations
- Your project already has a mature Jest mock setup that works

**Use Maineffect when:**
- You want pure unit tests that test functions in isolation
- Your function depends on modules you don't want to install (databases, APIs, loggers)
- You're struggling with Jest mock setup and debugging
- You want tests that work the same way in Node.js and the browser
- You need to test unexported/private functions
- You're testing code with deep dependency chains

The two tools solve different problems. Jest mocking tests how modules wire together. Maineffect tests how functions behave when given specific inputs. Both are valid — choose based on what you're testing.
