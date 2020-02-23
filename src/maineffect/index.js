
import vm from 'vm'
import traverse from 'traverse'
import * as babel from "@babel/core"
import path from 'path'

const Sandbox = (fileName, state) => {
    const namespace = fileName.replace('.', '_').replace('-', '_').split(path.sep).slice(1).join('_')
    global.__maineffect_sb__ = global.__maineffect_sb__ ? global.__maineffect_sb__ : {}
    global.__maineffect_sb__[namespace] = global.__maineffect_sb__[namespace] ? global.__maineffect_sb__[namespace] : state

    const fileSB = global.__maineffect_sb__[namespace]
    return {
        get: (key) => fileSB[key],
        set: (key, val) => fileSB[key] = val,
        reset: (val) => fileSB = val,
        getCode: () => {
            return Object.keys(fileSB).reduce((acc, curr) => {
                return `
                    ${acc}
                    const ${curr} = __maineffect_sb__.${namespace}.${curr}
                `
            }, '')

        }
    }
}

const getReplacementKey = key => `__maineffect_${key}_replacement__`

const getFirstIdentifier = (node) => {
    let firstIdentifier = null
    traverse(node).forEach((x) => {
        if (!firstIdentifier && x && x.type === 'Identifier') {
            firstIdentifier = x
        }
    })
    return firstIdentifier
}

const getCoverageFnName = (node) => {
    let firstIdentifier = null
    traverse(node).forEach((x) => {
        if (!firstIdentifier && x && x.type === 'Identifier' && x.name && x.name.indexOf('cov_') === 0) {
            firstIdentifier = x
        }
    })
    return firstIdentifier
}

const callRemover = (options) => () => {
    return {
      visitor: {
        CallExpression(path, state) {
            if (options.destroy.includes(path.node.callee.name)) {
                path.remove()
            }
        },
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
                    "name": "__evaluated__"
                },
                "init": init
            }
        ],
        "kind": "const"
    }
}

const evaluateScript = (thisParam = null, ast, sb, ...args) => {
    const { code } = babel.transformFromAstSync(ast, null, {
        filename: 'fake'
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
                    const __maineffect_result__ = __evaluated__.apply(__maineffect_this__, __maineffect_args__)
                    return {
                        result: __maineffect_result__
                    }
                } catch (e) {
                    return {
                        exception: e
                    }
                }
            })()
        `
    
    const testResult = vm.runInThisContext(testCode)
    // console.log(testResult)
    return testResult
}

const CodeFragment = (ast, sb) => {
    return {
        find: (key) => {
            // console.log(JSON.stringify(ast))
            const fn = traverse(ast).reduce(function (acc, x) {
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
                                "name": `__maineffect_sb__.${getReplacementKey(key)}`
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
        destroy: (key) => {
            const fn = traverse(ast).map(function (x) {
                if (x && (x.type === 'CallExpression') && x.callee) {
                    // Under this callee if the first identifier matches key ... destroy
                    const firstIdentifierNode = getFirstIdentifier(x.callee)
                    if (firstIdentifierNode && firstIdentifierNode.name === key) {
                        this.update({
                            "type": "BlockStatement",
                            "body": []
                        })
                    }
                }
            })
            return CodeFragment(fn, sb)
        },
        callWith: (...args) => {
            return evaluateScript(null, ast, sb, ...args)
        },
        apply: (thisParam, ...args) => {
            return evaluateScript(thisParam, ast, sb, ...args)
        }
    }
}

export const parseFn = (fileName, options = {sandbox: {}, destroy: []}) => {
    // Let us do what require does
    const fnAbsName = require.resolve(fileName, { paths: module.parent.paths })
    const sb = Sandbox(fnAbsName, options.sandbox) // Sandbox.reset(options.sandbox)
    
    const { ast, code } = babel.transformFileSync(fnAbsName, { 
        sourceType: 'module', 
        ast: true, 
        code: true, 
        plugins: [callRemover(options), ] 
    })

    // Let us grab the cov_ function
    const { name } = getCoverageFnName(ast)

    let testCode = `(function(exports, require, module, __filename, __dirname) {
        ${sb.getCode()}
        ${code}
        return ${name}
    })({}, __maineffect_sb__.require, {}, '', '')`

    const covFn = vm.runInThisContext(testCode)
    sb.set(`${name}`, covFn)
    sb.set('covFnName', name)

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
