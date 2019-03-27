const esprima = require('esprima')
const escodegen = require('escodegen')
const vm = require('vm')

import traverse from 'traverse'
import { expect } from 'chai'
import fs from 'fs'

export const parseFn = (fileName) => {
    let code = fs.readFileSync(fileName, 'utf8')
    let ans = esprima.parseModule(code)
    return {
        find: (fnName) => {
            let fn = traverse(ans).reduce(function (acc, x) {
                if (x && 
                    x.type === 'VariableDeclarator' &&
                    x.id && x.id.name === fnName) {
                    return x.init
                }
                return acc
            }, null)
            let fnSrc = escodegen.generate(fn)
            return {
                callWith: (...args) => {
                    // let testCode
                    // if (fn.async) {
                    // }
                    let testCode = `
                            (function () {
                                const ${fnName} = ${fnSrc}
                                return ${fnName}.call(null, ${args})
                            })()
                        `                    
                    // console.log(testCode)

                    const script = new vm.Script(testCode)
                    const context = vm.createContext({setTimeout})
                    return script.runInNewContext(context)
                }
            }
        }
    }
}
