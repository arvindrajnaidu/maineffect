
const esprima = require('esprima')
const escodegen = require('escodegen')
const vm = require('vm')
const istanbul = require('istanbul-lib-instrument')
const coverage = require('istanbul-lib-coverage')

import traverse from 'traverse'
import { expect } from 'chai'
import fs from 'fs'

const instrumenter = istanbul.createInstrumenter({esModules: true})

const getReplacementKey = key => `__mockoff_${key}_replacement__`

const CodeFragment = (scriptSrc, sandbox) => {
    const parsedCode = esprima.parseModule(scriptSrc)
    let exception

    // const globals = {
    //     setTimeout
    // }

    return {
        find: (key) => {
            const fn = traverse(parsedCode).reduce(function (acc, x) {
                if (x && 
                    x.type === 'VariableDeclarator' &&
                    x.id && x.id.name === key) {
                        return {
                            "type": "VariableDeclaration",
                            "declarations": [
                                {
                                    "type": "VariableDeclarator",
                                    "id": {
                                        "type": "Identifier",
                                        "name": "__evaluated__"
                                    },
                                    "init": x.init
                                }
                            ],
                            "kind": "const"
                        }
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
                if (x && 
                    (x.type === 'ExpressionStatement')&&
                    x.expression && x.expression.type === 'CallExpression' &&
                    (x.expression.callee && x.expression.callee.name === key ||
                     x.expression.callee.object && x.expression.callee.object.name === key)
                    ) {
                    this.update({
                        "type": "BlockStatement",
                        "body": []
                    })
                }
                if (x && 
                    (x.type === 'CallExpression')&&
                    x.callee && 
                    x.callee.type === 'Identifier' &&
                    x.callee.name === key
                    ) {
                    this.update({
                        "type": "BlockStatement",
                        "body": []
                    })
                }
            })
            const fnSrc = escodegen.generate(fn)
            return CodeFragment(fnSrc, sandbox)
        },
        callWith: (...args) => {
            sandbox['__mockoff_args__'] = args
            let testCode = `
                    (function () {
                        try {
                            ${scriptSrc}
                            const __mockoff_result__ = __evaluated__.apply(null, __mockoff_args__)   
                            return {
                                result: __mockoff_result__
                            }
                        } catch (e) {
                            return {
                                exception: e
                            }
                        }
                    })()
                `
            // console.log(tempContext, __mockoff__context__, sandbox, '::::::::')
            
            const testResult = vm.runInNewContext(testCode, sandbox)
            // console.log(testResult, '::::::<<<<<')
            // const coverageMap = coverage.createCoverageMap(sandbox.__coverage__)
            // const summary = coverage.createCoverageSummary()

            // coverageMap.files().forEach(function (f) {
            //     var fc = coverageMap.fileCoverageFor(f),
            //     s = fc.toSummary();
            //     summary.merge(s);
            // });

            // console.log('Global summary', summary)
            // testResult.summary = summary
            return testResult
        }
    }
}

export const removeFunctionCalls = (code, setupFn) => {
    const parsedCode = esprima.parseModule(code)
    const fn = traverse(parsedCode).map(function (x) {
        if (x && 
            x.type === 'CallExpression' &&
            x.callee &&
            x.callee.type === 'Identifier' &&
            (x.callee.name === 'require' || x.callee.name === setupFn)
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

        return x
    }, null)
    
    return escodegen.generate(fn)
}

export const parseFn = (fileName, options = { removeSideEffects: true, coverage : true, setupFn: 'setup'}) => {
    let code = fs.readFileSync(fileName, 'utf8')
    
    if (options.removeSideEffects) {
        code = removeFunctionCalls(code, options.setupFn)
    }

    const sb = vm.createContext()

    // Coverage
    // const instrumentedCode = instrumenter.instrumentSync(code)
    // vm.runInContext(instrumentedCode, sb)

    return CodeFragment(code, sb)

    // Babel
    // const babelified = babelCore.transform(code, {
    //     plugins: ["babel-plugin-transform-es2015-modules-commonjs-simple", "@babel/plugin-proposal-object-rest-spread"]
    // })
    // console.log(babelified.code)
    // return CodeFragment(babelified.code)
}

export const parseStr = (code) => {
    // let code = fs.readFileSync(fileName, 'utf8')
    return CodeFragment(code)
    // const babelified = babelCore.transform(code, {
    //     plugins: ["babel-plugin-transform-es2015-modules-commonjs-simple", "@babel/plugin-proposal-object-rest-spread"]
    // })
    // console.log(babelified.code)
    // return CodeFragment(babelified.code)
}

export default {
    parseFn,
    parseStr
}
