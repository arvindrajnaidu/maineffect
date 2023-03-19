import vm from "vm";
import traverse from "traverse";
import {
  transform,
  transformFromAstSync,
  transformFileSync,
  types,
} from "@babel/core";
// import types from '@babel/types';
import babelTraverse from "@babel/traverse";
import path from "path";
// import istanbul from 'babel-plugin-istanbul'
// import presetEnv from '@babel/preset-env'
// import spread from "@babel/plugin-transform-spread"

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

  return {
    namespace,
    // get: (key) => fileSB[key],
    set: (key, val) => {
      // fileSB[key] = val;
      closures[key] = val;
    },
    // reset: (val) => fileSB = val,
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
  };
};

const getReplacementKey = (key) => `__maineffect_${key}_replacement__`;

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

const ImportRemover = () => () => {
  return {
    visitor: {
      ImportDeclaration(path, state) {
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
  const { code } = transformFromAstSync(ast, null, {
    filename: "fake",
  });

  sb.set("__maineffect_args__", args);
  sb.set("__maineffect_this__", thisParam);
  const closureCode = sb.getClosuresCode();
  const closures = sb.getClosures();
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
  if (process.env.IS_WEB) {
    global.getClosureValue = getClosureValue;
    testResult = eval(testCode);
    delete global.getClosureValue;
  } else {
    const contextObject = { ...global, getClosureValue };
    vm.createContext(contextObject);
    testResult = vm.runInContext(testCode, contextObject);
  }

  // global.__coverage__ = {...global.__coverage__, ...testResult.__coverage__}
  // console.log(testResult.__coverage__)
  // const testResult = vm.runInThisContext(testCode)
  return testResult;
};

const CodeFragment = (ast, sb) => {
  return {
    find: (key) => {
      const fn = traverse(ast).reduce(function (acc, x) {
        // if (x && x.type) console.log(x && x.type);
        if (x && x.type === "VariableDeclarator" && x.id && x.id.name === key) {
          return getIsolatedFn(x.init);
        } else if (x && x.type === "Property" && x.key && x.key.name === key) {
          return getIsolatedFn(x.value);
        } else if (
          x &&
          x.type === "ObjectProperty" &&
          x.key &&
          x.key.name === key
        ) {
          return getIsolatedFn(x.value);
        } else if (
          x &&
          x.type === "MethodDefinition" &&
          x.key &&
          x.key.name === key
        ) {
          return getIsolatedFn(x.value);
        } else if (
          x &&
          x.type === "ClassMethod" &&
          x.key &&
          x.key.name === key
        ) {
          return getIsolatedFn({ ...x, type: "FunctionExpression" });
        } else if (
          x &&
          x.type === "ClassDeclaration" &&
          x.id &&
          x.id.type === "Identifier" &&
          x.id.name === key
        ) {
          return x;
        } else if (
          x &&
          x.type === "FunctionDeclaration" &&
          x.id &&
          x.id.type === "Identifier" &&
          x.id.name === key
        ) {
          return getIsolatedFn(x);
        }
        return acc;
      }, null);
      if (!fn) {
        throw new Error("Function not found");
      }
      var newAst = types.program([fn]);
      return CodeFragment(newAst, sb);
    },
    provide: function (key, stub) {
      if (typeof key === "object") {
        Object.keys(key).forEach((k) => {
          sb.set(k, key[k]);
        });
        return this;
      }
      sb.set(key, stub);
      return CodeFragment(ast, sb);
    },
    source: () => {
      return transformFromAstSync(ast, null, {
        filename: "fake",
      }).code;
    },
    print: function (logger = console.log) {
      const scriptSrc = transformFromAstSync(ast, null, {
        filename: "fake",
      }).code;
      logger(scriptSrc);
      return this;
    },
    fold: (key, replacement) => {
      sb.set(getReplacementKey(key), replacement);
      const fn = traverse(ast).map(function (x) {
        if (x && x.type === "VariableDeclarator") {
          if (x.id && x.id.name === key) {
            this.update({
              ...x,
              init: {
                type: "Identifier",
                name: `getClosureValue("${getReplacementKey(key)}")`,
              },
            });
          } else if (x.id && x.id.type === "ObjectPattern") {
            const matchedKeys =
              x.id.properties &&
              x.id.properties.filter((p) => p.key && p.key.name === key);
            if (matchedKeys.length > 0) {
              this.update({
                ...x,
                init: {
                  type: "Identifier",
                  name: getReplacementKey(key),
                },
              });
            }
          }
        }
      });
      return CodeFragment(fn, sb);
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
    stubFnCalls: function () {
      const fn = traverse(ast).reduce(function (acc, x) {
        if (x && x.type === "CallExpression") {
          let stubNames = [];
          traverse(x).forEach(function (x) {
            if (x && x.type === "Identifier") {
              stubNames.push(x.name);
            }
          });
          let stubName = stubNames.join(".");
          // const stub = stubCreator(stubName)
          // sb.set(key, stub);
          return this;
        }
        return acc;
      }, null);

      // if (typeof key === "object") {
      //   Object.keys(key).forEach((k) => {
      //     sb.set(k, key[k]);
      //   });
      //   return this;
      // }
      // sb.set(key, stub);
      // return this;

      return this;
      // return CodeFragment(newAst, sb);
    },
    getAST() {
      return ast;
    },
  };
};

const getCodeFragment = ({ ast, code, sb }) => {
  // Let us grab the cov_ function
  const coverageFnName = getCoverageFnName(ast);

  if (coverageFnName) {
    let testCode = `(function(exports, require, module, __filename, __dirname) {
      ${sb.getClosuresCode()}
      ${code}
      return {covFnName: ${coverageFnName}, cov: __coverage__}
      })({}, ()=>{}, {}, '', '');
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
      } catch(e) {
        console.log(e, '<< error')
        throw e
      }
      
      delete global.getClosureValue;
    } else {
      const contextObject = {
        ...global,
        getClosureValue: sb.getClosureValue,
      };
      vm.createContext(contextObject);
      initialRunResult = vm.runInContext(testCode, contextObject);
    }
    const { covFnName, cov } = initialRunResult;

    // const contextObject = {
    //   // ...global,
    //   getClosureValue: (key) => sb.getClosureValue(key),
    // };
    // vm.createContext(contextObject);
    // const { covFnName, cov } = vm.runInContext(testCode, contextObject);
    global.__coverage__ = cov;
    sb.set(`${coverageFnName}`, covFnName);
  } else {
    // console.log("SKIP coverage");
  }
  return CodeFragment(ast, sb);
};

export const parseFn = (fnAbsName, sandbox = {}, options = { plugins: [] }) => {
  // console.log(fnAbsName)
  const sb = Sandbox(fnAbsName, sandbox);
  const { ast, code } = transformFileSync(fnAbsName, {
    sourceType: "module",
    ast: true,
    code: true,
    // plugins: [ImportRemover(), istanbul],
    plugins: [ImportRemover(), ...options.plugins],
  });
  return getCodeFragment({ ast, code, sb });
};

export const parseFnStr = (
  fnAbsName,
  fnStr,
  sandbox = {},
  options = { plugins: [] }
) => {
  const sb = Sandbox(fnAbsName, sandbox);
  const { ast, code } = transform(fnStr, {
    filename: fnAbsName,
    sourceType: "module",
    ast: true,
    code: true,
    plugins: [ImportRemover(), ...options.plugins],
  });
  return getCodeFragment({ ast, code, sb });
};

export const load = parseFn;
export const parse = parseFn;

export default {
  parseFn,
  load,
  parse: parseFn,
  require: parseFn,
  parseFnStr,
};
