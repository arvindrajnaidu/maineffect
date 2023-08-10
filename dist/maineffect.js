(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@babel/core"), require("@babel/traverse"));
	else if(typeof define === 'function' && define.amd)
		define(["@babel/core", "@babel/traverse"], factory);
	else if(typeof exports === 'object')
		exports["maineffect"] = factory(require("@babel/core"), require("@babel/traverse"));
	else
		root["maineffect"] = factory(root["@babel/core"], root["@babel/traverse"]);
})(global, function(__WEBPACK_EXTERNAL_MODULE__0__, __WEBPACK_EXTERNAL_MODULE__2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("vm");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseFn", function() { return parseFn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseFnStr", function() { return parseFnStr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "load", function() { return load; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parse", function() { return parse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Stubs", function() { return Stubs; });
/* harmony import */ var vm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var vm__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vm__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);
/* harmony import */ var _babel_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_traverse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
/* harmony import */ var _babel_traverse__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_traverse__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_3__);





const Sandbox = (fileName, state) => {
  const closures = {
    ...state,
  };
  const namespace = fileName
    .replace(/\./g, "_")
    .replace(/\-/g, "_")
    .split(path__WEBPACK_IMPORTED_MODULE_3___default.a.sep)
    .slice(1)
    .join("_");

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
  };
};

const getReplacementKey = (key) => `__maineffect_${key}_replacement__`;

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
  // console.log(sb.getFileName(), 'SB filename');
  const { code } = Object(_babel_core__WEBPACK_IMPORTED_MODULE_1__["transformFromAstSync"])(ast, null, {
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
    vm__WEBPACK_IMPORTED_MODULE_0___default.a.createContext(contextObject);
    // console.log(testCode, '<< testCode')
    testResult = vm__WEBPACK_IMPORTED_MODULE_0___default.a.runInContext(testCode, contextObject);

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
  return {
    find: (key) => {
      let fn;
      _babel_traverse__WEBPACK_IMPORTED_MODULE_2___default()(ast, {
        enter(path) {
          if (fn) {
            path.stop();
          }
        },
        VariableDeclarator: function (path) {
          if (path.node.id.name === key) {
            fn = path.node.init;
            path.stop();
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
      var newAst = _babel_core__WEBPACK_IMPORTED_MODULE_1__["types"].program([fn]);
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
      var newAst = _babel_core__WEBPACK_IMPORTED_MODULE_1__["types"].program([callback]);

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
      return Object(_babel_core__WEBPACK_IMPORTED_MODULE_1__["transformFromAstSync"])(ast, null, {
        filename: sb.getFileName(),
        // filename: "fake",
      }).code;
    },
    print: function (logger = console.log) {
      const scriptSrc = Object(_babel_core__WEBPACK_IMPORTED_MODULE_1__["transformFromAstSync"])(ast, null, {
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
      } catch (e) {
        console.log(e, "<< error");
        throw e;
      }
      delete global.getClosureValue;
    } else {
      const contextObject = {
        ...global,
        getClosureValue: sb.getClosureValue,
      };
      vm__WEBPACK_IMPORTED_MODULE_0___default.a.createContext(contextObject);
      initialRunResult = vm__WEBPACK_IMPORTED_MODULE_0___default.a.runInContext(testCode, contextObject);

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
  const { ast, code } = Object(_babel_core__WEBPACK_IMPORTED_MODULE_1__["transformFileSync"])(fnAbsName, {
    sourceType: "module",
    ast: true,
    code: true,
    // plugins: [ImportRemover(), istanbul],
    plugins: [ImportRemover(), ...options.plugins],
  });
  return getCodeFragment({ ast, code, sb });
};

const parseFnStr = (
  fnAbsName,
  fnStr,
  sandbox = {},
  options = { plugins: [] }
) => {
  const sb = Sandbox(fnAbsName, sandbox);
  const { ast, code } = Object(_babel_core__WEBPACK_IMPORTED_MODULE_1__["transform"])(fnStr, {
    filename: fnAbsName,
    sourceType: "module",
    ast: true,
    code: true,
    plugins: [ImportRemover(), ...options.plugins],
  });
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

/* harmony default export */ __webpack_exports__["default"] = ({
  parseFn,
  load,
  parse: parseFn,
  require: parseFn,
  parseFnStr,
  Stubs,
});


/***/ })
/******/ ])["default"];
});