
import vm from 'node:vm'
import traverse from 'traverse'
import * as babel from "@babel/core"
import babelTraverse from "@babel/traverse";
import path from 'path'
import fs from 'fs'

const Sandbox = (fileName, state) => {
    const namespace = fileName.replace(/\./g, '_').replace(/\-/g, '_').split(path.sep).slice(1).join('_')
    global.__maineffect__ = global.__maineffect__ ? global.__maineffect__ : {}
    global.__maineffect__[namespace] = global.__maineffect__[namespace] ? global.__maineffect__[namespace] : {...state}

    const fileSB = global.__maineffect__[namespace]
    return {
        namespace,
        // get: (key) => fileSB[key],
        set: (key, val) => fileSB[key] = val,
        reset: (val) => fileSB = val,
        getCode: () => {
            return Object.keys(fileSB).reduce((acc, curr) => {
                return `
                    ${acc}
                    const ${curr} = __maineffect__.${namespace}.${curr};
                `
            }, '')

        }
    }
}

const getReplacementKey = key => `__maineffect_${key}_replacement__`

const getCoverageFnName = (node) => {
    let firstIdentifier = null
    babelTraverse(node, {
        FunctionDeclaration(path) {
            if (path.node.id.name.indexOf('cov_') === 0) {
                firstIdentifier = path.node.id
                return
            }
        }
    });
    return firstIdentifier && firstIdentifier.name
}

const ImportRemover = (options) => () => {
    return {
      visitor: {
        ImportDeclaration(path, state) {
            path.remove()
        }
      }
    };
}

const getIsolatedFn = (init) => {
    return {
        "type": "VariableDeclaration",
        "declarations": [
            {
                "type": "VariableDeclarator",
                "id": {
                    "type": "Identifier",
                    "name": "__maineffect_evaluated__"
                },
                "init": init
            }
        ],
        "kind": "const"
    }
}

const evaluateScript = (thisParam = null, ast, sb, ...args) => {
    const { code } = babel.transformFromAstSync(ast, null, {
        filename: 'fake',
    })    

    sb.set('__maineffect_args__', args)
    sb.set('__maineffect_this__', thisParam)
    const closures = sb.getCode()
    // console.log('>>>>', closures)
    let testCode = `
            (function () {
                ${closures}
                try {
                    ${code}
                    const __maineffect_result__ = __maineffect_evaluated__.apply(__maineffect_this__, __maineffect_args__)
                    return {
                        result: __maineffect_result__,
                        //__coverage__,
                    }
                } catch (e) {
                    return {
                        exception: e
                    }
                }
            })();
        `
    console.log(testCode, '<<< Instab')
    // console.log(global.__coverage__)
    
    const contextObject = { ...global };
    vm.createContext(contextObject);
    const testResult = vm.runInContext(testCode, contextObject)

    global.__coverage__ = {...global.__coverage__, ...testResult.__coverage__}
    // console.log(testResult.__coverage__)
    // const testResult = vm.runInThisContext(testCode)
    return testResult
}

const getClosedFunction = (thisParam = null, ast, sb, ...args) => {
    const { code } = babel.transformFromAstSync(ast, null, {
        filename: 'fake'
    })    

    sb.set('__maineffect_args__', args)
    sb.set('__maineffect_this__', thisParam)
    const closures = sb.getCode()
    // console.log('>>>>', closures, '<<')
    let testCode = `
            (function () {
                ${closures}
                try {
                    ${code}
                    return __maineffect_evaluated__;
                } catch (e) {
                    return {
                        exception: e
                    }
                }
            })()
        `
    const contextObject = { ...global };
    vm.createContext(contextObject);
    const testResult = vm.runInContext(testCode, contextObject)

    // console.log(testCode, '<<< test code')
    // const testResult = vm.runInThisContext(testCode)
    return testResult
}

