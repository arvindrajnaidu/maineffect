(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@babel/core"), require("@babel/traverse"));
	else if(typeof define === 'function' && define.amd)
		define(["@babel/core", "@babel/traverse"], factory);
	else if(typeof exports === 'object')
		exports["maineffect"] = factory(require("@babel/core"), require("@babel/traverse"));
	else
		root["maineffect"] = factory(root["@babel/core"], root["@babel/traverse"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__0__, __WEBPACK_EXTERNAL_MODULE__2__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var indexOf = function (xs, item) {
    if (xs.indexOf) return xs.indexOf(item);
    else for (var i = 0; i < xs.length; i++) {
        if (xs[i] === item) return i;
    }
    return -1;
};
var Object_keys = function (obj) {
    if (Object.keys) return Object.keys(obj)
    else {
        var res = [];
        for (var key in obj) res.push(key)
        return res;
    }
};

var forEach = function (xs, fn) {
    if (xs.forEach) return xs.forEach(fn)
    else for (var i = 0; i < xs.length; i++) {
        fn(xs[i], i, xs);
    }
};

var defineProp = (function() {
    try {
        Object.defineProperty({}, '_', {});
        return function(obj, name, value) {
            Object.defineProperty(obj, name, {
                writable: true,
                enumerable: false,
                configurable: true,
                value: value
            })
        };
    } catch(e) {
        return function(obj, name, value) {
            obj[name] = value;
        };
    }
}());

var globals = ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function',
'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object', 'RangeError',
'ReferenceError', 'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape',
'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'unescape'];

function Context() {}
Context.prototype = {};

var Script = exports.Script = function NodeScript (code) {
    if (!(this instanceof Script)) return new Script(code);
    this.code = code;
};

Script.prototype.runInContext = function (context) {
    if (!(context instanceof Context)) {
        throw new TypeError("needs a 'context' argument.");
    }
    
    var iframe = document.createElement('iframe');
    if (!iframe.style) iframe.style = {};
    iframe.style.display = 'none';
    
    document.body.appendChild(iframe);
    
    var win = iframe.contentWindow;
    var wEval = win.eval, wExecScript = win.execScript;

    if (!wEval && wExecScript) {
        // win.eval() magically appears when this is called in IE:
        wExecScript.call(win, 'null');
        wEval = win.eval;
    }
    
    forEach(Object_keys(context), function (key) {
        win[key] = context[key];
    });
    forEach(globals, function (key) {
        if (context[key]) {
            win[key] = context[key];
        }
    });
    
    var winKeys = Object_keys(win);

    var res = wEval.call(win, this.code);
    
    forEach(Object_keys(win), function (key) {
        // Avoid copying circular objects like `top` and `window` by only
        // updating existing context properties or new properties in the `win`
        // that was only introduced after the eval.
        if (key in context || indexOf(winKeys, key) === -1) {
            context[key] = win[key];
        }
    });

    forEach(globals, function (key) {
        if (!(key in context)) {
            defineProp(context, key, win[key]);
        }
    });
    
    document.body.removeChild(iframe);
    
    return res;
};

Script.prototype.runInThisContext = function () {
    return eval(this.code); // maybe...
};

Script.prototype.runInNewContext = function (context) {
    var ctx = Script.createContext(context);
    var res = this.runInContext(ctx);

    if (context) {
        forEach(Object_keys(ctx), function (key) {
            context[key] = ctx[key];
        });
    }

    return res;
};

forEach(Object_keys(Script.prototype), function (name) {
    exports[name] = Script[name] = function (code) {
        var s = Script(code);
        return s[name].apply(s, [].slice.call(arguments, 1));
    };
});

exports.isContext = function (context) {
    return context instanceof Context;
};

exports.createScript = function (code) {
    return exports.Script(code);
};

exports.createContext = Script.createContext = function (context) {
    var copy = new Context();
    if(typeof context === 'object') {
        forEach(Object_keys(context), function (key) {
            copy[key] = context[key];
        });
    }
    return copy;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 4 */
/***/ (function(module, exports) {

var traverse = module.exports = function (obj) {
    return new Traverse(obj);
};

function Traverse (obj) {
    this.value = obj;
}

Traverse.prototype.get = function (ps) {
    var node = this.value;
    for (var i = 0; i < ps.length; i ++) {
        var key = ps[i];
        if (!node || !hasOwnProperty.call(node, key)) {
            node = undefined;
            break;
        }
        node = node[key];
    }
    return node;
};

Traverse.prototype.has = function (ps) {
    var node = this.value;
    for (var i = 0; i < ps.length; i ++) {
        var key = ps[i];
        if (!node || !hasOwnProperty.call(node, key)) {
            return false;
        }
        node = node[key];
    }
    return true;
};

Traverse.prototype.set = function (ps, value) {
    var node = this.value;
    for (var i = 0; i < ps.length - 1; i ++) {
        var key = ps[i];
        if (!hasOwnProperty.call(node, key)) node[key] = {};
        node = node[key];
    }
    node[ps[i]] = value;
    return value;
};

Traverse.prototype.map = function (cb) {
    return walk(this.value, cb, true);
};

Traverse.prototype.forEach = function (cb) {
    this.value = walk(this.value, cb, false);
    return this.value;
};

Traverse.prototype.reduce = function (cb, init) {
    var skip = arguments.length === 1;
    var acc = skip ? this.value : init;
    this.forEach(function (x) {
        if (!this.isRoot || !skip) {
            acc = cb.call(this, acc, x);
        }
    });
    return acc;
};

Traverse.prototype.paths = function () {
    var acc = [];
    this.forEach(function (x) {
        acc.push(this.path); 
    });
    return acc;
};

Traverse.prototype.nodes = function () {
    var acc = [];
    this.forEach(function (x) {
        acc.push(this.node);
    });
    return acc;
};

Traverse.prototype.clone = function () {
    var parents = [], nodes = [];
    
    return (function clone (src) {
        for (var i = 0; i < parents.length; i++) {
            if (parents[i] === src) {
                return nodes[i];
            }
        }
        
        if (typeof src === 'object' && src !== null) {
            var dst = copy(src);
            
            parents.push(src);
            nodes.push(dst);
            
            forEach(objectKeys(src), function (key) {
                dst[key] = clone(src[key]);
            });
            
            parents.pop();
            nodes.pop();
            return dst;
        }
        else {
            return src;
        }
    })(this.value);
};

function walk (root, cb, immutable) {
    var path = [];
    var parents = [];
    var alive = true;
    
    return (function walker (node_) {
        var node = immutable ? copy(node_) : node_;
        var modifiers = {};
        
        var keepGoing = true;
        
        var state = {
            node : node,
            node_ : node_,
            path : [].concat(path),
            parent : parents[parents.length - 1],
            parents : parents,
            key : path.slice(-1)[0],
            isRoot : path.length === 0,
            level : path.length,
            circular : null,
            update : function (x, stopHere) {
                if (!state.isRoot) {
                    state.parent.node[state.key] = x;
                }
                state.node = x;
                if (stopHere) keepGoing = false;
            },
            'delete' : function (stopHere) {
                delete state.parent.node[state.key];
                if (stopHere) keepGoing = false;
            },
            remove : function (stopHere) {
                if (isArray(state.parent.node)) {
                    state.parent.node.splice(state.key, 1);
                }
                else {
                    delete state.parent.node[state.key];
                }
                if (stopHere) keepGoing = false;
            },
            keys : null,
            before : function (f) { modifiers.before = f },
            after : function (f) { modifiers.after = f },
            pre : function (f) { modifiers.pre = f },
            post : function (f) { modifiers.post = f },
            stop : function () { alive = false },
            block : function () { keepGoing = false }
        };
        
        if (!alive) return state;
        
        function updateState() {
            if (typeof state.node === 'object' && state.node !== null) {
                if (!state.keys || state.node_ !== state.node) {
                    state.keys = objectKeys(state.node)
                }
                
                state.isLeaf = state.keys.length == 0;
                
                for (var i = 0; i < parents.length; i++) {
                    if (parents[i].node_ === node_) {
                        state.circular = parents[i];
                        break;
                    }
                }
            }
            else {
                state.isLeaf = true;
                state.keys = null;
            }
            
            state.notLeaf = !state.isLeaf;
            state.notRoot = !state.isRoot;
        }
        
        updateState();
        
        // use return values to update if defined
        var ret = cb.call(state, state.node);
        if (ret !== undefined && state.update) state.update(ret);
        
        if (modifiers.before) modifiers.before.call(state, state.node);
        
        if (!keepGoing) return state;
        
        if (typeof state.node == 'object'
        && state.node !== null && !state.circular) {
            parents.push(state);
            
            updateState();
            
            forEach(state.keys, function (key, i) {
                path.push(key);
                
                if (modifiers.pre) modifiers.pre.call(state, state.node[key], key);
                
                var child = walker(state.node[key]);
                if (immutable && hasOwnProperty.call(state.node, key)) {
                    state.node[key] = child.node;
                }
                
                child.isLast = i == state.keys.length - 1;
                child.isFirst = i == 0;
                
                if (modifiers.post) modifiers.post.call(state, child);
                
                path.pop();
            });
            parents.pop();
        }
        
        if (modifiers.after) modifiers.after.call(state, state.node);
        
        return state;
    })(root).node;
}

function copy (src) {
    if (typeof src === 'object' && src !== null) {
        var dst;
        
        if (isArray(src)) {
            dst = [];
        }
        else if (isDate(src)) {
            dst = new Date(src.getTime ? src.getTime() : src);
        }
        else if (isRegExp(src)) {
            dst = new RegExp(src);
        }
        else if (isError(src)) {
            dst = { message: src.message };
        }
        else if (isBoolean(src)) {
            dst = new Boolean(src);
        }
        else if (isNumber(src)) {
            dst = new Number(src);
        }
        else if (isString(src)) {
            dst = new String(src);
        }
        else if (Object.create && Object.getPrototypeOf) {
            dst = Object.create(Object.getPrototypeOf(src));
        }
        else if (src.constructor === Object) {
            dst = {};
        }
        else {
            var proto =
                (src.constructor && src.constructor.prototype)
                || src.__proto__
                || {}
            ;
            var T = function () {};
            T.prototype = proto;
            dst = new T;
        }
        
        forEach(objectKeys(src), function (key) {
            dst[key] = src[key];
        });
        return dst;
    }
    else return src;
}

var objectKeys = Object.keys || function keys (obj) {
    var res = [];
    for (var key in obj) res.push(key)
    return res;
};

function toS (obj) { return Object.prototype.toString.call(obj) }
function isDate (obj) { return toS(obj) === '[object Date]' }
function isRegExp (obj) { return toS(obj) === '[object RegExp]' }
function isError (obj) { return toS(obj) === '[object Error]' }
function isBoolean (obj) { return toS(obj) === '[object Boolean]' }
function isNumber (obj) { return toS(obj) === '[object Number]' }
function isString (obj) { return toS(obj) === '[object String]' }

var isArray = Array.isArray || function isArray (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};

var forEach = function (xs, fn) {
    if (xs.forEach) return xs.forEach(fn)
    else for (var i = 0; i < xs.length; i++) {
        fn(xs[i], i, xs);
    }
};

forEach(objectKeys(Traverse.prototype), function (key) {
    traverse[key] = function (obj) {
        var args = [].slice.call(arguments, 1);
        var t = new Traverse(obj);
        return t[key].apply(t, args);
    };
});

var hasOwnProperty = Object.hasOwnProperty || function (obj, key) {
    return key in obj;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(3)))

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(process, global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseFn", function() { return parseFn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseFnStr", function() { return parseFnStr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "load", function() { return load; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parse", function() { return parse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Stubs", function() { return Stubs; });
/* harmony import */ var vm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var vm__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vm__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var traverse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var traverse__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(traverse__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(0);
/* harmony import */ var _babel_core__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_core__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_traverse__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2);
/* harmony import */ var _babel_traverse__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_traverse__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_4__);






const Sandbox = (fileName, state) => {
  const closures = {
    ...state,
  };
  const namespace = fileName
    .replace(/\./g, "_")
    .replace(/\-/g, "_")
    .split(path__WEBPACK_IMPORTED_MODULE_4___default.a.sep)
    .slice(1)
    .join("_");

  return {
    namespace,
    stubs: {},
    set: (key, val) => {
      closures[key] = val;
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
  _babel_traverse__WEBPACK_IMPORTED_MODULE_3___default()(node, {
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
  const { code } = Object(_babel_core__WEBPACK_IMPORTED_MODULE_2__["transformFromAstSync"])(ast, null, {
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
      _babel_traverse__WEBPACK_IMPORTED_MODULE_3___default()(ast, {
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
              params: path.node.params,
              body: path.node.body,
            };
            path.stop();
          }
        },
        // Property: function (path) {
        //   // console.log(path.key)
        // }
      });
      fn = fn && getIsolatedFn(fn);
      // console.log(fn)
      // const fn = traverse(ast).reduce(function (acc, x) {
      //   // if (x && x.type) console.log(x && x.type);
      //   // if (acc && acc.isIsolated) return acc;
      //   if (x && x.type === "VariableDeclarator" && x.id && x.id.name === key) {
      //     return getIsolatedFn(x.init);
      //   } else if (x && x.type === "Property" && x.key && x.key.name === key) {
      //     return getIsolatedFn(x.value);
      //   } else if (
      //     x &&
      //     x.type === "ObjectProperty" &&
      //     x.key &&
      //     x.key.name === key
      //   ) {
      //     return getIsolatedFn(x.value);
      //   } else if (
      //     x &&
      //     x.type === "MethodDefinition" &&
      //     x.key &&
      //     x.key.name === key
      //   ) {
      //     return getIsolatedFn(x.value);
      //   } else if (
      //     x &&
      //     x.type === "ClassMethod" &&
      //     x.key &&
      //     x.key.name === key
      //   ) {
      //     return getIsolatedFn({ ...x, type: "FunctionExpression" });
      //   } else if (
      //     x &&
      //     x.type === "ClassDeclaration" &&
      //     x.id &&
      //     x.id.type === "Identifier" &&
      //     x.id.name === key
      //   ) {
      //     return x;
      //   } else if (
      //     x &&
      //     x.type === "FunctionDeclaration" &&
      //     x.id &&
      //     x.id.type === "Identifier" &&
      //     x.id.name === key
      //   ) {
      //     return getIsolatedFn(x);
      //   } else if (
      //     x &&
      //     x.type === "FunctionExpression"
      //   ) {
      //     return getIsolatedFn(x);
      //   }
      //   return acc;
      // }, null);

      if (!fn) {
        throw new Error("Function not found");
      }
      var newAst = _babel_core__WEBPACK_IMPORTED_MODULE_2__["types"].program([fn]);
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
      return Object(_babel_core__WEBPACK_IMPORTED_MODULE_2__["transformFromAstSync"])(ast, null, {
        filename: sb.getFileName(),
        // filename: "fake",
      }).code;
    },
    print: function (logger = console.log) {
      const scriptSrc = Object(_babel_core__WEBPACK_IMPORTED_MODULE_2__["transformFromAstSync"])(ast, null, {
        filename: sb.getFileName(),
        // filename: "fake",
      }).code;
      logger(scriptSrc);
      return this;
    },
    fold: (key, replacement) => {
      sb.set(getReplacementKey(key), replacement);
      const fn = traverse__WEBPACK_IMPORTED_MODULE_1___default()(ast).map(function (x) {
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
  // console.log(fnAbsName)
  const sb = Sandbox(fnAbsName, sandbox);
  const { ast, code } = Object(_babel_core__WEBPACK_IMPORTED_MODULE_2__["transformFileSync"])(fnAbsName, {
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
  const { ast, code } = Object(_babel_core__WEBPACK_IMPORTED_MODULE_2__["transform"])(fnStr, {
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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(3), __webpack_require__(7)))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ])["default"];
});