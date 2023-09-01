import vm from "vm";
import {
  transform,
  transformFromAstSync,
  transformFileSync,
  types,
} from "@babel/core";
import babelTraverse from "@babel/traverse";
import path from "path";

const Sandbox = (fileName, state) => {
  const closures = {
    ...state,
  };
  const namespace = fileName
    .replace(/\./g, "_")
    .replace(/\-/g, "_")
    .split(path.sep)
    .slice(1)
    .join("_");

  const removedImportNodes = [];
  return {
    namespace,
    stubs: {},
    set: (key, val) => {
      closures[key] = val;
    },
    reset: () => {
      const closureKeys = Object.keys(closures);
      closureKeys.forEach(key => {
        if (!key.startsWith('cov_') && !state[key]) {
          delete closures[key];
        }
      });
    },
    dump: () => {
      return closures;
    },
    getClosuresCode() {
      return Object.keys(closures).reduce((acc, curr) => {
        return `
${acc}
const ${curr} = getClosureValue("${curr}");
`;
      }, "");
    },
    getClosures() {
      return closures;
    },
    getClosureValue(key) {
      return closures[key];
    },
    getFileName() {
      return fileName;
    },
    addRemovedImportNode(node) {
      removedImportNodes.push(node);
    },
    getRemovedImports () {
      return removedImportNodes;
    }
  };
};

const getCoverageFnName = (node) => {
  let firstIdentifier = null;
  babelTraverse(node, {
    FunctionDeclaration(path) {
      if (path.node.id.name.indexOf("cov_") === 0) {
        firstIdentifier = path.node.id;
        return;
      }
    },
  });
  return firstIdentifier && firstIdentifier.name;
};

const ImportRemover = (onImportRemoved) => () => {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        onImportRemoved(path.node);
        path.remove();
      },
    },
  };
};

const getIsolatedFn = (init) => {
  return {
    type: "VariableDeclaration",
    declarations: [
      {
        type: "VariableDeclarator",
        id: {
          type: "Identifier",
          name: "__maineffect_evaluated__",
        },
        init: init,
      },
    ],
    kind: "const",
  };
};

// Gets the value of the result calling fn.
const getEvaluatedResultCode = ({ closureCode, code }) => `
(function () {
    ${closureCode}
    ${code}
    const result = __maineffect_evaluated__.apply(__maineffect_this__, __maineffect_args__)
    return result;
})();
`;

// Gets the fn - TODO: Should just throw instead of wrapping in try catch.
const getEvaluatedCode = ({ closureCode, code }) => `
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
`;

const evaluateScript = (thisParam = null, ast, sb, getFn = false, ...args) => {
  // console.log(sb.getFileName(), 'SB filename');
  const { code } = transformFromAstSync(ast, null, {
    // filename: sb.getFileName(),
    // filename: 'calculator.js',
    filename: "fake",
  });

  // console.log(code)

  sb.set("__maineffect_args__", args);
  sb.set("__maineffect_this__", thisParam);
  const closureCode = sb.getClosuresCode();
  // const closures = sb.getClosures();
  // const getClosureValue = (key) => {
  //   return closures[key];
  // };

  const getClosureValue = sb.getClosureValue;

  var testCode;

  if (getFn) {
    testCode = getEvaluatedCode({ code, closureCode });
  } else {
    testCode = getEvaluatedResultCode({ code, closureCode });
  }
  // console.log(testCode, '<<< Instab')
  // console.log(this)
  // console.log(testCode)

  // const contextObject = { getClosureValue };
  var testResult;

  // console.log(testCode)
  // console.log(JSON.stringify(global.__coverage__, null, 2), '<<< BEFORE RUN')
  if (process.env.IS_WEB) {
    global.getClosureValue = getClosureValue;
    testResult = eval(testCode);
    delete global.getClosureValue;
  } else {
    const contextObject = { ...global, getClosureValue };
    vm.createContext(contextObject);
    // console.log(testCode, '<< testCode')
    testResult = vm.runInContext(testCode, contextObject);

    // console.log(JSON.stringify(contextObject.__coverage__, null, 2), '<< alt lats')
    // global.getClosureValue = getClosureValue;
    // testResult = vm.runInThisContext(testCode);
    // delete global.getClosureValue;
    // console.log(testResult.cov, '<<< Cov result')
    // console.log(JSON.stringify(contextObject.__coverage__, null, 2), '<< MISSING COV')
  }

  // console.log(JSON.stringify(global.__coverage__, null, 2), '<<< AFTER RUN')
  // global.__coverage__ = {...global.__coverage__, ...testResult.__coverage__}
  // console.log(testResult.__coverage__)
  // const testResult = vm.runInThisContext(testCode)
  return testResult;
};