const CodeFragment = (ast, sb) => {
    return {
        find: (key) => {
            const fn = traverse(ast).reduce(function (acc, x) {
                // if (x && x.type) console.log(x && x.type);
                if (x &&
                    x.type === 'VariableDeclarator' &&
                    x.id && x.id.name === key) {
                    return (getIsolatedFn(x.init))
                } else if (x &&
                    x.type === 'Property' &&
                    x.key && x.key.name === key) {
                    return getIsolatedFn(x.value)
                } else if (x &&
                    x.type === 'ObjectProperty' &&
                    x.key && x.key.name === key) {
                    return getIsolatedFn(x.value)
                } else if (x &&
                    x.type === 'MethodDefinition' &&
                    x.key && x.key.name === key) {
                    return getIsolatedFn(x.value)
                } else if (x &&
                    x.type === 'ClassMethod' &&
                    x.key && x.key.name === key) {
                    return getIsolatedFn({ ...x, type: 'FunctionExpression' })
                } else if (x &&
                    x.type === 'ClassDeclaration' &&
                    x.id && x.id.type === 'Identifier' &&
                    x.id.name === key) {
                    return x
                } else if (x &&
                    x.type === 'FunctionDeclaration' &&
                    x.id && x.id.type === 'Identifier' &&
                    x.id.name === key) {
                    return x
                }
                return acc
            }, null)
            if (!fn) {
                throw new Error('Function not found')
            }
            var newAst = babel.types.program([fn])

            return CodeFragment(newAst, sb)
        },
        provide: function (key, stub) {
            sb.set(key, stub)
            return this
        },
        source: () => {
            return babel.transformFromAstSync(ast, null, {
                filename: 'fake'
            }).code
        },
        print: function (logger = console.log) {
            const scriptSrc = babel.transformFromAstSync(ast, null, {
                filename: 'fake'
            }).code
            logger(scriptSrc)
            return this
        },
        fold: (key, replacement) => {
            sb.set(getReplacementKey(key), replacement)
            const fn = traverse(ast).map(function (x) {
                if (x && x.type === 'VariableDeclarator') {
                    if (x.id && x.id.name === key) {
                        this.update({
                            ...x, init: {
                                "type": "Identifier",
                                "name": `__maineffect__.${sb.namespace}.${getReplacementKey(key)}`
                            }
                        })
                    } else if (x.id && x.id.type === 'ObjectPattern') {
                        const matchedKeys = x.id.properties && x.id.properties.filter(p => p.key && p.key.name === key)
                        if (matchedKeys.length > 0) {
                            this.update({
                                ...x, init: {
                                    "type": "Identifier",
                                    "name": getReplacementKey(key)
                                }
                            })
                        }
                    }
                }
            })
            return CodeFragment(fn, sb)
        },
        foldWithObject: function (folder) {
            if (Object.keys(folder).length === 0) {
                return this
            }
            return Object.keys(folder).reduce((prev, curr) => {
                prev = prev.fold(curr, folder[curr])
                return prev
            }, this)
        },
        callWith (...args) {
            return evaluateScript(null, ast, sb, ...args);
        },
        apply (thisParam, ...args) {
            return evaluateScript(thisParam, ast, sb, ...args);
        },
        getFn (...args) {
            return getClosedFunction(null, ast, sb, ...args);
        },
        getSandbox () {
            return sb
        },
    }
}

export const parseFn = (fnAbsName, options = {sandbox: {}, destroy: []}) => {
    // Let us do what require does
    // console.log(this, __filename, __dirname, '<<< Paths')
    // const fnAbsName = require.resolve(fileName)
    // console.log(fnAbsName, '<<<')
    // console.log(options.sandbox, '<<< w abt this?')
    const sb = Sandbox(fnAbsName, options.sandbox) // Sandbox.reset(options.sandbox)    
    const { ast, code } = babel.transformFileSync(fnAbsName, { 
        sourceType: 'module', 
        ast: true, 
        code: true, 
        plugins: [ImportRemover(options),] 
    })

    // console.log('HERER')
    // Let us grab the cov_ function
    const coverageFnName = getCoverageFnName(ast)
    // console.log(code)
    let testCode = `(function(exports, require, module, __filename, __dirname) {
        ${sb.getCode()}
        ${code}
        
        return ${coverageFnName}
    })({}, ()=>{}, {}, '', '');
    `

    fs.writeFileSync(__dirname + '/tmp.js', testCode);
    
    if (coverageFnName) {
        const covFn = vm.runInThisContext(testCode)
        sb.set(`${coverageFnName}`, covFn)    
    }
    // sb.set('covFnName', coverageFnName)

    // console.log(sb.get('totalRisk'), '<<< Orign SB')
    return CodeFragment(ast, sb)
}

export const load = parseFn
export const parse = parseFn

export default {
    parseFn,
    load,
    parse: parseFn,
    require: parseFn
}
