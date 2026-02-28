(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@babel/core"), require("@babel/traverse"));
	else if(typeof define === 'function' && define.amd)
		define(["@babel/core", "@babel/traverse"], factory);
	else if(typeof exports === 'object')
		exports["maineffect"] = factory(require("@babel/core"), require("@babel/traverse"));
	else
		root["maineffect"] = factory(root["@babel/core"], root["@babel/traverse"]);
})(global, (__WEBPACK_EXTERNAL_MODULE__774__, __WEBPACK_EXTERNAL_MODULE__367__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 154
(module) {

module.exports = require("vm");

/***/ },

/***/ 367
(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__367__;

/***/ },

/***/ 774
(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__774__;

/***/ },

/***/ 928
(module) {

module.exports = require("path");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (maineffect)
/* harmony export */ });
/* unused harmony exports parseFn, parseFnStr, load, parse, Stubs */
/* harmony import */ var vm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(154);
/* harmony import */ var vm__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vm__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(774);
/* harmony import */ var _babel_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_traverse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(367);
/* harmony import */ var _babel_traverse__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_traverse__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(928);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_3__);





const Sandbox = (fileName, state) => {
  const closures = {
    ...state,
  };
  const sep = ((path__WEBPACK_IMPORTED_MODULE_3___default()) && (path__WEBPACK_IMPORTED_MODULE_3___default().sep)) || "/";
  const namespace = fileName
    .replace(/\./g, "_")
    .replace(/\-/g, "_")
    .split(sep)
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
  _babel_traverse__WEBPACK_IMPORTED_MODULE_2___default()(node, {
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
  const { code } = (0,_babel_core__WEBPACK_IMPORTED_MODULE_1__.transformFromAstSync)(ast, null, {
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
    const newContextObj = vm__WEBPACK_IMPORTED_MODULE_0___default().createContext(contextObject);
    // console.log(testCode, '<< testCode')
    if (newContextObj) {
      testResult = vm__WEBPACK_IMPORTED_MODULE_0___default().runInContext(testCode, newContextObj);
    } else {
      testResult = vm__WEBPACK_IMPORTED_MODULE_0___default().runInContext(testCode, contextObject);
    }
    

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
      _babel_traverse__WEBPACK_IMPORTED_MODULE_2___default()(ast, {
        enter(path) {
          // if (path.node.type === 'FunctionExpression')  {
            
          // }
          
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
        FunctionExpression: function (path) {
          if (path.node.id && path.node.id.name === key) {
            fn = path.node;
            return path.stop();
          }
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
        ClassExpression: function (path) {
          if (path.node.id && path.node.id.name === key) {
            fn = path.node.body;
            return path.stop();
          }
          if (path.parent.id && path.parent.id.name === key) {
            fn = path.node.body;
            return path.stop();
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
      var newAst = _babel_core__WEBPACK_IMPORTED_MODULE_1__.types.program([fn]);
      return CodeFragment(newAst, sb);
    },
    findCallback: (callExpessionName, callbackIndex) => {
      let callback;
      _babel_traverse__WEBPACK_IMPORTED_MODULE_2___default()(ast, {
        enter(path) {
          if (callback) {
            path.stop();
          }
        },
        CallExpression: function (path) {
          const callee = path.node.callee;
          if (!callee) return;
          const calleeName = callee.name
            || (callee.type === "MemberExpression"
              && callee.object
              && callee.property
              && `${callee.object.name}.${callee.property.name}`);
          if (calleeName === callExpessionName) {
            callback = path.node.arguments[callbackIndex]
            path.stop();
          }
        },
      });
      callback = callback && getIsolatedFn(callback);
      if (!callback) {
        throw new Error("Callback or callexpression not found");
      }
      var newAst = _babel_core__WEBPACK_IMPORTED_MODULE_1__.types.program([callback]);

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
      return (0,_babel_core__WEBPACK_IMPORTED_MODULE_1__.transformFromAstSync)(ast, null, {
        filename: sb.getFileName(),
        // filename: "fake",
      }).code;
    },
    print: function (logger = console.log) {
      const scriptSrc = (0,_babel_core__WEBPACK_IMPORTED_MODULE_1__.transformFromAstSync)(ast, null, {
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
      
      const newContextObj = vm__WEBPACK_IMPORTED_MODULE_0___default().createContext(contextObject);
      // console.log(testCode, '<< testCode')
      if (newContextObj) {
        initialRunResult = vm__WEBPACK_IMPORTED_MODULE_0___default().runInContext(testCode, newContextObj);
      } else {
        initialRunResult = vm__WEBPACK_IMPORTED_MODULE_0___default().runInContext(testCode, contextObject);
      }

      // vm.createContext(contextObject);
      // initialRunResult = vm.runInContext(testCode, contextObject);

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

const parseFn = (fnAbsName, sandbox = {}, options = { plugins: [] }) => {
  const sb = Sandbox(fnAbsName, sandbox);
  const removedImports = [];
  function onImportRemoved(node) {
    removedImports.push(node);
  }
  const { ast, code } = (0,_babel_core__WEBPACK_IMPORTED_MODULE_1__.transformFileSync)(fnAbsName, {
    sourceType: "module",
    ast: true,
    code: true,
    // plugins: [ImportRemover(), istanbul],
    plugins: [ImportRemover(onImportRemoved), ...options.plugins],
  });
  removedImports.forEach(sb.addRemovedImportNode);

  return getCodeFragment({ ast, code, sb });
};

const parseFnStr = (
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
  const { ast, code } = (0,_babel_core__WEBPACK_IMPORTED_MODULE_1__.transform)(fnStr, {
    filename: fnAbsName,
    sourceType: "module",
    ast: true,
    code: true,
    plugins: [ImportRemover(onImportRemoved), ...options.plugins],
  });
  removedImports.forEach(sb.addRemovedImportNode);
  return getCodeFragment({ ast, code, sb });
};

const load = parseFn;
const parse = parseFn;

const Stubs = (stubImplementation) => {
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

/* harmony default export */ const maineffect = ({
  parseFn,
  load,
  parse: parseFn,
  require: parseFn,
  parseFnStr,
  Stubs,
});

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});