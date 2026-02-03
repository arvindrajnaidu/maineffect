---
layout: default
title: How It Works
---

[Home](./) | [Getting Started](./getting-started) | [How It Works](./how-it-works) | [API Reference](./api-reference) | [Guides](./guides) | [Examples](./examples) | [Why Maineffect?](./why-maineffect)

---

# How It Works

## The 5-step pipeline

Maineffect uses the same AST parse/transform/generate pipeline that Babel, TypeScript, and Webpack already use in every modern JavaScript project. It adds one transform: removing imports.

### 1. Parse

Maineffect reads your source file and converts it to an AST (Abstract Syntax Tree) using Babel. The file is never `require()`d or `import()`ed — it's read as a raw string and parsed.

```js
const parsed = parseFn(require.resolve('./my-module'))
```

`require.resolve()` returns the file path without executing the module. Maineffect then reads and parses that file.

### 2. Strip

All `import` and `require` statements are removed from the AST. This is the key insight: since unit tests should not be concerned with side effects, stripping imports isn't a compromise — it's doing exactly what a unit test should do.

After stripping, the code has no external dependencies. Any identifier that was imported becomes an unresolved reference — which you can fill in with `.provide()`.

### 3. Find

You locate the function you want to test by name:

```js
parsed.find('myFunction')
```

`.find()` walks the AST to locate your function. It can find:

- **Function declarations** — `function foo() {}`
- **Arrow functions** — `const foo = () => {}`
- **Function expressions** — `const foo = function() {}`
- **Named function expressions** — `goo(function bar() {})`
- **Class expressions** — `const Foo = class { greet() {} }`
- **Object methods** — `const obj = { subtract: (a, b) => a - b }`
- **React class components** — class methods like `render()`, lifecycle methods
- **Nested functions** — functions defined inside other functions
- **Annotated anonymous functions** — `/*name:myHandler*/() => {}`
- **Callbacks via `findCallback()`** — `app.get('/path', (req, res) => {})` and `app.post(...)` member expression callbacks

### 4. Provide

You inject mock values for any dependencies the function uses:

```js
parsed
  .find('myFunction')
  .provide('request', () => 'mock response')
  .provide('logger', { info: () => {} })
```

Or provide multiple at once:

```js
.provide({
  request: () => 'mock response',
  logger: { info: () => {} }
})
```

For deeply chained calls, use `.stub()`:

```js
.stub('logger.stream.foo.bar.info()', stubs.createStub)
```

### 5. Call

The function executes in an isolated sandbox and returns the result:

```js
const result = parsed.find('myFunction').callWith(arg1, arg2)
```

## Sandbox environments

### Node.js — `vm` module

In Node.js, Maineffect uses the built-in `vm` module to create an isolated execution context. The function runs inside a `vm.Script`, with only the values you've provided available in scope.

### Browser — `eval()`

In browser environments, Maineffect generates a function from the transformed source and executes it via `eval()`. Because all imports have been stripped, there is no module system to hook into — the code runs with no bundler, no `node_modules`, no build pipeline.

## What `.find()` can locate

| Pattern | Example | How to find it |
|---------|---------|----------------|
| Function declaration | `function foo() {}` | `.find('foo')` |
| Arrow function | `const foo = () => {}` | `.find('foo')` |
| Async function | `async function foo() {}` | `.find('foo')` |
| Function expression (variable) | `const bar = function() {}` | `.find('bar')` |
| Named function expression | `goo(function bar() {})` | `.find('bar')` |
| Class expression | `const Foo = class { greet() {} }` | `.find('Foo').find('greet')` |
| Object method | `const obj = { add: (a,b) => a+b }` | `.find('add')` |
| Annotated function | `/*name:handler*/() => {}` | `.find('handler')` |
| Nested function | `function outer() { const inner = () => {} }` | `.find('inner')` |
| Callback (identifier) | `describe('test', myFn)` | `.findCallback('describe', 1)` |
| Callback (member expr) | `app.get('/path', handler)` | `.findCallback('app.get', 1)` |
