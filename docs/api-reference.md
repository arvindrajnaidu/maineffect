---
layout: default
title: API Reference
---

[Home](./) | [Getting Started](./getting-started) | [How It Works](./how-it-works) | [API Reference](./api-reference) | [Guides](./guides) | [Examples](./examples) | [Why Maineffect?](./why-maineffect)

---

# API Reference

## `parseFn(filePath, sandbox?, options?)`

Parse a source file. Returns a chainable `CodeFragment` object.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `filePath` | `string` | Absolute path to the source file. Use `require.resolve('./file')` to get it. |
| `sandbox` | `object` (optional) | Initial values to inject into the sandbox before any `.provide()` calls. Useful for globals needed at parse time (e.g., `React`). |
| `options` | `object` (optional) | Parser options. |

**Returns:** `CodeFragment` — a chainable object for locating and calling functions.

**Aliases:** `load`, `parse`

```js
import { parseFn } from 'maineffectjs'

// Basic usage
const parsed = parseFn(require.resolve('./my-module'))

// With sandbox
const parsed = parseFn(require.resolve('./MyComponent'), {
  React,
  useState,
})

// Using aliases
import { load, parse } from 'maineffectjs'
const parsed = load(require.resolve('./my-module'))
const parsed = parse(require.resolve('./my-module'))
```

## `parseFnStr(filePath, sourceString, sandbox?, options?)`

Parse a source string instead of reading from a file. Useful for testing inline code or dynamically generated source.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `filePath` | `string` | A file path identifier (used for error messages, does not need to exist). |
| `sourceString` | `string` | The source code to parse. |
| `sandbox` | `object` (optional) | Initial values to inject into the sandbox. |
| `options` | `object` (optional) | Parser options. |

**Returns:** `CodeFragment`

```js
import { parseFnStr } from 'maineffectjs'

const parsed = parseFnStr('/virtual/path.js', `
  export const sum = (a, b) => a + b
`)

const result = parsed.find('sum').callWith(1, 2)
// result === 3
```

## CodeFragment methods

### `.find(name)`

Locate a function by name. Searches function declarations, arrow functions, function expressions, class methods, object methods, annotated anonymous functions, and nested functions.

```js
parsed.find('myFunction')
```

Returns a new `CodeFragment` scoped to that function.

### `.findCallback(name, index)`

Extract a callback argument from a call expression. The `name` can be a simple identifier or a member expression (e.g., `'app.get'`).

```js
// For: app.get('/hello', (req, res) => { ... })
parsed.findCallback('app.get', 1)   // gets the 2nd argument (index 1)

// For: describe('test', () => { ... })
parsed.findCallback('describe', 1)
```

### `.provide(key, value)` / `.provide({ key: value, ... })`

Inject a dependency by name. The value replaces any unresolved reference with that name when the function executes.

```js
// Single value
parsed.find('handler').provide('request', () => 'mock')

// Multiple values
parsed.find('handler').provide({
  request: () => 'mock',
  logger: { info: () => {} },
})
```

### `.inject(key, value)`

Alias for `.provide()`.

### `.stub(path, stubCreator)`

Generate nested stubs from a dot-path string. Keys ending with `()` become stub functions; everything else becomes a plain object.

```js
const stubs = Stubs(jest.fn)

parsed.find('one')
  .stub('logger.stream.foo.bar.info()', stubs.createStub)
  .callWith()

// Access generated stubs
stubs.getStubs().info  // the jest.fn() that was called
```

**Dot-path patterns:**

```js
.stub('logger.stream.foo.bar.info()', stubs.createStub)     // mixed objects + function
.stub('logger().info().debug()', stubs.createStub)           // all functions
.stub('logger.info().severe.armageddon()', stubs.createStub) // mixed
.stub('fetch().then().then()', stubs.createStub)             // chained promises
```

### `.callWith(...args)`

Execute the function with the given arguments. Returns the function's return value.

```js
const result = parsed.find('sum').callWith(1, 2)
// result === 3

// For async functions
const result = await parsed.find('fetchData').callWith()
```

### `.apply(thisArg, ...args)`

Execute the function with a specific `this` context.

```js
const result = parsed.find('getA').apply({ a: 42 })
// result === 42
```

### `.getFn()`

Return the function without executing it. Useful for React components that need to be passed to a renderer.

```js
const Greeting = parsed.find('Greeting').getFn()
render(<Greeting name="World" />)
```

### `.source()`

Return the generated source code as a string.

### `.print()`

Print the generated source code to the console.

### `.reset()`

Clear all injected dependencies. Call this in `beforeEach` to ensure test isolation.

```js
beforeEach(() => {
  parsed.reset()
})
```

### `.getProvisions()`

Return all currently injected values as an object.

### `.getAST()`

Return the raw Babel AST.

### `.getSandbox()`

Return the sandbox object. The sandbox has a `.getRemovedImports()` method to inspect which imports were stripped.

```js
const removed = parsed.getSandbox().getRemovedImports()
// ['util', 'fs', './logger']
```

## `Stubs(stubImplementation)`

Factory for creating stubs. Pass your test framework's stub constructor (`jest.fn` or `sinon.stub`).

**Returns:** `{ createStub, getStubs }`

| Property | Description |
|----------|-------------|
| `createStub` | Pass this to `.stub()` as the second argument. It creates stubs on demand. |
| `getStubs()` | Returns an object containing all generated stubs, keyed by their leaf name. |

```js
import { Stubs } from 'maineffectjs'

const stubs = Stubs(jest.fn)

parsed.find('one')
  .stub('logger.stream.foo.bar.info()', stubs.createStub)
  .callWith()

// Assert on the generated stub
expect(stubs.getStubs().info).toBeCalledWith('adding')
```

### Three patterns

**Pattern 1: Simple stub assertion**

```js
const stubs = Stubs(jest.fn)
parsed.find('fn').stub('dep.method()', stubs.createStub).callWith()
expect(stubs.getStubs().method).toBeCalled()
```

**Pattern 2: Stub with return value**

```js
const stubs = Stubs(jest.fn)
const fn = parsed.find('fn').stub('fetch().json()', stubs.createStub)
stubs.getStubs().json.mockReturnValue({ data: 'test' })
fn.callWith()
```

**Pattern 3: Stub with implementation**

```js
const stubs = Stubs(jest.fn)
const fn = parsed.find('fn').stub('fetch().then()', stubs.createStub)
stubs.getStubs().then.mockImplementation(callback => callback('data'))
fn.callWith()
```
