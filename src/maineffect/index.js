
import traverse from 'traverse'
const acorn = require('acorn')
const escodegen = require('escodegen')
const vm = require('vm')
let Module = require('module')

const istanbul = require('istanbul-lib-instrument')
const coverage = require('istanbul-lib-coverage')
import { create } from 'istanbul-reports'
import libReport from  'istanbul-lib-report'

const instrumenter = istanbul.createInstrumenter({esModules: true, compact: false})

const getReplacementKey = key => `__maineffect_${key}_replacement__`

const getFirstIdentifier = (node) => {
    let firstIdentifier = null
    traverse(node).forEach((x) => {
        if (!firstIdentifier && x.type === 'Identifier') {
            firstIdentifier = x
        }
    })
    return firstIdentifier
}

export const getCoverage = (reporter, config) => {
    const context = libReport.createContext({
        coverageMap: global.__mainEffect_coverageMap__
    })    
    const created = create(reporter, config)
    return created.execute(context)
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

const evaluateScript = (thisParam = null, sandbox, scriptSrc, ...args) => {
    sandbox['__maineffect_args__'] = args
    sandbox['__maineffect_this__'] = thisParam
    let testCode = `
            (function () {
                try {
                    ${scriptSrc}
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
        
    const testResult = vm.runInNewContext(testCode, sandbox)
    const coverageMap = coverage.createCoverageMap(sandbox.__coverage__)

    if (!global.__mainEffect_coverageMap__) {
        global.__mainEffect_coverageMap__ = coverageMap
    } else {
        global.__mainEffect_coverageMap__.merge(coverageMap)
    }

    return testResult
}

const CodeFragment = (scriptSrc, sandbox) => {
    const parsedCode = acorn.parse(scriptSrc, {sourceType: 'module'})
    let exception

    return {
        find: (key) => {
            const fn = traverse(parsedCode).reduce(function (acc, x) {
                if (x && 
                    x.type === 'VariableDeclarator' &&
                    x.id && x.id.name === key) {
                    return (getIsolatedFn(x.init))
                } else if (x && 
                    x.type === 'Property' &&
                    x.key && x.key.name === key) {
                        return getIsolatedFn(x.value)
                }
                return acc
            }, null)
            if (!fn) {
                throw new Error('Function not found')
            }
            const fnSrc = escodegen.generate(fn)
            return CodeFragment(fnSrc, sandbox)
        },

        provide: function (key, stub) {
            sandbox[key] = stub
            return this
        },

        source: () => {
            return scriptSrc
        },

        fold: (key, replacement) => {
            sandbox[getReplacementKey(key)] = replacement

            const fn = traverse(parsedCode).map(function (x) {
                if (x && 
                    x.type === 'VariableDeclarator' &&
                    x.id && x.id.name === key) {
                    
                    // Check for coverage variables
                    if (x.init && 
                        x.init.type === 'SequenceExpression' &&
                        x.init.expressions &&
                        x.init.expressions[0] &&
                        x.init.expressions[0].type === 'UpdateExpression' &&
                        x.init.expressions[0].operator === '++' &&
                        x.init.expressions[0].argument.object &&
                        x.init.expressions[0].argument.object.object &&
                        x.init.expressions[0].argument.object.object.name &&
                        x.init.expressions[0].argument.object.object.name.indexOf('cov_') === 0 &&
                        x.init.expressions[0].argument.object.property.name === 's'
                        ) {
                        return this.update({...x, init: {
                            "type": "SequenceExpression",
                            "expressions": [
                                x.init.expressions[0],
                                {
                                    "type": "Identifier",
                                    "name": getReplacementKey(key)
                                }  
                            ]}
                        })
                    }

                    this.update({...x, init: {
                            "type": "Identifier",
                            "name": getReplacementKey(key)
                        }
                    })
                }
            })
            const fnSrc = escodegen.generate(fn)
            return CodeFragment(fnSrc, sandbox)
        },
        destroy: (key) => {     
            const fn = traverse(parsedCode).map(function (x) {
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
            const fnSrc = escodegen.generate(fn)
            return CodeFragment(fnSrc, sandbox)
        },
        callWith: (...args) => {
            return evaluateScript(null, sandbox, scriptSrc, ...args)
        },
        apply: (thisParam, ...args) => {
            return evaluateScript(thisParam, sandbox, scriptSrc, ...args)
        }
    }
}

export const removeFunctionCalls = (code, setupFns) => {
    const parsedCode = acorn.parse(code, {sourceType: 'module'})
    const fn = traverse(parsedCode).map(function (x) {
        if (x && 
            x.type === 'CallExpression' &&
            x.callee &&
            x.callee.type === 'Identifier' &&
            (x.callee.name === 'require' || setupFns.includes(x.callee.name))
            ) {
                return {
                    "type": "ObjectExpression",
                    "properties": []
                }
        }
        if (x &&
            x.type === 'ImportDeclaration') {
                return {
                    "type": "ObjectExpression",
                    "properties": []
                }
        }
        if (x &&
            x.type === 'ExportDefaultDeclaration') {
                return {
                    "type": "ObjectExpression",
                    "properties": []
                }
        }
        if (x &&
            x.type === 'ExportNamedDeclaration') {
            return x.declaration
        }

        return x
    }, null)
    
    return escodegen.generate(fn)
}

const defaultOptions = { 
    removeSideEffects: true, 
    ignoreFnCalls: 'setup',
}

export const parseFn = (fileName, options) => {

    const finalOptions = options ? {...defaultOptions, ...options} : defaultOptions
    const filename = require.resolve(fileName)
    const fakeModule = {
            _compile: source => {
                // console.log('transformed code')
                // console.log(source)
            }
        }
    // console.log(Module._extensions)

    Module._extensions['.js'](fakeModule, filename)
    // const require = createRequ/ire(import.meta.url);
    // const m = module.require(fileName)
    // console.log(m)

    let code
    if (typeof fileName === 'function' ){
        code = fileName.toString()
    } else {
        const fs = require('fs')
        code = fs.readFileSync(fileName, 'utf8')
    }
    
    if (finalOptions.removeSideEffects) {
        const { ignoreFnCalls } = finalOptions
        code = removeFunctionCalls(code, Array.isArray(ignoreFnCalls) ? ignoreFnCalls : [ignoreFnCalls])
    }

    const sb = vm.createContext({setTimeout, console})

    // Coverage
    const instrumentedCode = instrumenter.instrumentSync(code, fileName)
    vm.runInContext(instrumentedCode, sb)    
    return CodeFragment(instrumentedCode, sb)   
}

export const parseStr = (code) => {
    return CodeFragment(code)
}

export const load = parseFn
export const parse = parseFn

export default {
    parseFn,
    parseStr,
    load,
    parse
}
