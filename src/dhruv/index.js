const esprima = require('esprima')
const escodegen = require('escodegen')
const vm = require('vm')

import traverse from 'traverse'
import { expect } from 'chai'
import fs from 'fs'


const CodeFragment = (scriptSrc, fnName = 'root') => {
    const parsedCode = esprima.parseModule(scriptSrc)
    let exception

    const __dhruv__context__ = {
        setTimeout,
        setException: (e) => {
            exception = e
        },
        getException: () => {
            return exception
        }
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
            const fnSrc = escodegen.generate(fn)
            return CodeFragment(fnSrc, key)
        },
        reDeclare: (key, replacement) => {
            
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
        callWith: (...args) => {
            let testCode = `
                    (function () {
                        try {
                            const ${fnName} = ${scriptSrc}
                            return ${fnName}.call(null, ${args})    
                        } catch (e) {
                            setException(e)
                        }
                    })()
                `
            const script = new vm.Script(testCode)
            // console.log(testCode)
            const context = vm.createContext(__dhruv__context__)
            const result = script.runInNewContext(context)
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
}
