
const esprima = require('esprima')
const escodegen = require('escodegen')
const vm = require('vm')
const istanbul = require('istanbul-lib-instrument')
const coverage = require('istanbul-lib-coverage')

import traverse from 'traverse'
import { expect } from 'chai'
import fs from 'fs'

const instrumenter = istanbul.createInstrumenter({esModules: true})

const CodeFragment = (scriptSrc, instVar) => {
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
            return CodeFragment(fnSrc, instVar)
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
            return CodeFragment(fnSrc, instVar)
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
            return CodeFragment(fnSrc, instVar)
        },
        callWith: (...args) => {
            __dhruv__context__.setArgs(args)
            const covVar = Object.keys(instVar)[0]

            let testCode = `
                    (function () {
                        try {
                            ${scriptSrc}
                            const __dhruv_result__ = __evaluated__.apply(null, __dhruv__context__.getArgs())    
                            return {
                                result: __dhruv_result__,
                                // coverage: ${covVar}
                            }
                        } catch (e) {
                            return {
                                exception: e,
                                // coverage: ${covVar}
                            }
                        }
                    })()
                `
            const script = new vm.Script(testCode)
            const sb = vm.createContext({...tempContext, __dhruv__context__, ...instVar})
            const ctx = script.runInNewContext(sb)
            
            console.log(ctx.exception, ctx.coverage)

            // console.log(JSON.stringify(ctx.coverage))

            // global.__coverage__ = ctx.__coverage__
            
            // const coverageMap = coverage.createCoverageMap(ctx.coverage)

            // // console.log(JSON.stringify(coverageMap))
            // const summary = coverage.createCoverageSummary()
            // coverageMap.files().forEach(function (f) {
            //     console.log(f)
            //     var fc = coverageMap.fileCoverageFor(f),
            //     s = fc.toSummary();
            //     // console.log(s, f)
            //     summary.merge(s);
            // });

            // console.log('Global summary', summary)
            // console.log(ctx.coverage)
            return {
                result: ctx.result,
                exception: ctx.exception
            }
        }
    }
}

export const parseFn = (fileName) => {
    let code = fs.readFileSync(fileName, 'utf8')
    let instrumentedCode = instrumenter.instrumentSync(code)
    
    vm.runInThisContext(instrumentedCode)

    const covVar = instrumentedCode.split('=')[0].replace('var ', '')

    const script = new vm.Script(`(function () {return ${covVar}})()`);

    const covVarObj = script.runInThisContext()

    console.log(covVarObj, '<<<')
    return CodeFragment(instrumentedCode, {[covVar]: covVarObj})
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
