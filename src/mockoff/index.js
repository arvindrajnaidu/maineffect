
const esprima = require('esprima')
const escodegen = require('escodegen')
const vm = require('vm')
const istanbul = require('istanbul-lib-instrument')
const coverage = require('istanbul-lib-coverage')

import traverse from 'traverse'
import { expect } from 'chai'
import fs from 'fs'

const instrumenter = istanbul.createInstrumenter({esModules: true})

const CodeFragment = (scriptSrc, sandbox) => {
    const parsedCode = esprima.parseModule(scriptSrc)
    let exception
    let args

    // const globals = {
    //     setTimeout
    // }

    const __dhruv__context__ = {
        setArgs: (fnArgs) => {
            args = fnArgs
        },
        getArgs: () => {
            return args
        }
    }
    const tempContext = {

    }

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
                    // return x.init
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
            tempContext[key] = stub
            return this
        },

        source: () => {
            return scriptSrc
        },

        fold: (key, replacement) => {
            
            const replacementObj = esprima.parseModule(`const __dhruv__ = ${replacement}`)
                                    .body[0].declarations[0].init

            const fn = traverse(parsedCode).map(function (x) {
                if (x && 
                    x.type === 'VariableDeclarator' &&
                    x.id && x.id.name === key) {
                    this.update({...x, init: replacementObj})
                }
            })
            const fnSrc = escodegen.generate(fn)
            return CodeFragment(fnSrc, sandbox)
        },
        destroy: (key) => {     
            const fn = traverse(parsedCode).map(function (x) {
                if (x && 
                    x.type === 'ExpressionStatement' &&
                    x.expression && x.expression.type === 'CallExpression' &&
                    (x.expression.callee && x.expression.callee.name === key ||
                     x.expression.callee.object && x.expression.callee.object.name === key)
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
            __dhruv__context__.setArgs(args)
            // console.log(scriptSrc)
            let testCode = `
                    (function () {
                        try {
                            ${scriptSrc}
                            const __dhruv_result__ = __evaluated__.apply(null, __dhruv__context__.getArgs())    
                            return {
                                result: __dhruv_result__
                            }
                        } catch (e) {
                            return {
                                exception: e
                            }
                        }
                    })()
                `
            
            const testResult = vm.runInNewContext(testCode, {...tempContext, __dhruv__context__, ...sandbox})
            const coverageMap = coverage.createCoverageMap(sandbox.__coverage__)
            const summary = coverage.createCoverageSummary()

            coverageMap.files().forEach(function (f) {
                var fc = coverageMap.fileCoverageFor(f),
                s = fc.toSummary();
                summary.merge(s);
            });

            console.log('Global summary', summary)
            // testResult.summary = summary
            return testResult
        }
    }
}

export const removeFunctionCalls = (code) => {
    const parsedCode = esprima.parseModule(code)
    const fn = traverse(parsedCode).map(function (x) {
        if (x && 
            x.type === 'CallExpression') {
                return {
                    "type": "BlockStatement",
                    "body": []
                }
        }
        return x
    }, null)
    
    return escodegen.generate(fn)
}

export const parseFn = (fileName, options = { removeSideEffects: true, coverage : true}) => {
    let code = fs.readFileSync(fileName, 'utf8')
    
    if (options.removeSideEffects) {
        code = removeFunctionCalls(code)
    }

    // Coverage
    const instrumentedCode = instrumenter.instrumentSync(code)

    // console.log(instrumentedCode)
    // const gcv = '__coverage__'
    // var coverage = global[gcv] || (global[gcv] = {})    

    const sb = vm.createContext()
    vm.runInContext(instrumentedCode, sb)

    // console.log(coverage)

    return CodeFragment(instrumentedCode, sb)

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