const CodeFragment = (ast, sb) => {
  const codeFg = {
    find: (key) => {
      let fn;
      babelTraverse(ast, {
        enter(path) {
          if (fn) {
            path.stop();
          }
        },
        // VariableDeclarator: function (path) {
        //   if (path.node.id.name === key) {
        //     fn = path.node.init;
        //     path.stop();
        //   }
        // },
        ArrowFunctionExpression: function (path) {
          if (path.parent.id && path.parent.id.name === key) {
            fn = path.parent;
            return path.stop();
          }
          if (!path.node.leadingComments) {
            return;
          }
          for (let comment of path.node.leadingComments) {
            if (comment.value.startsWith("name:")) {
              const name = comment.value.replace("name:", "").trim();
              if (name === key) {
                fn = path.node;
                return path.stop();
              }
            }
          }
        },
        FunctionDeclaration: function (path) {          
          if (path.node.id.name === key) {
            fn = path.node;
            path.stop();
          }
        },
        ObjectProperty: function (path) {
          if (path.node.key.name === key) {
            fn = path.node.value;
            path.stop();
          }
        },
        ClassDeclaration: function (path) {
          if (path.node.id.name === key) {
            fn = path.node.body;
            path.stop();
          }
        },
        Method: function (path) {
          if (path.node.key.name === key) {
            fn = {
              type: "FunctionExpression",
              async: path.node.async,
              params: path.node.params,
              body: path.node.body,
            };
            path.stop();
          }
        },
      });
      fn = fn && getIsolatedFn(fn);
      if (!fn) {
        throw new Error("Function not found");
      }
      var newAst = types.program([fn]);
      return CodeFragment(newAst, sb);
    },
    findCallback: (callExpessionName, callbackIndex) => {
      let callback;
      babelTraverse(ast, {
        enter(path) {
          if (callback) {
            path.stop();
          }
        },
        CallExpression: function (path) {
          if (path.node.callee && path.node.callee.name === callExpessionName) {
            callback = path.node.arguments[callbackIndex]
            path.stop();
          }
        },
      });
      callback = callback && getIsolatedFn(callback);
      if (!callback) {
        throw new Error("Callback or callexpression not found");
      }
      var newAst = types.program([callback]);

      // console.log(sb.getClosureValue())
      return CodeFragment(newAst, sb);
    },
    provide: function (key, stub) {
      if (typeof key === "object") {
        Object.keys(key).forEach((k) => {
          sb.set(k, key[k]);
        });
        return CodeFragment(ast, sb);
      }
      sb.set(key, stub);
      return CodeFragment(ast, sb);
    },
    source: () => {
      return transformFromAstSync(ast, null, {
        filename: sb.getFileName(),
        // filename: "fake",
      }).code;
    },
    print: function (logger = console.log) {
      const scriptSrc = transformFromAstSync(ast, null, {
        filename: sb.getFileName(),
        // filename: "fake",
      }).code;
      logger(scriptSrc);
      return this;
    },
    
    foldWithObject: function (folder) {
      if (Object.keys(folder).length === 0) {
        return this;
      }
      return Object.keys(folder).reduce((prev, curr) => {
        prev = prev.fold(curr, folder[curr]);
        return prev;
      }, this);
    },
    callWith(...args) {
      try {
        return evaluateScript(null, ast, sb, false, ...args);
      } catch (e) {
        if (e.toString().startsWith("ReferenceError:")) {
        }
        throw e;
      }
    },
    apply(thisParam, ...args) {
      return evaluateScript(thisParam, ast, sb, false, ...args);
    },
    getFn(...args) {
      return evaluateScript(null, ast, sb, true, ...args);
    },
    getSandbox() {
      return sb;
    },
    stub: function (key, stubCreator) {
      const arr = key.split(".");
      let provision = {};
      let prev = provision;
      arr.forEach((item) => {
        if (item.endsWith("()")) {
          // Current item is a stub
          let fnName = item.replace("()", "");
          // console.log(typeof prev, fnName, '<<< fnName')
          let tempStub = stubCreator(fnName);
          if (typeof prev === "object") {
            // Prev was an object
            prev[fnName] = tempStub;            
          } else {
            // Prev was also a stub
            if (prev.returns) {
              // Sinon
              prev.returns({[fnName]: tempStub})
            } else if (prev.mockReturnValue) {
              // Jest
              prev.mockReturnValue({[fnName]: tempStub});
            } else {
              throw new Error('Uknown stub. Neither Sinon nor Jest');
            }
          }
          prev = tempStub;
        } else {
          // console.log(typeof prev, item, '<<< item')
          // Current item is an object
          let tempObj = {};
          if (typeof prev === "object") {
            // Prev was an object
            prev[item] = tempObj;
          } else {  
            // Prev was a stub
            if (prev.returns) {
              // Sinon
              prev.returns(tempObj)
            } else if (prev.mockImplementation) {
              // Jest
              prev.mockReturnValue({[item]: tempObj});
              // prev.mockImplementation(() => {
              //   return () => tempObj
              // });
            } else {
              throw new Error('Uknown stub. Neither Sinon nor Jest');
            }
          }
          prev = tempObj;
        }
      });
      // console.log(provision);
      this.provide(provision);

      return CodeFragment(ast, sb);
    },
    getAST() {
      return ast;
    },
    getProvisions(){ 
      return sb.dump()
    },
    reset() {      
      sb.reset();
      return CodeFragment(ast, sb);
    }
  };
  codeFg.inject = codeFg.provide;
  return codeFg;
};

