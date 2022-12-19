
import vm from 'vm'
import traverse from 'traverse'
import * as babel from "@babel/core"
import babelTraverse from "@babel/traverse";
import path from 'path'
// import fs from 'fs'

const Sandbox = (fileName, state) => {
    const closures = {
        ...state,
    };
    const namespace = fileName.replace(/\./g, '_').replace(/\-/g, '_').split(path.sep).slice(1).join('_');
    // global.__maineffect__ = global.__maineffect__ ? global.__maineffect__ : {}
    // global.__maineffect__[namespace] = global.__maineffect__[namespace] ? global.__maineffect__[namespace] : {...state}

    // const fileSB = global.__maineffect__[namespace]
    return {
        namespace,
        // get: (key) => fileSB[key],
        set: (key, val) => {
            // fileSB[key] = val;
            closures[key] = val;
        },
        // reset: (val) => fileSB = val,
        getClosuresCode () {
            return Object.keys(closures).reduce((acc, curr) => {
                return `
                    ${acc}
                    const ${curr} = getClosureValue("${curr}");
                `
            }, '')
        },
        getClosures () {
            return closures;
        },
        getClosureValue (key) {
            return closures[key]
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

const ImportRemover = () => () => {
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

const getEvaluatedResultCode = ({closureCode, code}) => `
(function () {
    ${closureCode}
    // try {
        ${code}

        const result = __maineffect_evaluated__.apply(__maineffect_this__, __maineffect_args__)
        return result;
        // return {
        //     result,
        // }
    // } catch (e) {
    //     return {
    //         exception: e
    //     }
    // }
})();
`
const getEvaluatedCode = ({closureCode, code}) => `
(function () {
    ${closureCode}
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

const evaluateScript = (thisParam = null, ast, sb, getFn = false, ...args) => {
    const { code } = babel.transformFromAstSync(ast, null, {
        filename: 'fake',
    })    

    sb.set('__maineffect_args__', args)
    sb.set('__maineffect_this__', thisParam)
    const closureCode = sb.getClosuresCode()
    const closures = sb.getClosures();
    const getClosureValue = (key) => {
        return closures[key];
    }

    var testCode;
    
    if (getFn) {
        testCode = getEvaluatedCode({code, closureCode});
    } else {
        testCode = getEvaluatedResultCode({code, closureCode});
    }
    // console.log(testCode, '<<< Instab')
    // console.log(this)
    // console.log(this._environment.global.__coverage__)
    const contextObject = { ...global, getClosureValue };
    vm.createContext(contextObject);
    const testResult = vm.runInContext(testCode, contextObject)

    // global.__coverage__ = {...global.__coverage__, ...testResult.__coverage__}
    // console.log(testResult.__coverage__)
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
            if (typeof key === 'object') {
                Object.keys(key).forEach((k) => {
                    sb.set(k, key[k]);
                })
                return this;
            }
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
                                "name": `getClosureValue("${getReplacementKey(key)}")`
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
            return evaluateScript(null, ast, sb, false, ...args);
        },
        apply (thisParam, ...args) {
            return evaluateScript(thisParam, ast, sb, false, ...args);
        },
        getFn (...args) {
            return evaluateScript(null, ast, sb, true, ...args);
        },
        getSandbox () {
            return sb
        },
    }
}

export const parseFn = (fnAbsName, sandbox = {}) => {
    // Let us do what require does
    // console.log(this, __filename, __dirname, '<<< Paths')
    // const fnAbsName = require.resolve(fileName)
    // console.log(fnAbsName, '<<<')
    // console.log(options.sandbox, '<<< w abt this?')
    const sb = Sandbox(fnAbsName, sandbox) // Sandbox.reset(options.sandbox)    
    const { ast, code } = babel.transformFileSync(fnAbsName, { 
        sourceType: 'module', 
        ast: true, 
        code: true, 
        plugins: [ImportRemover(), "istanbul"] 
    })

    // console.log('HERER')
    // Let us grab the cov_ function
    const coverageFnName = getCoverageFnName(ast)
    // console.log(code)
    let testCode = `(function(exports, require, module, __filename, __dirname) {
        ${sb.getClosuresCode()}
        ${code}
        
        return {covFnName: ${coverageFnName}, cov: __coverage__}
    })({}, ()=>{}, {}, '', '');
    `

    // fs.writeFileSync(__dirname + '/tmp.js', testCode);
        
    if (coverageFnName) {
        if (!sb.getClosureValue) {
            console.log('WTF?????')
        }

        const contextObject = { ...global, getClosureValue: (key) => sb.getClosureValue(key)};
        vm.createContext(contextObject);
        const {covFnName, cov} = vm.runInContext(testCode, contextObject)
    
        // global.getClosureValue = sb.getClosureValue;
        // const {covFnName, cov} = vm.runInThisContext(testCode);
        // console.log(cov, '<<< Coverage')
        global.__coverage__ = cov;
        sb.set(`${coverageFnName}`, covFnName)    
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
