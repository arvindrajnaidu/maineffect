const esprima = require('esprima')
const escodegen = require('escodegen')
const vm = require('vm')

import traverse from 'traverse'
import { expect } from 'chai'
import fs from 'fs'

const CodeFragment = (scriptSrc, fnName = 'root') => {
    const parsedCode = esprima.parseModule(scriptSrc)
    let exception
    let args

    const globals = {
        setTimeout
    }

    const __dhruv__context__ = {
        setException: (e) => {
            exception = e
        },
        getException: () => {
            return exception
        },
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
                    return x.init
                }
                return acc
            }, null)
            if (!fn) {
                throw new Error('Function not found')
            }
            const fnSrc = escodegen.generate(fn)
            return CodeFragment(fnSrc, key)
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
            return CodeFragment(fnSrc, key)
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
            return CodeFragment(fnSrc, key)
        },
        callWith: (...args) => {
            __dhruv__context__.setArgs(args)

            let testCode = `
                    (function () {
                        try {
                            const ${fnName} = ${scriptSrc}
                            return ${fnName}.apply(null, __dhruv__context__.getArgs())    
                        } catch (e) {
                            __dhruv__context__.setException(e)
                        }
                    })()
                `
            // console.log(testCode, '<<< Test Code')
            const script = new vm.Script(testCode)
            // console.log(tempContext)
            const sb = vm.createContext({...globals, ...tempContext, __dhruv__context__})
            const result = script.runInNewContext(sb)
            return {
                result,
                exception: __dhruv__context__.getException()
            }
        }
    }
}

export const parseFn = (fileName) => {
    let code = fs.readFileSync(fileName, 'utf8')
    return CodeFragment(code)
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