const getCodeFragment = ({ ast, code, sb }) => {
  // Let us grab the cov_ function
  const coverageFnName = getCoverageFnName(ast);

  if (coverageFnName) {
    let testCode = `(function(exports, require, module, __filename, __dirname) {
      ${sb.getClosuresCode()}
      ${code}
      return {covFnName: ${coverageFnName}, cov: __coverage__}
      })({}, require, {}, '', '');
    `;

    if (!sb.getClosureValue) {
      console.log("WTF?????");
    }
    var initialRunResult;
    // var testResult;

    if (process.env.IS_WEB) {
      global.getClosureValue = sb.getClosureValue;
      try {
        initialRunResult = eval(testCode);
        // console.log('Runs fine!!')
      } catch (e) {
        console.log(e, "<< error");
        throw e;
      }
      delete global.getClosureValue;
    } else {
      const contextObject = {
        ...global,
        getClosureValue: sb.getClosureValue,
        require: global.require ? global.require : () => {},
      };
      vm.createContext(contextObject);
      initialRunResult = vm.runInContext(testCode, contextObject);

      // global.getClosureValue = sb.getClosureValue;
      // try {
      //   initialRunResult = vm.runInThisContext(testCode);
      //   // console.log('Runs fine!!')
      // } catch(e) {
      //   console.log(e, '<< error')
      //   throw e
      // }
      // delete global.getClosureValue;
    }
    const { covFnName, cov } = initialRunResult;

    // console.log(cov, '<< Coverage')
    // const contextObject = {
    //   // ...global,
    //   getClosureValue: (key) => sb.getClosureValue(key),
    // };
    // vm.createContext(contextObject);
    // const { covFnName, cov } = vm.runInContext(testCode, contextObject);
    global.__coverage__ = cov;
    // global.__coverage__ = global.__coverage__ ? {...global.__coverage__, ...cov} : cov;
    sb.set(`${coverageFnName}`, covFnName);
  }
  return CodeFragment(ast, sb);
};

export const parseFn = (fnAbsName, sandbox = {}, options = { plugins: [] }) => {
  const sb = Sandbox(fnAbsName, sandbox);
  const removedImports = [];
  function onImportRemoved(node) {
    removedImports.push(node);
  }
  const { ast, code } = transformFileSync(fnAbsName, {
    sourceType: "module",
    ast: true,
    code: true,
    // plugins: [ImportRemover(), istanbul],
    plugins: [ImportRemover(onImportRemoved), ...options.plugins],
  });
  removedImports.forEach(sb.addRemovedImportNode);

  return getCodeFragment({ ast, code, sb });
};

export const parseFnStr = (
  fnAbsName,
  fnStr,
  sandbox = {},
  options = { plugins: [] }
) => {
  const sb = Sandbox(fnAbsName, sandbox);
  const removedImports = [];
  function onImportRemoved(node) {
    removedImports.push(node);
  }
  const { ast, code } = transform(fnStr, {
    filename: fnAbsName,
    sourceType: "module",
    ast: true,
    code: true,
    plugins: [ImportRemover(onImportRemoved), ...options.plugins],
  });
  removedImports.forEach(sb.addRemovedImportNode);
  return getCodeFragment({ ast, code, sb });
};

export const load = parseFn;
export const parse = parseFn;

export const Stubs = (stubImplementation) => {
  const stubs = {};
  return {
      createStub(stubName){
          stubs[stubName] = stubImplementation();
          return stubs[stubName];
      },
      getStubs() {
          return stubs;
      }
  }
}

export default {
  parseFn,
  load,
  parse: parseFn,
  require: parseFn,
  parseFnStr,
  Stubs,
};
