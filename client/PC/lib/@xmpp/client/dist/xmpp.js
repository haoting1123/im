(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.XMPP = f()}})(function(){var define,module,exports;
"use strict";

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

var _$_interopRequireDefault_6 = _interopRequireDefault;

"use strict";

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var _$_objectWithoutPropertiesLoose_9 = _objectWithoutPropertiesLoose;

"use strict";

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var _$_inheritsLoose_5 = _inheritsLoose;

var _$setPrototypeOf_10 = {};
"use strict";

function _setPrototypeOf(o, p) {
  _$setPrototypeOf_10 = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

_$setPrototypeOf_10 = _setPrototypeOf;

var _$construct_2 = {};
"use strict";

/* removed: var _$setPrototypeOf_10 = require("./setPrototypeOf"); */;

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _$construct_2 = _construct = Reflect.construct;
  } else {
    _$construct_2 = _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _$setPrototypeOf_10(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

_$construct_2 = _construct;

var _$getPrototypeOf_4 = {};
"use strict";

function _getPrototypeOf(o) {
  _$getPrototypeOf_4 = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

_$getPrototypeOf_4 = _getPrototypeOf;

"use strict";

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

var _$_isNativeFunction_7 = _isNativeFunction;

var _$wrapNativeSuper_11 = {};
"use strict";

/* removed: var _$getPrototypeOf_4 = require("./getPrototypeOf"); */;

/* removed: var _$setPrototypeOf_10 = require("./setPrototypeOf"); */;

/* removed: var _$_isNativeFunction_7 = require("./isNativeFunction"); */;

/* removed: var _$construct_2 = require("./construct"); */;

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _$wrapNativeSuper_11 = _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_$_isNativeFunction_7(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _$construct_2(Class, arguments, _$getPrototypeOf_4(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _$setPrototypeOf_10(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

_$wrapNativeSuper_11 = _wrapNativeSuper;

'use strict';

/* removed: var _$_interopRequireDefault_6 = require("@babel/runtime/helpers/interopRequireDefault"); */;

var _inheritsLoose2 = _$_interopRequireDefault_6(_$_inheritsLoose_5);

var _wrapNativeSuper2 = _$_interopRequireDefault_6(_$wrapNativeSuper_11);

var XMPPError =
/*#__PURE__*/
function (_Error) {
  (0, _inheritsLoose2.default)(XMPPError, _Error);

  function XMPPError(condition, text, application) {
    var _this;

    _this = _Error.call(this, condition + (text ? " - " + text : '')) || this;
    _this.name = 'XMPPError';
    _this.condition = condition;
    _this.text = text;
    _this.application = application;
    return _this;
  }

  XMPPError.fromElement = function fromElement(element) {
    var _element$children = element.children,
        condition = _element$children[0],
        second = _element$children[1],
        third = _element$children[2];
    var text;
    var application;

    if (second) {
      if (second.is('text')) {
        text = second;
      } else if (second) {
        application = second;
      }

      if (third) application = third;
    }

    var error = new this(condition.name, text ? text.text() : '', application);
    error.element = element;
    return error;
  };

  return XMPPError;
}((0, _wrapNativeSuper2.default)(Error));

var _$XMPPError_33 = XMPPError;

'use strict';

/* removed: var _$_interopRequireDefault_6 = require("@babel/runtime/helpers/interopRequireDefault"); */;

var ___inheritsLoose2_32 = _$_interopRequireDefault_6(_$_inheritsLoose_5);

/* removed: var _$XMPPError_33 = require('@xmpp/error'); */; // https://xmpp.org/rfcs/rfc6120.html#streams-error


var StreamError =
/*#__PURE__*/
function (_XMPPError) {
  (0, ___inheritsLoose2_32.default)(StreamError, _XMPPError);

  function StreamError() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _XMPPError.call.apply(_XMPPError, [this].concat(args)) || this;
    _this.name = 'StreamError';
    return _this;
  }

  return StreamError;
}(_$XMPPError_33);

var _$StreamError_32 = StreamError;

"use strict";

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
var objectCreate = Object.create || objectCreatePolyfill;
var objectKeys = Object.keys || objectKeysPolyfill;
var bind = Function.prototype.bind || functionBindPolyfill;

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}

var _$EventEmitter_13 = EventEmitter; // Backwards-compat with node 0.10.x

EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.

var defaultMaxListeners = 10;
var hasDefineProperty;

try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', {
    value: 0
  });
  hasDefineProperty = o.x === 0;
} catch (err) {
  hasDefineProperty = false;
}

if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function get() {
      return defaultMaxListeners;
    },
    set: function set(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg) throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
} // Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.


EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n)) throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
}; // These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.


function emitNone(handler, isFn, self) {
  if (isFn) handler.call(self);else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) {
      listeners[i].call(self);
    }
  }
}

function emitOne(handler, isFn, self, arg1) {
  if (isFn) handler.call(self, arg1);else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) {
      listeners[i].call(self, arg1);
    }
  }
}

function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn) handler.call(self, arg1, arg2);else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) {
      listeners[i].call(self, arg1, arg2);
    }
  }
}

function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn) handler.call(self, arg1, arg2, arg3);else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) {
      listeners[i].call(self, arg1, arg2, arg3);
    }
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn) handler.apply(self, args);else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) {
      listeners[i].apply(self, args);
    }
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = type === 'error';
  events = this._events;
  if (events) doError = doError && events.error == null;else if (!doError) return false; // If there is no 'error' event listener then throw.

  if (doError) {
    if (arguments.length > 1) er = arguments[1];

    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }

    return false;
  }

  handler = events[type];
  if (!handler) return false;
  var isFn = typeof handler === 'function';
  len = arguments.length;

  switch (len) {
    // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;

    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;

    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;

    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
    // slower

    default:
      args = new Array(len - 1);

      for (i = 1; i < len; i++) {
        args[i - 1] = arguments[i];
      }

      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
  events = target._events;

  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object

      events = target._events;
    }

    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    } // Check for listener leak


    if (!existing.warned) {
      m = $getMaxListeners(target);

      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' "' + String(type) + '" listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;

        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;

    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);

      case 1:
        return this.listener.call(this.target, arguments[0]);

      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);

      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1], arguments[2]);

      default:
        var args = new Array(arguments.length);

        for (var i = 0; i < args.length; ++i) {
          args[i] = arguments[i];
        }

        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
}; // Emits a 'removeListener' event if and only if the listener was removed.


EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;
  if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
  events = this._events;
  if (!events) return this;
  list = events[type];
  if (!list) return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = objectCreate(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;
    if (position === 0) list.shift();else spliceOne(list, position);
    if (list.length === 1) events[type] = list[0];
    if (events.removeListener) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;
  events = this._events;
  if (!events) return this; // not listening for removeListener, no need to emit

  if (!events.removeListener) {
    if (arguments.length === 0) {
      this._events = objectCreate(null);
      this._eventsCount = 0;
    } else if (events[type]) {
      if (--this._eventsCount === 0) this._events = objectCreate(null);else delete events[type];
    }

    return this;
  } // emit removeListener for all listeners on all events


  if (arguments.length === 0) {
    var keys = objectKeys(events);
    var key;

    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }

    this.removeAllListeners('removeListener');
    this._events = objectCreate(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;
  if (!events) return [];
  var evlistener = events[type];
  if (!evlistener) return [];
  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;

function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
}; // About 1.5x faster than the two-arg version of Array#splice().


function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
    list[i] = list[k];
  }

  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);

  for (var i = 0; i < n; ++i) {
    copy[i] = arr[i];
  }

  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);

  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }

  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function F() {};

  F.prototype = proto;
  return new F();
}

function objectKeysPolyfill(obj) {
  var keys = [];

  for (var k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      keys.push(k);
    }
  }

  return k;
}

function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

'use strict';

var _$Deferred_35 = function Deferred() {
  var _this = this;

  this.promise = new Promise(function (resolve, reject) {
    _this.resolve = resolve;
    _this.reject = reject;
  });
};

'use strict';

/* removed: var _$_interopRequireDefault_6 = require("@babel/runtime/helpers/interopRequireDefault"); */;

var ___inheritsLoose2_36 = _$_interopRequireDefault_6(_$_inheritsLoose_5);

var ___wrapNativeSuper2_36 = _$_interopRequireDefault_6(_$wrapNativeSuper_11);

var _$TimeoutError_36 =
/*#__PURE__*/
function (_Error) {
  (0, ___inheritsLoose2_36.default)(TimeoutError, _Error);

  function TimeoutError(message) {
    var _this;

    _this = _Error.call(this, message) || this;
    _this.name = 'TimeoutError';
    return _this;
  }

  return TimeoutError;
}((0, ___wrapNativeSuper2_36.default)(Error));

'use strict';

var _$delay_37 = function delay(ms) {
  var timeout;
  var promise = new Promise(function (resolve) {
    timeout = setTimeout(resolve, ms);
  });
  promise.timeout = timeout;
  return promise;
};

'use strict';

/* removed: var _$TimeoutError_36 = require('./TimeoutError'); */;

var _$promise_38 = function promise(EE, event, rejectEvent, timeout) {
  if (rejectEvent === void 0) {
    rejectEvent = 'error';
  }

  return new Promise(function (resolve, reject) {
    var timeoutId;

    var cleanup = function cleanup() {
      clearTimeout(timeoutId);
      EE.removeListener(event, onEvent);
      EE.removeListener(rejectEvent, onError);
    };

    function onError(reason) {
      reject(reason);
      cleanup();
    }

    function onEvent(value) {
      resolve(value);
      cleanup();
    }

    EE.once(event, onEvent);

    if (rejectEvent) {
      EE.once(rejectEvent, onError);
    }

    if (timeout) {
      timeoutId = setTimeout(function () {
        cleanup();
        reject(new _$TimeoutError_36());
      }, timeout);
    }
  });
};

'use strict';

/* removed: var _$TimeoutError_36 = require('./TimeoutError'); */;

/* removed: var _$delay_37 = require('./delay'); */;

var _$timeout_39 = function timeout(promise, ms) {
  var promiseDelay = _$delay_37(ms);

  function cancelDelay() {
    clearTimeout(promiseDelay.timeout);
  }

  return Promise.race([promise.finally(cancelDelay), promiseDelay.then(function () {
    throw new _$TimeoutError_36();
  })]);
};

var _$events_34 = {};
'use strict';

/* removed: var _$timeout_39 = require('./lib/timeout'); */;

/* removed: var _$delay_37 = require('./lib/delay'); */;

/* removed: var _$TimeoutError_36 = require('./lib/TimeoutError'); */;

/* removed: var _$promise_38 = require('./lib/promise'); */;

/* removed: var _$EventEmitter_13 = require('events'); */;

/* removed: var _$Deferred_35 = require('./lib/Deferred'); */;

_$events_34.EventEmitter = _$EventEmitter_13;
_$events_34.timeout = _$timeout_39;
/* common-shake removed: exports.delay = */ void _$delay_37;
/* common-shake removed: exports.TimeoutError = */ void _$TimeoutError_36;
_$events_34.promise = _$promise_38;
_$events_34.Deferred = _$Deferred_35;

var _$escaping_45 = {};
'use strict';

_$escaping_45.detect = function (local) {
  if (!local) {
    return false;
  } // Remove all escaped sequences


  var tmp = local.replace(/\\20/g, '').replace(/\\22/g, '').replace(/\\26/g, '').replace(/\\27/g, '').replace(/\\2f/g, '').replace(/\\3a/g, '').replace(/\\3c/g, '').replace(/\\3e/g, '').replace(/\\40/g, '').replace(/\\5c/g, ''); // Detect if we have unescaped sequences

  var search = tmp.search(/\\| |"|&|'|\/|:|<|>|@/g);

  if (search === -1) {
    return false;
  }

  return true;
};
/**
 * Escape the local part of a JID.
 *
 * @see http://xmpp.org/extensions/xep-0106.html
 * @param String local local part of a jid
 * @return An escaped local part
 */


_$escaping_45.escape = function (local) {
  if (local === null) {
    return null;
  }

  return local.replace(/^\s+|\s+$/g, '').replace(/\\/g, '\\5c').replace(/ /g, '\\20').replace(/"/g, '\\22').replace(/&/g, '\\26').replace(/'/g, '\\27').replace(/\//g, '\\2f').replace(/:/g, '\\3a').replace(/</g, '\\3c').replace(/>/g, '\\3e').replace(/@/g, '\\40').replace(/\3a/g, "\x05c3a");
};
/**
 * Unescape a local part of a JID.
 *
 * @see http://xmpp.org/extensions/xep-0106.html
 * @param String local local part of a jid
 * @return unescaped local part
 */


_$escaping_45.unescape = function (local) {
  if (local === null) {
    return null;
  }

  return local.replace(/\\20/g, ' ').replace(/\\22/g, '"').replace(/\\26/g, '&').replace(/\\27/g, "'").replace(/\\2f/g, '/').replace(/\\3a/g, ':').replace(/\\3c/g, '<').replace(/\\3e/g, '>').replace(/\\40/g, '@').replace(/\\5c/g, '\\');
};

'use strict';

/* removed: var _$escaping_45 = require('./escaping'); */;
/**
 * JID implements
 * - XMPP addresses according to RFC6122
 * - XEP-0106: JID Escaping
 *
 * @see http://tools.ietf.org/html/rfc6122#section-2
 * @see http://xmpp.org/extensions/xep-0106.html
 */


var JID =
/*#__PURE__*/
function () {
  function JID(local, domain, resource) {
    if (typeof domain !== 'string' || !domain) {
      throw new TypeError("Invalid domain.");
    }

    this.setDomain(domain);
    this.setLocal(typeof local === 'string' ? local : '');
    this.setResource(typeof resource === 'string' ? resource : '');
  }

  var _proto = JID.prototype;

  _proto[Symbol.toPrimitive] = function (hint) {
    if (hint === 'number') {
      return NaN;
    }

    return this.toString();
  };

  _proto.toString = function toString(unescape) {
    var s = this._domain;

    if (this._local) {
      s = this.getLocal(unescape) + '@' + s;
    }

    if (this._resource) {
      s = s + '/' + this._resource;
    }

    return s;
  }
  /**
   * Convenience method to distinguish users
   * */
  ;

  _proto.bare = function bare() {
    if (this._resource) {
      return new JID(this._local, this._domain, null);
    }

    return this;
  }
  /**
   * Comparison function
   * */
  ;

  _proto.equals = function equals(other) {
    return this._local === other._local && this._domain === other._domain && this._resource === other._resource;
  }
  /**
   * http://xmpp.org/rfcs/rfc6122.html#addressing-localpart
   * */
  ;

  _proto.setLocal = function setLocal(local, escape) {
    escape = escape || _$escaping_45.detect(local);

    if (escape) {
      local = _$escaping_45.escape(local);
    }

    this._local = local && local.toLowerCase();
    return this;
  };

  _proto.getLocal = function getLocal(unescape) {
    unescape = unescape || false;
    var local = null;

    if (unescape) {
      local = _$escaping_45.unescape(this._local);
    } else {
      local = this._local;
    }

    return local;
  }
  /**
   * http://xmpp.org/rfcs/rfc6122.html#addressing-domain
   */
  ;

  _proto.setDomain = function setDomain(domain) {
    this._domain = domain.toLowerCase();
    return this;
  };

  _proto.getDomain = function getDomain() {
    return this._domain;
  }
  /**
   * http://xmpp.org/rfcs/rfc6122.html#addressing-resourcepart
   */
  ;

  _proto.setResource = function setResource(resource) {
    this._resource = resource;
    return this;
  };

  _proto.getResource = function getResource() {
    return this._resource;
  };

  return JID;
}();

Object.defineProperty(JID.prototype, 'local', {
  get: JID.prototype.getLocal,
  set: JID.prototype.setLocal
});
Object.defineProperty(JID.prototype, 'domain', {
  get: JID.prototype.getDomain,
  set: JID.prototype.setDomain
});
Object.defineProperty(JID.prototype, 'resource', {
  get: JID.prototype.getResource,
  set: JID.prototype.setResource
});
var _$JID_44 = JID;

'use strict';

/* removed: var _$JID_44 = require('../lib/JID'); */;

var _$parse_46 = function parse(s) {
  var local;
  var resource;
  var resourceStart = s.indexOf('/');

  if (resourceStart !== -1) {
    resource = s.substr(resourceStart + 1);
    s = s.substr(0, resourceStart);
  }

  var atStart = s.indexOf('@');

  if (atStart !== -1) {
    local = s.substr(0, atStart);
    s = s.substr(atStart + 1);
  }

  return new _$JID_44(local, s, resource);
};

var _$jid_43 = {};
'use strict';

/* removed: var _$_interopRequireDefault_6 = require("@babel/runtime/helpers/interopRequireDefault"); */;

var _construct2 = _$_interopRequireDefault_6(_$construct_2);

/* removed: var _$JID_44 = require('./lib/JID'); */;

/* removed: var _$escaping_45 = require('./lib/escaping'); */;

/* removed: var _$parse_46 = require('./lib/parse'); */;

function jid() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (!args[1] && !args[2]) {
    return _$parse_46.apply(void 0, args);
  }

  return (0, _construct2.default)(_$JID_44, args);
}

_$jid_43 = _$jid_43 = jid.bind();
_$jid_43.jid = jid;
_$jid_43.JID = _$JID_44;

_$jid_43.equal = function (a, b) {
  return a.equals(b);
};

_$jid_43.detectEscape = _$escaping_45.detect;
_$jid_43.escapeLocal = _$escaping_45.escape;
_$jid_43.unescapeLocal = _$escaping_45.unescape;
_$jid_43.parse = _$parse_46;

var _$escape_19 = {};
'use strict';

var escapeXMLTable = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&apos;'
};

function escapeXMLReplace(match) {
  return escapeXMLTable[match];
}

var unescapeXMLTable = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'"
};

function unescapeXMLReplace(match) {
  if (match[1] === '#') {
    var num;

    if (match[2] === 'x') {
      num = parseInt(match.slice(3), 16);
    } else {
      num = parseInt(match.slice(2), 10);
    } // https://www.w3.org/TR/xml/#NT-Char defines legal XML characters:
    // #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]


    if (num === 0x9 || num === 0xA || num === 0xD || num >= 0x20 && num <= 0xD7FF || num >= 0xE000 && num <= 0xFFFD || num >= 0x10000 && num <= 0x10FFFF) {
      return String.fromCodePoint(num);
    }

    throw new Error('Illegal XML character 0x' + num.toString(16));
  }

  if (unescapeXMLTable[match]) {
    return unescapeXMLTable[match] || match;
  }

  throw new Error('Illegal XML entity ' + match);
}

_$escape_19.escapeXML = function escapeXML(s) {
  return s.replace(/&|<|>|"|'/g, escapeXMLReplace);
};

_$escape_19.unescapeXML = function unescapeXML(s) {
  var result = '';
  var start = -1;
  var end = -1;
  var previous = 0;

  while ((start = s.indexOf('&', previous)) !== -1 && (end = s.indexOf(';', start + 1)) !== -1) {
    result = result + s.substring(previous, start) + unescapeXMLReplace(s.substring(start, end + 1));
    previous = end + 1;
  } // shortcut if loop never entered:
  // return the original string without creating new objects


  if (previous === 0) return s; // push the remaining characters

  result = result + s.substring(previous);
  return result;
};

_$escape_19.escapeXMLText = function escapeXMLText(s) {
  return s.replace(/&|<|>/g, escapeXMLReplace);
};

_$escape_19.unescapeXMLText = function unescapeXMLText(s) {
  return s.replace(/&(amp|#38|lt|#60|gt|#62);/g, unescapeXMLReplace);
};

'use strict';

var _$clone_17 = function clone(el) {
  var clone = new el.constructor(el.name, el.attrs);

  for (var i = 0; i < el.children.length; i++) {
    var child = el.children[i];
    clone.cnode(child.clone ? child.clone() : child);
  }

  return clone;
};

var _$equal_18 = {};
'use strict';

function nameEqual(a, b) {
  return a.name === b.name;
}

function attrsEqual(a, b) {
  var attrs = a.attrs;
  var keys = Object.keys(attrs);
  var length = keys.length;
  if (length !== Object.keys(b.attrs).length) return false;

  for (var i = 0, l = length; i < l; i++) {
    var key = keys[i];
    var value = attrs[key];

    if (value == null || b.attrs[key] == null) {
      // === null || undefined
      if (value !== b.attrs[key]) return false;
    } else if (value.toString() !== b.attrs[key].toString()) {
      return false;
    }
  }

  return true;
}

function childrenEqual(a, b) {
  var children = a.children;
  var length = children.length;
  if (length !== b.children.length) return false;

  for (var i = 0, l = length; i < l; i++) {
    var child = children[i];

    if (typeof child === 'string') {
      if (child !== b.children[i]) return false;
    } else {
      if (!child.equals(b.children[i])) return false;
    }
  }

  return true;
}

function equal(a, b) {
  if (!nameEqual(a, b)) return false;
  if (!attrsEqual(a, b)) return false;
  if (!childrenEqual(a, b)) return false;
  return true;
}

_$equal_18.name = nameEqual;
_$equal_18.attrs = attrsEqual;
_$equal_18.children = childrenEqual;
_$equal_18.equal = equal;

'use strict';

/* removed: var _$escape_19 = require('./escape'); */;

var escapeXML = _$escape_19.escapeXML;
var escapeXMLText = _$escape_19.escapeXMLText;

/* removed: var _$equal_18 = require('./equal'); */;

var __equal_16 = _$equal_18.equal;
var __nameEqual_16 = _$equal_18.name;
var __attrsEqual_16 = _$equal_18.attrs;
var __childrenEqual_16 = _$equal_18.children;

/* removed: var _$clone_17 = require('./clone'); */;
/**
 * Element
 *
 * Attributes are in the element.attrs object. Children is a list of
 * either other Elements or Strings for text content.
 **/


function Element(name, attrs) {
  this.name = name;
  this.parent = null;
  this.children = [];
  this.attrs = {};
  this.setAttrs(attrs);
}
/* Accessors */

/**
 * if (element.is('message', 'jabber:client')) ...
 **/


Element.prototype.is = function (name, xmlns) {
  return this.getName() === name && (!xmlns || this.getNS() === xmlns);
};
/* without prefix */


Element.prototype.getName = function () {
  if (this.name.indexOf(':') >= 0) {
    return this.name.substr(this.name.indexOf(':') + 1);
  } else {
    return this.name;
  }
};
/**
 * retrieves the namespace of the current element, upwards recursively
 **/


Element.prototype.getNS = function () {
  if (this.name.indexOf(':') >= 0) {
    var prefix = this.name.substr(0, this.name.indexOf(':'));
    return this.findNS(prefix);
  }

  return this.findNS();
};
/**
 * find the namespace to the given prefix, upwards recursively
 **/


Element.prototype.findNS = function (prefix) {
  if (!prefix) {
    /* default namespace */
    if (this.attrs.xmlns) {
      return this.attrs.xmlns;
    } else if (this.parent) {
      return this.parent.findNS();
    }
  } else {
    /* prefixed namespace */
    var attr = 'xmlns:' + prefix;

    if (this.attrs[attr]) {
      return this.attrs[attr];
    } else if (this.parent) {
      return this.parent.findNS(prefix);
    }
  }
};
/**
 * Recursiverly gets all xmlns defined, in the form of {url:prefix}
 **/


Element.prototype.getXmlns = function () {
  var namespaces = {};

  if (this.parent) {
    namespaces = this.parent.getXmlns();
  }

  for (var attr in this.attrs) {
    var m = attr.match('xmlns:?(.*)');

    if (this.attrs.hasOwnProperty(attr) && m) {
      namespaces[this.attrs[attr]] = m[1];
    }
  }

  return namespaces;
};

Element.prototype.setAttrs = function (attrs) {
  if (typeof attrs === 'string') {
    this.attrs.xmlns = attrs;
  } else if (attrs) {
    Object.keys(attrs).forEach(function (key) {
      this.attrs[key] = attrs[key];
    }, this);
  }
};
/**
 * xmlns can be null, returns the matching attribute.
 **/


Element.prototype.getAttr = function (name, xmlns) {
  if (!xmlns) {
    return this.attrs[name];
  }

  var namespaces = this.getXmlns();

  if (!namespaces[xmlns]) {
    return null;
  }

  return this.attrs[[namespaces[xmlns], name].join(':')];
};
/**
 * xmlns can be null
 **/


Element.prototype.getChild = function (name, xmlns) {
  return this.getChildren(name, xmlns)[0];
};
/**
 * xmlns can be null
 **/


Element.prototype.getChildren = function (name, xmlns) {
  var result = [];

  for (var i = 0; i < this.children.length; i++) {
    var child = this.children[i];

    if (child.getName && child.getName() === name && (!xmlns || child.getNS() === xmlns)) {
      result.push(child);
    }
  }

  return result;
};
/**
 * xmlns and recursive can be null
 **/


Element.prototype.getChildByAttr = function (attr, val, xmlns, recursive) {
  return this.getChildrenByAttr(attr, val, xmlns, recursive)[0];
};
/**
 * xmlns and recursive can be null
 **/


Element.prototype.getChildrenByAttr = function (attr, val, xmlns, recursive) {
  var result = [];

  for (var i = 0; i < this.children.length; i++) {
    var child = this.children[i];

    if (child.attrs && child.attrs[attr] === val && (!xmlns || child.getNS() === xmlns)) {
      result.push(child);
    }

    if (recursive && child.getChildrenByAttr) {
      result.push(child.getChildrenByAttr(attr, val, xmlns, true));
    }
  }

  if (recursive) {
    result = [].concat.apply([], result);
  }

  return result;
};

Element.prototype.getChildrenByFilter = function (filter, recursive) {
  var result = [];

  for (var i = 0; i < this.children.length; i++) {
    var child = this.children[i];

    if (filter(child)) {
      result.push(child);
    }

    if (recursive && child.getChildrenByFilter) {
      result.push(child.getChildrenByFilter(filter, true));
    }
  }

  if (recursive) {
    result = [].concat.apply([], result);
  }

  return result;
};

Element.prototype.getText = function () {
  var text = '';

  for (var i = 0; i < this.children.length; i++) {
    var child = this.children[i];

    if (typeof child === 'string' || typeof child === 'number') {
      text += child;
    }
  }

  return text;
};

Element.prototype.getChildText = function (name, xmlns) {
  var child = this.getChild(name, xmlns);
  return child ? child.getText() : null;
};
/**
 * Return all direct descendents that are Elements.
 * This differs from `getChildren` in that it will exclude text nodes,
 * processing instructions, etc.
 */


Element.prototype.getChildElements = function () {
  return this.getChildrenByFilter(function (child) {
    return child instanceof Element;
  });
};
/* Builder */

/** returns uppermost parent */


Element.prototype.root = function () {
  if (this.parent) {
    return this.parent.root();
  }

  return this;
};

Element.prototype.tree = Element.prototype.root;
/** just parent or itself */

Element.prototype.up = function () {
  if (this.parent) {
    return this.parent;
  }

  return this;
};
/** create child node and return it */


Element.prototype.c = function (name, attrs) {
  return this.cnode(new Element(name, attrs));
};

Element.prototype.cnode = function (child) {
  this.children.push(child);

  if (typeof child === 'object') {
    child.parent = this;
  }

  return child;
};
/** add text node and return element */


Element.prototype.t = function (text) {
  this.children.push(text);
  return this;
};
/* Manipulation */

/**
 * Either:
 *   el.remove(childEl)
 *   el.remove('author', 'urn:...')
 */


Element.prototype.remove = function (el, xmlns) {
  var filter;

  if (typeof el === 'string') {
    /* 1st parameter is tag name */
    filter = function filter(child) {
      return !(child.is && child.is(el, xmlns));
    };
  } else {
    /* 1st parameter is element */
    filter = function filter(child) {
      return child !== el;
    };
  }

  this.children = this.children.filter(filter);
  return this;
};

Element.prototype.clone = function () {
  return _$clone_17(this);
};

Element.prototype.text = function (val) {
  if (val && this.children.length === 1) {
    this.children[0] = val;
    return this;
  }

  return this.getText();
};

Element.prototype.attr = function (attr, val) {
  if (typeof val !== 'undefined' || val === null) {
    if (!this.attrs) {
      this.attrs = {};
    }

    this.attrs[attr] = val;
    return this;
  }

  return this.attrs[attr];
};
/* Serialization */


Element.prototype.toString = function () {
  var s = '';
  this.write(function (c) {
    s += c;
  });
  return s;
};

Element.prototype.toJSON = function () {
  return {
    name: this.name,
    attrs: this.attrs,
    children: this.children.map(function (child) {
      return child && child.toJSON ? child.toJSON() : child;
    })
  };
};

Element.prototype._addChildren = function (writer) {
  writer('>');

  for (var i = 0; i < this.children.length; i++) {
    var child = this.children[i];
    /* Skip null/undefined */

    if (child || child === 0) {
      if (child.write) {
        child.write(writer);
      } else if (typeof child === 'string') {
        writer(escapeXMLText(child));
      } else if (child.toString) {
        writer(escapeXMLText(child.toString(10)));
      }
    }
  }

  writer('</');
  writer(this.name);
  writer('>');
};

Element.prototype.write = function (writer) {
  writer('<');
  writer(this.name);

  for (var k in this.attrs) {
    var v = this.attrs[k];

    if (v != null) {
      // === null || undefined
      writer(' ');
      writer(k);
      writer('="');

      if (typeof v !== 'string') {
        v = v.toString();
      }

      writer(escapeXML(v));
      writer('"');
    }
  }

  if (this.children.length === 0) {
    writer('/>');
  } else {
    this._addChildren(writer);
  }
};

Element.prototype.nameEquals = function (el) {
  return __nameEqual_16(this, el);
};

Element.prototype.attrsEquals = function (el) {
  return __attrsEqual_16(this, el);
};

Element.prototype.childrenEquals = function (el) {
  return __childrenEqual_16(this, el);
};

Element.prototype.equals = function (el) {
  return __equal_16(this, el);
};

var _$Element_16 = Element;

'use strict';

/* removed: var _$_interopRequireDefault_6 = require("@babel/runtime/helpers/interopRequireDefault"); */;

var ___inheritsLoose2_71 = _$_interopRequireDefault_6(_$_inheritsLoose_5);

/* removed: var _$Element_16 = require('ltx/lib/Element'); */;

var __Element_71 =
/*#__PURE__*/
function (_Element2) {
  (0, ___inheritsLoose2_71.default)(Element, _Element2);

  function Element() {
    return _Element2.apply(this, arguments) || this;
  }

  var _proto = Element.prototype;

  _proto.setAttrs = function setAttrs(attrs) {
    if (typeof attrs === 'string') {
      this.attrs.xmlns = attrs;
    } else if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var val = attrs[key];
        if (val !== undefined && val !== null) this.attrs[key.toString()] = val.toString();
      }, this);
    }
  };

  _proto.append = function append(nodes) {
    var _this = this;

    nodes = Array.isArray(nodes) ? nodes : [nodes];
    nodes.forEach(function (node) {
      _this.children.push(node);

      if (typeof node === 'object') {
        node.parent = _this;
      }
    });
    return this;
  };

  _proto.prepend = function prepend(nodes) {
    var _this2 = this;

    nodes = Array.isArray(nodes) ? nodes : [nodes];
    nodes.forEach(function (node) {
      _this2.children.unshift(node);

      if (typeof node === 'object') {
        node.parent = _this2;
      }
    });
    return this;
  };

  return Element;
}(_$Element_16);

var _$Element_71 = __Element_71;

"use strict";

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var _$_assertThisInitialized_1 = _assertThisInitialized;

var _$inherits_browser_14 = {};
"use strict";

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  _$inherits_browser_14 = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  _$inherits_browser_14 = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;

    var TempCtor = function TempCtor() {};

    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  };
}

var _$ltx_20 = {};
'use strict';

/* removed: var _$inherits_browser_14 = require('inherits'); */;

var __EventEmitter_20 = _$EventEmitter_13.EventEmitter;

var unescapeXML = _$escape_19.unescapeXML;

var STATE_TEXT = 0;
var STATE_IGNORE_COMMENT = 1;
var STATE_IGNORE_INSTRUCTION = 2;
var STATE_TAG_NAME = 3;
var STATE_TAG = 4;
var STATE_ATTR_NAME = 5;
var STATE_ATTR_EQ = 6;
var STATE_ATTR_QUOT = 7;
var STATE_ATTR_VALUE = 8;
var STATE_CDATA = 9;

var SaxLtx = _$ltx_20 = function SaxLtx() {
  __EventEmitter_20.call(this);
  var state = STATE_TEXT;
  var remainder;
  var tagName;
  var attrs;
  var endTag;
  var selfClosing;
  var attrQuote;
  var attrQuoteChar;
  var recordStart = 0;
  var attrName;

  this._handleTagOpening = function (endTag, tagName, attrs) {
    if (!endTag) {
      this.emit('startElement', tagName, attrs);

      if (selfClosing) {
        this.emit('endElement', tagName);
      }
    } else {
      this.emit('endElement', tagName);
    }
  };

  this.write = function (data) {
    if (typeof data !== 'string') {
      data = data.toString();
    }

    var pos = 0;
    /* Anything from previous write()? */

    if (remainder) {
      data = remainder + data;
      pos += remainder.length;
      remainder = null;
    }

    function endRecording() {
      if (typeof recordStart === 'number') {
        var recorded = data.substring(recordStart, pos);
        recordStart = undefined;
        return recorded;
      }
    }

    for (; pos < data.length; pos++) {
      if (state === STATE_TEXT) {
        // if we're looping through text, fast-forward using indexOf to
        // the next '<' character
        var lt = data.indexOf('<', pos);

        if (lt !== -1 && pos !== lt) {
          pos = lt;
        }
      } else if (state === STATE_ATTR_VALUE) {
        // if we're looping through an attribute, fast-forward using
        // indexOf to the next end quote character
        var quot = data.indexOf(attrQuoteChar, pos);

        if (quot !== -1) {
          pos = quot;
        }
      } else if (state === STATE_IGNORE_COMMENT) {
        // if we're looping through a comment, fast-forward using
        // indexOf to the first end-comment character
        var endcomment = data.indexOf('-->', pos);

        if (endcomment !== -1) {
          pos = endcomment + 2; // target the '>' character
        }
      }

      var c = data.charCodeAt(pos);

      switch (state) {
        case STATE_TEXT:
          if (c === 60
          /* < */
          ) {
              var text = endRecording();

              if (text) {
                this.emit('text', unescapeXML(text));
              }

              state = STATE_TAG_NAME;
              recordStart = pos + 1;
              attrs = {};
            }

          break;

        case STATE_CDATA:
          if (c === 93
          /* ] */
          && data.substr(pos + 1, 2) === ']>') {
            var cData = endRecording();

            if (cData) {
              this.emit('text', cData);
            }

            state = STATE_IGNORE_COMMENT;
          }

          break;

        case STATE_TAG_NAME:
          if (c === 47
          /* / */
          && recordStart === pos) {
            recordStart = pos + 1;
            endTag = true;
          } else if (c === 33
          /* ! */
          ) {
              if (data.substr(pos + 1, 7) === '[CDATA[') {
                recordStart = pos + 8;
                state = STATE_CDATA;
              } else {
                recordStart = undefined;
                state = STATE_IGNORE_COMMENT;
              }
            } else if (c === 63
          /* ? */
          ) {
              recordStart = undefined;
              state = STATE_IGNORE_INSTRUCTION;
            } else if (c <= 32 || c === 47
          /* / */
          || c === 62
          /* > */
          ) {
              tagName = endRecording();
              pos--;
              state = STATE_TAG;
            }

          break;

        case STATE_IGNORE_COMMENT:
          if (c === 62
          /* > */
          ) {
              var prevFirst = data.charCodeAt(pos - 1);
              var prevSecond = data.charCodeAt(pos - 2);

              if (prevFirst === 45
              /* - */
              && prevSecond === 45
              /* - */
              || prevFirst === 93
              /* ] */
              && prevSecond === 93
              /* ] */
              ) {
                state = STATE_TEXT;
              }
            }

          break;

        case STATE_IGNORE_INSTRUCTION:
          if (c === 62
          /* > */
          ) {
              var prev = data.charCodeAt(pos - 1);

              if (prev === 63
              /* ? */
              ) {
                  state = STATE_TEXT;
                }
            }

          break;

        case STATE_TAG:
          if (c === 62
          /* > */
          ) {
              this._handleTagOpening(endTag, tagName, attrs);

              tagName = undefined;
              attrs = undefined;
              endTag = undefined;
              selfClosing = undefined;
              state = STATE_TEXT;
              recordStart = pos + 1;
            } else if (c === 47
          /* / */
          ) {
              selfClosing = true;
            } else if (c > 32) {
            recordStart = pos;
            state = STATE_ATTR_NAME;
          }

          break;

        case STATE_ATTR_NAME:
          if (c <= 32 || c === 61
          /* = */
          ) {
              attrName = endRecording();
              pos--;
              state = STATE_ATTR_EQ;
            }

          break;

        case STATE_ATTR_EQ:
          if (c === 61
          /* = */
          ) {
              state = STATE_ATTR_QUOT;
            }

          break;

        case STATE_ATTR_QUOT:
          if (c === 34
          /* " */
          || c === 39
          /* ' */
          ) {
              attrQuote = c;
              attrQuoteChar = c === 34 ? '"' : "'";
              state = STATE_ATTR_VALUE;
              recordStart = pos + 1;
            }

          break;

        case STATE_ATTR_VALUE:
          if (c === attrQuote) {
            var value = unescapeXML(endRecording());
            attrs[attrName] = value;
            attrName = undefined;
            state = STATE_TAG;
          }

          break;
      }
    }

    if (typeof recordStart === 'number' && recordStart <= data.length) {
      remainder = data.slice(recordStart);
      recordStart = 0;
    }
  };
};

_$inherits_browser_14(SaxLtx, __EventEmitter_20);

SaxLtx.prototype.end = function (data) {
  if (data) {
    this.write(data);
  }
  /* Uh, yeah */


  this.write = function () {};
};

'use strict';

/* removed: var _$_interopRequireDefault_6 = require("@babel/runtime/helpers/interopRequireDefault"); */;

var _assertThisInitialized2 = _$_interopRequireDefault_6(_$_assertThisInitialized_1);

var ___inheritsLoose2_72 = _$_interopRequireDefault_6(_$_inheritsLoose_5);

var ___wrapNativeSuper2_72 = _$_interopRequireDefault_6(_$wrapNativeSuper_11);

/* removed: var _$ltx_20 = require('ltx/lib/parsers/ltx'); */;

/* removed: var _$Element_71 = require('./Element'); */;

/* removed: var _$EventEmitter_13 = require('events'); */;

var XMLError =
/*#__PURE__*/
function (_Error) {
  (0, ___inheritsLoose2_72.default)(XMLError, _Error);

  function XMLError() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Error.call.apply(_Error, [this].concat(args)) || this;
    _this.name = 'XMLError';
    return _this;
  }

  return XMLError;
}((0, ___wrapNativeSuper2_72.default)(Error));

var Parser =
/*#__PURE__*/
function (_EventEmitter) {
  (0, ___inheritsLoose2_72.default)(Parser, _EventEmitter);

  function Parser() {
    var _this2;

    _this2 = _EventEmitter.call(this) || this;
    var parser = new _$ltx_20();
    _this2.root = null;
    _this2.cursor = null;
    parser.on('startElement', _this2.onStartElement.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this2))));
    parser.on('endElement', _this2.onEndElement.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this2))));
    parser.on('text', _this2.onText.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this2))));
    _this2.parser = parser;
    return _this2;
  }

  var _proto = Parser.prototype;

  _proto.onStartElement = function onStartElement(name, attrs) {
    var element = new _$Element_71(name, attrs);
    var root = this.root,
        cursor = this.cursor;

    if (!root) {
      this.root = element;
      this.emit('start', element);
    } else if (cursor !== root) {
      cursor.append(element);
    }

    this.cursor = element;
  };

  _proto.onEndElement = function onEndElement(name) {
    var root = this.root,
        cursor = this.cursor;

    if (name !== cursor.name) {
      // <foo></bar>
      this.emit('error', new XMLError(cursor.name + " must be closed."));
      return;
    }

    if (cursor === root) {
      this.emit('end', root);
      return;
    }

    if (!cursor.parent) {
      if (cursor.name.startsWith('stream:')) {
        cursor.attrs['xmlns:stream'] = root.attrs['xmlns:stream'];
      }

      this.emit('element', cursor);
      this.cursor = root;
      return;
    }

    this.cursor = cursor.parent;
  };

  _proto.onText = function onText(str) {
    var cursor = this.cursor;

    if (!cursor) {
      this.emit('error', new XMLError(str + " must be a child."));
      return;
    }

    cursor.t(str);
  };

  _proto.write = function write(data) {
    this.parser.write(data);
  };

  _proto.end = function end(data) {
    if (data) {
      this.parser.write(data);
    }
  };

  return Parser;
}(_$EventEmitter_13);

Parser.XMLError = XMLError;
var _$Parser_72 = Parser;

'use strict';

/* removed: var _$Element_71 = require('./Element'); */;

function append(el, child) {
  if (child instanceof _$Element_71) {
    el.append(child);
  } else if (Array.isArray(child)) {
    child.forEach(function (c) {
      return append(el, c);
    });
  } else if (child !== null && child !== undefined) {
    el.append(String(child));
  }
}

function x(name, attrs) {
  var el = new _$Element_71(name, attrs);

  for (var i = 0; i < (arguments.length <= 2 ? 0 : arguments.length - 2); i++) {
    append(el, i + 2 < 2 || arguments.length <= i + 2 ? undefined : arguments[i + 2]);
  }

  return el;
}

var _$x_74 = x;

var _$xml_70 = {};
'use strict';

/* removed: var _$x_74 = require('./lib/x'); */;

/* removed: var _$Element_71 = require('./lib/Element'); */;

/* removed: var _$Parser_72 = require('./lib/Parser'); */;

var __escapeXML_70 = _$escape_19.escapeXML,
    __unescapeXML_70 = _$escape_19.unescapeXML,
    __escapeXMLText_70 = _$escape_19.escapeXMLText,
    unescapeXMLText = _$escape_19.unescapeXMLText;

function xml() {
  return _$x_74.apply(void 0, arguments);
}

_$xml_70 = _$xml_70 = xml;
Object.assign(_$xml_70, {
  x: _$x_74,
  Element: _$Element_71,
  Parser: _$Parser_72,
  escapeXML: __escapeXML_70,
  unescapeXML: __unescapeXML_70,
  escapeXMLText: __escapeXMLText_70,
  unescapeXMLText: unescapeXMLText
});

var _$connection_31 = {};
'use strict';

/* removed: var _$_interopRequireDefault_6 = require("@babel/runtime/helpers/interopRequireDefault"); */;

var ___inheritsLoose2_31 = _$_interopRequireDefault_6(_$_inheritsLoose_5);

// Awaits on a value that may or may not be a Promise (equivalent to the await keyword in ES2015, with continuations passed explicitly)
function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
} // Awaits on a value that may or may not be a Promise, then ignores it


// Proceeds after a value has resolved, or proceeds immediately if the value is not thenable
function _continueIgnored(value) {
  if (value && value.then) {
    return value.then(_empty);
  }
} // Asynchronously iterate through an object that has a length property, passing the index as the first argument to the callback (even as the length property changes)


// Converts argument to a function that always returns a Promise
function _async(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

// Proceeds after a value has resolved, or proceeds immediately if the value is not thenable
function _continue(value, then) {
  return value && value.then ? value.then(then) : then(value);
}

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
} // Asynchronously await a promise and pass the result to a finally continuation


function _awaitIgnored(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(_empty) : Promise.resolve();
  }
}

// Empty function to implement break and other control flow that ignores asynchronous results
function _empty() {} // Sentinel value for early returns in generators 


var __EventEmitter_31 = _$events_34.EventEmitter,
    __promise_31 = _$events_34.promise;

/* removed: var _$jid_43 = require('@xmpp/jid'); */;

/* removed: var _$xml_70 = require('@xmpp/xml'); */;

/* removed: var _$StreamError_32 = require('./lib/StreamError'); */;

var NS_STREAM = 'urn:ietf:params:xml:ns:xmpp-streams';

function socketConnect(socket) {
  for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }

  return new Promise(function (resolve, reject) {
    function onError(err) {
      socket.removeListener('connect', onConnect);
      reject(err);
    }

    function onConnect(value) {
      socket.removeListener('error', onError);
      resolve(value);
    }

    socket.once('error', onError);
    socket.once('connect', onConnect);
    socket.connect.apply(socket, params);
  });
}

var Connection =
/*#__PURE__*/
function (_EventEmitter) {
  (0, ___inheritsLoose2_31.default)(Connection, _EventEmitter);

  function Connection(options) {
    var _this;

    if (options === void 0) {
      options = {};
    }

    _this = _EventEmitter.call(this) || this;
    _this.jid = null;
    _this.timeout = 2000;
    _this.options = options;
    _this.socketListeners = Object.create(null);
    _this.parserListeners = Object.create(null);
    _this.status = 'offline';
    _this.socket = null;
    _this.parser = null;
    return _this;
  }

  var _proto = Connection.prototype;

  _proto._reset = function _reset() {
    this.jid = null;
    this.status = 'offline';

    this._detachSocket();

    this._detachParser();
  };

  _proto._streamError = _async(function (condition) {
    var _this2 = this;

    return _continue(_catch(function () {
      return _awaitIgnored(_this2.send( // prettier-ignore
      _$xml_70('stream:error', {}, [_$xml_70(condition, {
        xmlns: NS_STREAM
      })])));
    }, _empty), function () {
      return _this2._end();
    });
  });
  _proto._onData = _async(function (data) {
    var _this3 = this;

    var str = data.toString('utf8');

    _this3.emit('input', str);

    return _continueIgnored(_catch(function () {
      return _awaitIgnored(_this3.parser.write(str));
    }, function () {
      // https://xmpp.org/rfcs/rfc6120.html#streams-error-conditions-bad-format
      // "This error can be used instead of the more specific XML-related errors,
      // such as <bad-namespace-prefix/>, <invalid-xml/>, <not-well-formed/>, <restricted-xml/>,
      // and <unsupported-encoding/>. However, the more specific errors are RECOMMENDED."
      try {
        _this3._streamError('bad-format');
      } catch (err) {}
    }));
  });

  _proto._attachSocket = function _attachSocket(socket) {
    var _this4 = this;

    var sock = this.socket = socket;
    var listeners = this.socketListeners;

    listeners.data = function (data) {
      _this4._onData(data);
    };

    listeners.close = function (dirty, event) {
      _this4._reset();

      _this4._status('disconnect', {
        clean: !dirty,
        event: event
      });
    };

    listeners.connect = function () {
      _this4._status('connect');
    };

    listeners.error = function (error) {
      _this4.emit('error', error);
    };

    sock.on('close', listeners.close);
    sock.on('data', listeners.data);
    sock.on('error', listeners.error);
    sock.on('connect', listeners.connect);
  };

  _proto._detachSocket = function _detachSocket() {
    var socketListeners = this.socketListeners,
        socket = this.socket;
    Object.getOwnPropertyNames(socketListeners).forEach(function (k) {
      socket.removeListener(k, socketListeners[k]);
      delete socketListeners[k];
    });
    this.socket = null;
    return socket;
  };

  _proto._onElement = function _onElement(element) {
    this.emit('element', element);
    this.emit(this.isStanza(element) ? 'stanza' : 'nonza', element); // https://xmpp.org/rfcs/rfc6120.html#streams-error

    if (element.name !== 'stream:error') return;
    this.emit('error', _$StreamError_32.fromElement(element)); // "Stream Errors Are Unrecoverable"
    // "The entity that receives the stream error then SHALL close the stream"

    this._end();
  };

  _proto._attachParser = function _attachParser(p) {
    var _this5 = this;

    var parser = this.parser = p;
    var listeners = this.parserListeners;

    listeners.element = function (element) {
      _this5._onElement(element);
    };

    listeners.error = function (error) {
      _this5._detachParser();

      _this5.emit('error', error);
    };

    listeners.end = function (element) {
      _this5._detachParser();

      _this5._status('close', element);
    };

    parser.on('error', listeners.error);
    parser.on('element', listeners.element);
    parser.on('end', listeners.end);
  };

  _proto._detachParser = function _detachParser() {
    var _this6 = this;

    var listeners = this.parserListeners;
    Object.getOwnPropertyNames(listeners).forEach(function (k) {
      _this6.parser.removeListener(k, listeners[k]);

      delete listeners[k];
    });
    this.parser = null;
  };

  _proto._jid = function _jid(id) {
    this.jid = _$jid_43(id);
    return this.jid;
  };

  _proto._status = function _status(status) {
    this.status = status;

    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    this.emit.apply(this, ['status', status].concat(args));
    this.emit.apply(this, [status].concat(args));
  };

  _proto._end = _async(function () {
    var _this7 = this;

    var el;
    return _continue(_catch(function () {
      return _await(_this7.close(), function (_this7$close) {
        el = _this7$close;
      });
    }, _empty), function () {
      return _continue(_catch(function () {
        return _awaitIgnored(_this7.disconnect());
      }, _empty), function () {
        return el;
      });
    });
  })
  /**
   * Opens the socket then opens the stream
   */
  ;
  _proto.start = _async(function () {
    var _this8 = this;

    if (_this8.status !== 'offline') {
      throw new Error('Connection is not offline');
    }

    var _this8$options = _this8.options,
        service = _this8$options.service,
        domain = _this8$options.domain,
        lang = _this8$options.lang;
    return _await(_this8.connect(service), function () {
      var promiseOnline = __promise_31(_this8, 'online');
      return _await(_this8.open({
        domain: domain,
        lang: lang
      }), function () {
        return promiseOnline;
      });
    });
  })
  /**
   * Connects the socket
   */
  // eslint-disable-next-line require-await
  ;
  _proto.connect = _async(function (service) {
    var _this9 = this;

    _this9._status('connecting');

    _this9._attachSocket(new _this9.Socket()); // The 'connect' status is set by the socket 'connect' listener


    return socketConnect(_this9.socket, _this9.socketParameters(service));
  })
  /**
   * Disconnects the socket
   * https://xmpp.org/rfcs/rfc6120.html#streams-close
   * https://tools.ietf.org/html/rfc7395#section-3.6
   */
  ;
  _proto.disconnect = _async(function (timeout) {
    var _this10 = this;

    if (timeout === void 0) {
      timeout = _this10.timeout;
    }

    if (_this10.socket) _this10._status('disconnecting');

    _this10.socket.end(); // The 'disconnect' status is set by the socket 'close' listener


    return _awaitIgnored(__promise_31(_this10.socket, 'close', 'error', timeout));
  })
  /**
   * Opens the stream
   */
  ;
  _proto.open = _async(function (options) {
    var _this11 = this;

    _this11._status('opening');

    if (typeof options === 'string') {
      options = {
        domain: options
      };
    }

    var _options = options,
        domain = _options.domain,
        lang = _options.lang,
        _options$timeout = _options.timeout,
        timeout = _options$timeout === void 0 ? _this11.timeout : _options$timeout;

    var headerElement = _this11.headerElement();

    headerElement.attrs.to = domain;
    headerElement.attrs['xml:lang'] = lang;

    _this11._attachParser(new _this11.Parser());

    return _await(_this11.write(_this11.header(headerElement)), function () {
      return _await(__promise_31(_this11.parser, 'start', 'error', timeout), function (el) {
        _this11._status('open', el);
      });
    });
  })
  /**
   * Closes the stream then closes the socket
   * https://xmpp.org/rfcs/rfc6120.html#streams-close
   * https://tools.ietf.org/html/rfc7395#section-3.6
   */
  ;
  _proto.stop = _async(function () {
    var _this12 = this;

    return _await(_this12._end(), function (el) {
      if (_this12.status !== 'offline') _this12._status('offline', el);
      return el;
    });
  })
  /**
   * Closes the stream and wait for the server to close it
   * https://xmpp.org/rfcs/rfc6120.html#streams-close
   * https://tools.ietf.org/html/rfc7395#section-3.6
   */
  ;
  _proto.close = _async(function (timeout) {
    var _this13 = this;

    if (timeout === void 0) {
      timeout = _this13.timeout;
    }

    var p = Promise.all([__promise_31(_this13.parser, 'end', 'error', timeout), _this13.write(_this13.footer(_this13.footerElement()))]);
    if (_this13.parser && _this13.socket) _this13._status('closing');
    return _await(p, function (_ref) {
      var el = _ref[0];
      return el; // The 'close' status is set by the parser 'end' listener
    });
  })
  /**
   * Restart the stream
   * https://xmpp.org/rfcs/rfc6120.html#streams-negotiation-restart
   */
  // eslint-disable-next-line require-await
  ;
  _proto.restart = _async(function () {
    var _this14 = this;

    _this14._detachParser();

    var _this14$options = _this14.options,
        domain = _this14$options.domain,
        lang = _this14$options.lang;
    return _this14.open({
      domain: domain,
      lang: lang
    });
  }) // eslint-disable-next-line require-await
  ;
  _proto.send = _async(function (element) {
    var _this15 = this;

    _this15.emit('outgoing', element);

    return _await(_this15.write(element), function () {
      _this15.emit('send', element);
    });
  });

  _proto.sendReceive = function sendReceive(element, timeout) {
    if (timeout === void 0) {
      timeout = this.timeout;
    }

    return Promise.all([this.send(element), __promise_31(this, 'element', 'error', timeout)]).then(function (_ref2) {
      var el = _ref2[1];
      return el;
    });
  };

  _proto.write = function write(data) {
    var _this16 = this;

    return new Promise(function (resolve, reject) {
      // https://xmpp.org/rfcs/rfc6120.html#streams-close
      // "Refrain from sending any further data over its outbound stream to the other entity"
      if (_this16.status === 'closing') {
        reject(new Error('Connection is closing'));
        return;
      }

      var str = data.toString('utf8');

      _this16.socket.write(str, function (err) {
        if (err) {
          return reject(err);
        }

        _this16.emit('output', str);

        resolve();
      });
    });
  };

  _proto.isStanza = function isStanza(element) {
    var name = element.name;
    var NS = element.attrs.xmlns;
    return (// This.online && FIXME
      (NS ? NS === this.NS : true) && (name === 'iq' || name === 'message' || name === 'presence')
    );
  };

  _proto.isNonza = function isNonza(element) {
    return !this.isStanza(element);
  } // Override
  ;

  _proto.header = function header(el) {
    return el.toString();
  } // Override
  ;

  _proto.headerElement = function headerElement() {
    return new _$xml_70.Element('', {
      version: '1.0',
      xmlns: this.NS
    });
  } // Override
  ;

  _proto.footer = function footer(el) {
    return el.toString();
  } // Override
  ;

  _proto.footerElement = function footerElement() {} // Override
  ;

  _proto.socketParameters = function socketParameters() {};

  return Connection;
}(__EventEmitter_31); // Overrirde


Connection.prototype.NS = '';
Connection.prototype.Socket = null;
Connection.prototype.Parser = null;
_$connection_31 = Connection;
_$connection_31.socketConnect = socketConnect;

'use strict';

/* removed: var _$_interopRequireDefault_6 = require("@babel/runtime/helpers/interopRequireDefault"); */;

var ___inheritsLoose2_28 = _$_interopRequireDefault_6(_$_inheritsLoose_5);

/* removed: var _$connection_31 = require('@xmpp/connection'); */;

var Client =
/*#__PURE__*/
function (_Connection) {
  (0, ___inheritsLoose2_28.default)(Client, _Connection);

  function Client(options) {
    var _this;

    _this = _Connection.call(this, options) || this;
    _this.transports = [];
    return _this;
  }

  var _proto = Client.prototype;

  _proto.send = function send(element) {
    var _Connection$prototype;

    if (!element.attrs.xmlns && (element.is('iq') || element.is('message') || element.is('presence'))) {
      element.attrs.xmlns = 'jabber:client'; // FIXME no need for TCP/TLS transports
    }

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return (_Connection$prototype = _Connection.prototype.send).call.apply(_Connection$prototype, [this, element].concat(args));
  };

  _proto._findTransport = function _findTransport(service) {
    return this.transports.find(function (Transport) {
      try {
        return Transport.prototype.socketParameters(service) !== undefined;
      } catch (err) {
        return false;
      }
    });
  };

  _proto.connect = function connect(service) {
    var Transport = this._findTransport(service);

    if (!Transport) {
      throw new Error('No compatible connection method found.');
    }

    this.Transport = Transport;
    this.Socket = Transport.prototype.Socket;
    this.Parser = Transport.prototype.Parser;
    return _Connection.prototype.connect.call(this, service);
  };

  _proto.socketParameters = function socketParameters() {
    var _this$Transport$proto;

    return (_this$Transport$proto = this.Transport.prototype).socketParameters.apply(_this$Transport$proto, arguments);
  };

  _proto.header = function header() {
    var _this$Transport$proto2;

    return (_this$Transport$proto2 = this.Transport.prototype).header.apply(_this$Transport$proto2, arguments);
  };

  _proto.headerElement = function headerElement() {
    var _this$Transport$proto3;

    return (_this$Transport$proto3 = this.Transport.prototype).headerElement.apply(_this$Transport$proto3, arguments);
  };

  _proto.footer = function footer() {
    var _this$Transport$proto4;

    return (_this$Transport$proto4 = this.Transport.prototype).footer.apply(_this$Transport$proto4, arguments);
  };

  _proto.footerElement = function footerElement() {
    var _this$Transport$proto5;

    return (_this$Transport$proto5 = this.Transport.prototype).footerElement.apply(_this$Transport$proto5, arguments);
  };

  return Client;
}(_$connection_31);

Client.prototype.NS = 'jabber:client';
var _$Client_28 = Client;

var _$clientCore_27 = {};
'use strict';

/* removed: var _$Client_28 = require('./lib/Client'); */;

/* removed: var _$xml_70 = require('@xmpp/xml'); */;

/* removed: var _$jid_43 = require('@xmpp/jid'); */;

_$clientCore_27.Client = _$Client_28;
_$clientCore_27.xml = _$xml_70;
_$clientCore_27.jid = _$jid_43;

'use strict';

var _$getDomain_29 = function getDomain(service) {
  var domain = service.split('://')[1] || service;
  return domain.split(':')[0].split('/')[0];
};

'use strict';
/**
 * References
 * https://xmpp.org/rfcs/rfc6120.html#stanzas-semantics-iq
 * https://xmpp.org/rfcs/rfc6120.html#stanzas-error
 */

// Converts argument to a function that always returns a Promise
function ___async_41(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
} // Awaits on a value that may or may not be a Promise (equivalent to the await keyword in ES2015, with continuations passed explicitly)


// Proceeds after a value has resolved, or proceeds immediately if the value is not thenable
function ___continue_41(value, then) {
  return value && value.then ? value.then(then) : then(value);
} // Proceeds after a value has resolved, or proceeds immediately if the value is not thenable


// Asynchronously call a function and send errors to recovery continuation
function ___catch_41(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
} // Asynchronously await a promise and pass the result to a finally continuation


// Asynchronously call a function and pass the result to explicitly passed continuations
function _call(body, then, direct) {
  if (direct) {
    return then ? then(body()) : body();
  }

  try {
    var result = Promise.resolve(body());
    return then ? result.then(then) : result;
  } catch (e) {
    return Promise.reject(e);
  }
} // Asynchronously call a function and swallow the result


/* removed: var _$xml_70 = require('@xmpp/xml'); */;

var NS_STANZA = 'urn:ietf:params:xml:ns:xmpp-stanzas';

function isQuery(_ref) {
  var name = _ref.name,
      type = _ref.type;
  if (name !== 'iq') return false;
  if (type === 'error' || type === 'result') return false;
  return true;
}

function isValidQuery(_ref2, child) {
  var type = _ref2.type,
      stanza = _ref2.stanza;
  if (type !== 'get' && type !== 'set') return false;
  if (stanza.children.length !== 1) return false;
  if (!child) return false;
  return true;
}

function buildReply(_ref3) {
  var stanza = _ref3.stanza;
  return _$xml_70('iq', {
    to: stanza.attrs.from,
    from: stanza.attrs.to,
    id: stanza.attrs.id
  });
}

function buildReplyResult(ctx, child) {
  var reply = buildReply(ctx);
  reply.attrs.type = 'result';

  if (child) {
    reply.append(child);
  }

  return reply;
}

function buildReplyError(ctx, error, child) {
  var reply = buildReply(ctx);
  reply.attrs.type = 'error';

  if (child) {
    reply.append(child);
  }

  reply.append(error);
  return reply;
}

function buildError(type, condition) {
  return _$xml_70('error', {
    type: type
  }, _$xml_70(condition, NS_STANZA));
}

function iqHandler(entity) {
  return ___async_41(function (ctx, next) {
    if (!isQuery(ctx)) return next();
    var stanza = ctx.stanza;
    var _stanza$children = stanza.children,
        child = _stanza$children[0];

    if (!isValidQuery(ctx, child)) {
      return buildReplyError(ctx, buildError('modify', 'bad-request'), child);
    }

    ctx.element = child;
    var reply;
    return ___continue_41(___catch_41(function () {
      return _call(next, function (_next) {
        reply = _next;
      });
    }, function (err) {
      entity.emit('error', err);
      reply = buildError('cancel', 'internal-server-error');
    }), function () {
      if (!reply) {
        reply = buildError('cancel', 'service-unavailable');
      }

      return reply instanceof _$xml_70.Element && reply.is('error') ? buildReplyError(ctx, reply, child) : buildReplyResult(ctx, reply instanceof _$xml_70.Element ? reply : undefined);
    });
  });
}

function route(type, ns, name, handler) {
  return function (ctx, next) {
    if (ctx.type !== type | !ctx.element || !ctx.element.is(name, ns)) return next();
    return handler(ctx, next);
  };
}

var _$callee_41 = function (_ref4) {
  var middleware = _ref4.middleware,
      entity = _ref4.entity;
  middleware.use(iqHandler(entity));
  return {
    get: function get(ns, name, handler) {
      middleware.use(route('get', ns, name, handler));
    },
    set: function set(ns, name, handler) {
      middleware.use(route('set', ns, name, handler));
    }
  };
};

'use strict';

var _$id_40 = function id() {
  var i;

  while (!i) {
    i = Math.random().toString(36).substr(2, 12);
  }

  return i;
};

'use strict';
/* https://xmpp.org/rfcs/rfc6120.html#stanzas-error */

/* removed: var _$_interopRequireDefault_6 = require("@babel/runtime/helpers/interopRequireDefault"); */;

var ___inheritsLoose2_51 = _$_interopRequireDefault_6(_$_inheritsLoose_5);

/* removed: var _$XMPPError_33 = require('@xmpp/error'); */;

var StanzaError =
/*#__PURE__*/
function (_XMPPError) {
  (0, ___inheritsLoose2_51.default)(StanzaError, _XMPPError);

  function StanzaError(condition, text, application, type) {
    var _this;

    _this = _XMPPError.call(this, condition, text, application) || this;
    _this.type = type;
    _this.name = 'StanzaError';
    return _this;
  }

  StanzaError.fromElement = function fromElement(element) {
    var error = _XMPPError.fromElement.call(this, element);

    error.type = element.attrs.type;
    return error;
  };

  return StanzaError;
}(_$XMPPError_33);

var _$StanzaError_51 = StanzaError;

'use strict';

// Converts argument to a function that always returns a Promise
function ___async_42(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
} // Awaits on a value that may or may not be a Promise (equivalent to the await keyword in ES2015, with continuations passed explicitly)


// Proceeds after a value has resolved, or proceeds immediately if the value is not thenable
function ___continue_42(value, then) {
  return value && value.then ? value.then(then) : then(value);
} // Proceeds after a value has resolved, or proceeds immediately if the value is not thenable


// Asynchronously call a function and send errors to recovery continuation
function ___catch_42(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
} // Asynchronously await a promise and pass the result to a finally continuation


function ___await_42(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
} // Awaits on a value that may or may not be a Promise, then ignores it


function ___awaitIgnored_42(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(___empty_42) : Promise.resolve();
  }
}

// Empty function to implement break and other control flow that ignores asynchronous results
function ___empty_42() {} // Sentinel value for early returns in generators 


/* removed: var _$id_40 = require('@xmpp/id'); */;

/* removed: var _$StanzaError_51 = require('@xmpp/middleware/lib/StanzaError'); */;

var __Deferred_42 = _$events_34.Deferred;

var timeoutPromise = _$events_34.timeout;

function isReply(_ref) {
  var name = _ref.name,
      type = _ref.type;
  if (name !== 'iq') return false;
  if (type !== 'error' && type !== 'result') return false;
  return true;
}

var _$iqCaller_42 = function iqCaller(_ref2) {
  var entity = _ref2.entity,
      middleware = _ref2.middleware;
  var handlers = new Map();
  middleware.use(function (_ref3, next) {
    var type = _ref3.type,
        name = _ref3.name,
        id = _ref3.id,
        stanza = _ref3.stanza;
    if (!isReply({
      name: name,
      type: type
    })) return next();
    var deferred = handlers.get(id);

    if (!deferred) {
      return next();
    }

    if (type === 'error') {
      deferred.reject(_$StanzaError_51.fromElement(stanza.getChild('error')));
    } else {
      deferred.resolve(stanza);
    }

    handlers.delete(id);
  });
  return {
    handlers: handlers,
    request: ___async_42(function (stanza, timeout) {
      var _exit = false;

      if (timeout === void 0) {
        timeout = 30 * 1000;
      }

      if (!stanza.attrs.id) {
        stanza.attrs.id = _$id_40();
      }

      var deferred = new __Deferred_42();
      handlers.set(stanza.attrs.id, deferred);
      return ___continue_42(___catch_42(function () {
        return ___await_42(entity.send(stanza), function () {
          return ___awaitIgnored_42(timeoutPromise(deferred.promise, timeout));
        });
      }, function (err) {
        handlers.delete(stanza.attrs.id);
        throw err;
      }), function (_result) {
        return _exit ? _result : deferred.promise;
      });
    })
  };
};

'use strict';
/**
 * Expose compositor.
 */

var _$compose_15 = compose;
/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose(middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!');

  for (var _iterator = middleware, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var fn = _ref;
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!');
  }
  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */


  return function (context, next) {
    // last called middleware #
    var index = -1;
    return dispatch(0);

    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;
      var fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();

      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}

'use strict';

var _$Context_48 = function Context(entity, stanza) {
  this.stanza = stanza;
  this.entity = entity;
  var name = stanza.name,
      attrs = stanza.attrs;
  var type = attrs.type,
      id = attrs.id;
  this.name = name;
  this.id = id || '';

  if (name === 'message') {
    this.type = type || 'normal';
  } else if (name === 'presence') {
    this.type = type || 'available';
  } else {
    this.type = type || '';
  }

  this.from = null;
  this.to = null;
  this.local = '';
  this.domain = '';
  this.resource = '';
};

'use strict';

/* removed: var _$_interopRequireDefault_6 = require("@babel/runtime/helpers/interopRequireDefault"); */;

var ___inheritsLoose2_49 = _$_interopRequireDefault_6(_$_inheritsLoose_5);

/* removed: var _$Context_48 = require('./Context'); */;

/* removed: var _$jid_43 = require('@xmpp/jid'); */;

var _$IncomingContext_49 =
/*#__PURE__*/
function (_Context) {
  (0, ___inheritsLoose2_49.default)(IncomingContext, _Context);

  function IncomingContext(entity, stanza) {
    var _this;

    _this = _Context.call(this, entity, stanza) || this;
    var jid = entity.jid,
        domain = entity.domain;
    var to = stanza.attrs.to || jid && jid.toString();
    var from = stanza.attrs.from || domain;
    if (to) _this.to = new _$jid_43(to);

    if (from) {
      _this.from = new _$jid_43(from);
      _this.local = _this.from.local;
      _this.domain = _this.from.domain;
      _this.resource = _this.from.resource;
    }

    return _this;
  }

  return IncomingContext;
}(_$Context_48);

'use strict';

/* removed: var _$_interopRequireDefault_6 = require("@babel/runtime/helpers/interopRequireDefault"); */;

var ___inheritsLoose2_50 = _$_interopRequireDefault_6(_$_inheritsLoose_5);

/* removed: var _$Context_48 = require('./Context'); */;

/* removed: var _$jid_43 = require('@xmpp/jid'); */;

var _$OutgoingContext_50 =
/*#__PURE__*/
function (_Context) {
  (0, ___inheritsLoose2_50.default)(OutgoingContext, _Context);

  function OutgoingContext(entity, stanza) {
    var _this;

    _this = _Context.call(this, entity, stanza) || this;
    var jid = entity.jid,
        domain = entity.domain;
    var from = stanza.attrs.from || jid && jid.toString();
    var to = stanza.attrs.to || domain;
    if (from) _this.from = new _$jid_43(from);

    if (to) {
      _this.to = new _$jid_43(to);
      _this.local = _this.to.local;
      _this.domain = _this.to.domain;
      _this.resource = _this.to.resource;
    }

    return _this;
  }

  return OutgoingContext;
}(_$Context_48);

'use strict';

/* removed: var _$compose_15 = require('koa-compose'); */;

/* removed: var _$IncomingContext_49 = require('./lib/IncomingContext'); */;

/* removed: var _$OutgoingContext_50 = require('./lib/OutgoingContext'); */;

function listener(entity, middleware, Context) {
  return function (stanza) {
    var ctx = new Context(entity, stanza);
    return _$compose_15(middleware)(ctx);
  };
}

function errorHandler(entity) {
  return function (ctx, next) {
    next().then(function (reply) {
      return reply && entity.send(reply);
    }).catch(function (err) {
      return entity.emit('error', err);
    });
  };
}

var _$middleware_47 = function (_ref) {
  var entity = _ref.entity;
  var incoming = [errorHandler(entity)];
  var outgoing = [];
  var incomingListener = listener(entity, incoming, _$IncomingContext_49);
  var outgoingListener = listener(entity, outgoing, _$OutgoingContext_50);
  entity.on('element', incomingListener);
  entity.hookOutgoing = outgoingListener;
  return {
    use: function use(fn) {
      incoming.push(fn);
      return fn;
    },
    filter: function filter(fn) {
      outgoing.push(fn);
      return fn;
    }
  };
};

'use strict';

/* removed: var _$_interopRequireDefault_6 = require("@babel/runtime/helpers/interopRequireDefault"); */;

var ___inheritsLoose2_52 = _$_interopRequireDefault_6(_$_inheritsLoose_5);

// Awaits on a value that may or may not be a Promise (equivalent to the await keyword in ES2015, with continuations passed explicitly)
function ___await_52(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
} // Awaits on a value that may or may not be a Promise, then ignores it


// Converts argument to a function that always returns a Promise
function ___async_52(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

// Proceeds after a value has resolved, or proceeds immediately if the value is not thenable
function ___continueIgnored_52(value) {
  if (value && value.then) {
    return value.then(___empty_52);
  }
} // Asynchronously iterate through an object that has a length property, passing the index as the first argument to the callback (even as the length property changes)


// Asynchronously call a function and send errors to recovery continuation
function ___catch_52(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
} // Asynchronously await a promise and pass the result to a finally continuation


function ___awaitIgnored_52(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(___empty_52) : Promise.resolve();
  }
} // Proceeds after a value has resolved, or proceeds immediately if the value is not thenable


// Empty function to implement break and other control flow that ignores asynchronous results
function ___empty_52() {} // Sentinel value for early returns in generators 


var __EventEmitter_52 = _$events_34.EventEmitter;

var Reconnect =
/*#__PURE__*/
function (_EventEmitter) {
  (0, ___inheritsLoose2_52.default)(Reconnect, _EventEmitter);

  function Reconnect(entity) {
    var _this;

    _this = _EventEmitter.call(this) || this;
    _this.delay = 1000;
    _this.entity = entity;
    _this._timeout = null;
    return _this;
  }

  var _proto = Reconnect.prototype;

  _proto.scheduleReconnect = function scheduleReconnect() {
    var _this2 = this;

    var entity = this.entity,
        delay = this.delay,
        _timeout = this._timeout;
    clearTimeout(_timeout);
    this._timeout = setTimeout(___async_52(function () {
      if (entity.status !== 'disconnect') {
        return;
      }

      return ___continueIgnored_52(___catch_52(function () {
        return ___awaitIgnored_52(_this2.reconnect());
      }, ___empty_52));
    }), delay);
  };

  _proto.reconnect = ___async_52(function () {
    var _this3 = this;

    var entity = _this3.entity;

    _this3.emit('reconnecting');

    var _entity$options = entity.options,
        service = _entity$options.service,
        domain = _entity$options.domain,
        lang = _entity$options.lang;
    return ___await_52(entity.connect(service), function () {
      return ___await_52(entity.open({
        domain: domain,
        lang: lang
      }), function () {
        _this3.emit('reconnected');
      });
    });
  });

  _proto.start = function start() {
    var _this4 = this;

    var entity = this.entity;
    var listeners = {};

    listeners.disconnect = function () {
      _this4.scheduleReconnect();
    };

    this.listeners = listeners;
    entity.on('disconnect', listeners.disconnect);
  };

  _proto.stop = function stop() {
    var entity = this.entity,
        listeners = this.listeners,
        _timeout = this._timeout;
    entity.removeListener('disconnect', listeners.disconnect);
    clearTimeout(_timeout);
  };

  return Reconnect;
}(__EventEmitter_52);

var _$reconnect_52 = function reconnect(_ref) {
  var entity = _ref.entity;
  var r = new Reconnect(entity);
  r.start();
  return r;
};

var _$empty_12 = {};
"use strict";

var _$altConnections_54 = {};
'use strict';

function isSecure(uri) {
  return uri.startsWith('https') || uri.startsWith('wss');
}

_$altConnections_54.compare = function compare(a, b) {
  var secure;

  if (isSecure(a.uri) && !isSecure(b.uri)) {
    secure = -1;
  } else if (!isSecure(a.uri) && isSecure(b.uri)) {
    secure = 1;
  } else {
    secure = 0;
  }

  if (secure !== 0) {
    return secure;
  }

  var method;

  if (a.method === b.method) {
    method = 0;
  } else if (a.method === 'websocket') {
    method = -1;
  } else if (b.method === 'websocket') {
    method = 1;
  } else if (a.method === 'xbosh') {
    method = -1;
  } else if (b.method === 'xbosh') {
    method = 1;
  } else if (a.method === 'httppoll') {
    method = -1;
  } else if (b.method === 'httppoll') {
    method = 1;
  } else {
    method = 0;
  }

  if (method !== 0) {
    return method;
  }

  return 0;
};

'use strict';

/* removed: var _$Parser_72 = require('./Parser'); */;

var _$parse_73 = function parse(data) {
  var p = new _$Parser_72();
  var result = null;
  var error = null;
  p.on('start', function (el) {
    result = el;
  });
  p.on('element', function (el) {
    result.append(el);
  });
  p.on('error', function (err) {
    error = err;
  });
  p.write(data);
  p.end();

  if (error) {
    throw error;
  } else {
    return result;
  }
};

var _$http_55 = {};
(function (global){
'use strict';

var fetch = global.fetch || _$empty_12;

/* removed: var _$parse_73 = require('@xmpp/xml/lib/parse'); */;

var compareAltConnections = _$altConnections_54.compare;

function resolve(domain) {
  return fetch("https://" + domain + "/.well-known/host-meta").then(function (res) {
    return res.text();
  }).then(function (res) {
    return _$parse_73(res).getChildren('Link').filter(function (link) {
      return ['urn:xmpp:alt-connections:websocket', 'urn:xmpp:alt-connections:httppoll', 'urn:xmpp:alt-connections:xbosh'].indexOf(link.attrs.rel) > -1;
    }).map(function (_ref) {
      var attrs = _ref.attrs;
      return {
        rel: attrs.rel,
        href: attrs.href,
        method: attrs.rel.split(':').pop(),
        uri: attrs.href
      };
    }).sort(compareAltConnections);
  }).catch(function () {
    return [];
  });
}

_$http_55.resolve = resolve;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

var _$resolve_56 = {};
'use strict';

/* removed: var _$empty_12 = require('./lib/dns'); */;

/* removed: var _$http_55 = require('./lib/http'); */;

_$resolve_56 = function resolve() {
  return Promise.all([_$empty_12.resolve ? _$empty_12.resolve.apply(_$empty_12, arguments) : Promise.resolve([]), _$http_55.resolve.apply(_$http_55, arguments)]).then(function (_ref) {
    var records = _ref[0],
        endpoints = _ref[1];
    return records.concat(endpoints);
  });
};

if (_$empty_12.resolve) {
  _$resolve_56.dns = _$empty_12;
}

_$resolve_56.http = _$http_55;

'use strict';

// Proceeds after a value has resolved, or proceeds immediately if the value is not thenable
function ___continue_53(value, then) {
  return value && value.then ? value.then(then) : then(value);
} // Proceeds after a value has resolved, or proceeds immediately if the value is not thenable


// Converts argument to a function that always returns a Promise
function ___async_53(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
} // Awaits on a value that may or may not be a Promise (equivalent to the await keyword in ES2015, with continuations passed explicitly)


function ___await_53(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
} // Awaits on a value that may or may not be a Promise, then ignores it


// Asynchronously call a function and send errors to recovery continuation
function ___catch_53(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
} // Asynchronously await a promise and pass the result to a finally continuation


function ___awaitIgnored_53(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(___empty_53) : Promise.resolve();
  }
}

// Empty function to implement break and other control flow that ignores asynchronous results
function ___empty_53() {} // Sentinel value for early returns in generators 


var fallbackConnect = ___async_53(function (entity, uris) {
  var _exit = false;

  if (uris.length === 0) {
    throw new Error("Couldn't connect");
  }

  var uri = uris.shift();

  var Transport = entity._findTransport(uri);

  if (!Transport) {
    return fallbackConnect(entity, uris);
  }

  var params = Transport.prototype.socketParameters(uri);
  var socket = new Transport.prototype.Socket();
  return ___continue_53(___catch_53(function () {
    return ___awaitIgnored_53(__socketConnect_53(socket, params));
  }, function () {
    _exit = true;
    return fallbackConnect(entity, uris);
  }), function (_result2) {
    if (_exit) return _result2;

    entity._attachSocket(socket);

    socket.emit('connect');
    entity.Transport = Transport;
    entity.Socket = Transport.prototype.Socket;
    entity.Parser = Transport.prototype.Parser;
  });
});

var fetchURIs = ___async_53(function (domain) {
  return ___await_53(_$resolve_56(domain, {
    srv: [{
      service: 'xmpps-client',
      protocol: 'tcp'
    }, {
      service: 'xmpp-client',
      protocol: 'tcp'
    }]
  }), function (_resolve) {
    return [].concat(new Set(_resolve.map(function (record) {
      return record.uri;
    })));
  });
});

/* removed: var _$resolve_56 = require('./resolve'); */;

var __socketConnect_53 = _$connection_31.socketConnect;

function filterSupportedURIs(entity, uris) {
  return uris.filter(function (uri) {
    return entity._findTransport(uri);
  });
}

var _$resolve_53 = function (_ref) {
  var entity = _ref.entity;
  var _connect = entity.connect;
  entity.connect = ___async_53(function (service) {
    var _this = this;

    return !service || service.match(/:\/\//) ? _connect.call(_this, service) : ___await_53(fetchURIs(service), function (_fetchURIs) {
      var uris = filterSupportedURIs(entity, _fetchURIs);

      if (uris.length === 0) {
        throw new Error('No compatible transport found.');
      }

      return ___catch_53(function () {
        return ___awaitIgnored_53(fallbackConnect(entity, uris));
      }, function (err) {
        entity._reset();

        entity._status('disconnect');

        throw err;
      });
    });
  });
};

'use strict';

// Awaits on a value that may or may not be a Promise (equivalent to the await keyword in ES2015, with continuations passed explicitly)
function ___await_57(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
} // Awaits on a value that may or may not be a Promise, then ignores it


// Converts argument to a function that always returns a Promise
function ___async_57(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

// Asynchronously call a function and pass the result to explicitly passed continuations
function _invoke(body, then) {
  var result = body();

  if (result && result.then) {
    return result.then(then);
  }

  return then(result);
} // Asynchronously call a function and swallow the result


function ___awaitIgnored_57(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(___empty_57) : Promise.resolve();
  }
} // Proceeds after a value has resolved, or proceeds immediately if the value is not thenable


// Empty function to implement break and other control flow that ignores asynchronous results
function ___empty_57() {} // Sentinel value for early returns in generators 


var __bind_57 = ___async_57(function (entity, iqCaller, resource) {
  return ___await_57(iqCaller.request(_$xml_70('iq', {
    type: 'set'
  }, makeBindElement(resource))), function (result) {
    var jid = result.getChild('bind', NS).getChildText('jid');

    entity._jid(jid);

    return jid;
  });
});

/* removed: var _$xml_70 = require('@xmpp/xml'); */;
/*
 * References
 * https://xmpp.org/rfcs/rfc6120.html#bind
 */


var NS = 'urn:ietf:params:xml:ns:xmpp-bind';

function makeBindElement(resource) {
  return _$xml_70('bind', {
    xmlns: NS
  }, resource && _$xml_70('resource', {}, resource));
}

function __route_57(_ref, resource) {
  var iqCaller = _ref.iqCaller;
  return ___async_57(function (_ref2, next) {
    var entity = _ref2.entity;
    return _invoke(function () {
      if (typeof resource === 'function') {
        return ___awaitIgnored_57(resource(function (resource) {
          return __bind_57(entity, iqCaller, resource);
        }));
      } else {
        return ___awaitIgnored_57(__bind_57(entity, iqCaller, resource));
      }
    }, function () {
      next();
    });
  });
}

var _$resourceBinding_57 = function (_ref3, resource) {
  var streamFeatures = _ref3.streamFeatures,
      iqCaller = _ref3.iqCaller;
  streamFeatures.use('bind', NS, __route_57({
    iqCaller: iqCaller
  }, resource));
};

var _$mechanism_21 = { exports: {} };
"use strict";

(function (root, factory) {
  if (typeof _$mechanism_21.exports === 'object') {
    // CommonJS
    factory(_$mechanism_21.exports, _$mechanism_21);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['exports', 'module'], factory);
  }
})(void 0, function (exports, module) {
  /**
   * ANONYMOUS `Mechanism` constructor.
   *
   * This class implements the ANONYMOUS SASL mechanism.
   *
   * The ANONYMOUS SASL mechanism provides support for permitting anonymous
   * access to various services
   *
   * References:
   *  - [RFC 4505](http://tools.ietf.org/html/rfc4505)
   *
   * @api public
   */
  function Mechanism() {}

  Mechanism.prototype.name = 'ANONYMOUS';
  Mechanism.prototype.clientFirst = true;
  /**
   * Encode a response using optional trace information.
   *
   * Options:
   *  - `trace`  trace information (optional)
   *
   * @param {Object} cred
   * @api public
   */

  Mechanism.prototype.response = function (cred) {
    return cred.trace || '';
  };
  /**
   * Decode a challenge issued by the server.
   *
   * @param {String} chal
   * @api public
   */


  Mechanism.prototype.challenge = function (chal) {};

  exports = module.exports = Mechanism;
});

_$mechanism_21 = _$mechanism_21.exports
var _$main_22 = { exports: {} };
"use strict";

(function (root, factory) {
  if (typeof _$main_22.exports === 'object') {
    // CommonJS
    factory(_$main_22.exports, _$main_22, _$mechanism_21);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['exports', 'module', './lib/mechanism'], factory);
  }
})(void 0, function (exports, module, Mechanism) {
  exports = module.exports = Mechanism;
  exports.Mechanism = Mechanism;
});

_$main_22 = _$main_22.exports
'use strict';
/**
 * [XEP-0175: Best Practices for Use of SASL ANONYMOUS](https://xmpp.org/extensions/xep-0175.html)
 * [RFC-4504: Anonymous Simple Authentication and Security Layer (SASL) Mechanism](https://tools.ietf.org/html/rfc4505)
 */

/* removed: var _$main_22 = require('sasl-anonymous'); */;

var _$saslAnonymous_58 = function saslAnonymous(sasl) {
  sasl.use(_$main_22);
};

var _$mechanism_23 = { exports: {} };
"use strict";

(function (root, factory) {
  if (typeof _$mechanism_23.exports === 'object') {
    // CommonJS
    factory(_$mechanism_23.exports, _$mechanism_23);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['exports', 'module'], factory);
  }
})(void 0, function (exports, module) {
  /**
   * PLAIN `Mechanism` constructor.
   *
   * This class implements the PLAIN SASL mechanism.
   *
   * The PLAIN SASL mechanism provides support for exchanging a clear-text
   * username and password.  This mechanism should not be used without adequate
   * security provided by an underlying transport layer. 
   *
   * References:
   *  - [RFC 4616](http://tools.ietf.org/html/rfc4616)
   *
   * @api public
   */
  function Mechanism() {}

  Mechanism.prototype.name = 'PLAIN';
  Mechanism.prototype.clientFirst = true;
  /**
   * Encode a response using given credential.
   *
   * Options:
   *  - `username`
   *  - `password`
   *  - `authzid`   authorization identity (optional)
   *
   * @param {Object} cred
   * @api public
   */

  Mechanism.prototype.response = function (cred) {
    var str = '';
    str += cred.authzid || '';
    str += '\0';
    str += cred.username;
    str += '\0';
    str += cred.password;
    return str;
  };
  /**
   * Decode a challenge issued by the server.
   *
   * @param {String} chal
   * @return {Mechanism} for chaining
   * @api public
   */


  Mechanism.prototype.challenge = function (chal) {
    return this;
  };

  exports = module.exports = Mechanism;
});

_$mechanism_23 = _$mechanism_23.exports
var _$main_24 = { exports: {} };
"use strict";

(function (root, factory) {
  if (typeof _$main_24.exports === 'object') {
    // CommonJS
    factory(_$main_24.exports, _$main_24, _$mechanism_23);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['exports', 'module', './lib/mechanism'], factory);
  }
})(void 0, function (exports, module, Mechanism) {
  exports = module.exports = Mechanism;
  exports.Mechanism = Mechanism;
});

_$main_24 = _$main_24.exports
'use strict';

/* removed: var _$main_24 = require('sasl-plain'); */;

var _$saslPlain_59 = function saslPlain(sasl) {
  sasl.use(_$main_24);
};

"use strict";

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var _$_defineProperty_3 = _defineProperty;

"use strict";

/* removed: var _$_defineProperty_3 = require("./defineProperty"); */;

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _$_defineProperty_3(target, key, source[key]);
    });
  }

  return target;
}

var _$_objectSpread_8 = _objectSpread;

var _$factory_25 = { exports: {} };
"use strict";

(function (root, factory) {
  if (typeof _$factory_25.exports === 'object') {
    // CommonJS
    factory(_$factory_25.exports, _$factory_25);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['exports', 'module'], factory);
  }
})(void 0, function (exports, module) {
  /**
   * `Factory` constructor.
   *
   * @api public
   */
  function Factory() {
    this._mechs = [];
  }
  /**
   * Utilize the given `mech` with optional `name`, overridding the mechanism's
   * default name.
   *
   * Examples:
   *
   *     factory.use(FooMechanism);
   *
   *     factory.use('XFOO', FooMechanism);
   *
   * @param {String|Mechanism} name
   * @param {Mechanism} mech
   * @return {Factory} for chaining
   * @api public
   */


  Factory.prototype.use = function (name, mech) {
    if (!mech) {
      mech = name;
      name = mech.prototype.name;
    }

    this._mechs.push({
      name: name,
      mech: mech
    });

    return this;
  };
  /**
   * Create a new mechanism from supported list of `mechs`.
   *
   * If no mechanisms are supported, returns `null`.
   *
   * Examples:
   *
   *     var mech = factory.create(['FOO', 'BAR']);
   *
   * @param {Array} mechs
   * @return {Mechanism}
   * @api public
   */


  Factory.prototype.create = function (mechs) {
    for (var i = 0, len = this._mechs.length; i < len; i++) {
      for (var j = 0, jlen = mechs.length; j < jlen; j++) {
        var entry = this._mechs[i];

        if (entry.name == mechs[j]) {
          return new entry.mech();
        }
      }
    }

    return null;
  };

  exports = module.exports = Factory;
});

_$factory_25 = _$factory_25.exports
var _$main_26 = { exports: {} };
"use strict";

(function (root, factory) {
  if (typeof _$main_26.exports === 'object') {
    // CommonJS
    factory(_$main_26.exports, _$main_26, _$factory_25);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['exports', 'module', './lib/factory'], factory);
  }
})(void 0, function (exports, module, Factory) {
  exports = module.exports = Factory;
  exports.Factory = Factory;
});

_$main_26 = _$main_26.exports
'use strict';

/* removed: var _$_interopRequireDefault_6 = require("@babel/runtime/helpers/interopRequireDefault"); */;

var ___inheritsLoose2_61 = _$_interopRequireDefault_6(_$_inheritsLoose_5);

/* removed: var _$XMPPError_33 = require('@xmpp/error'); */; // https://xmpp.org/rfcs/rfc6120.html#sasl-errors


var SASLError =
/*#__PURE__*/
function (_XMPPError) {
  (0, ___inheritsLoose2_61.default)(SASLError, _XMPPError);

  function SASLError() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _XMPPError.call.apply(_XMPPError, [this].concat(args)) || this;
    _this.name = 'SASLError';
    return _this;
  }

  return SASLError;
}(_$XMPPError_33);

var _$SASLError_61 = SASLError;

var _$b64_62 = {};
(function (global,Buffer){
'use strict';

var Base64 = _$empty_12.Base64;

_$b64_62.encode = function encode(string) {
  if (global.btoa) {
    return global.btoa(string);
  }

  if (global.Buffer) {
    return Buffer.from(string, 'utf8').toString('base64');
  }

  return Base64.btoa(string);
};

_$b64_62.decode = function decode(string) {
  if (global.atob) {
    return global.atob(string);
  }

  if (global.Buffer) {
    return Buffer.from(string, 'base64').toString('utf8');
  }

  return Base64.btoa(string);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},_$empty_12.Buffer)

'use strict';

/* removed: var _$_objectSpread_8 = require("@babel/runtime/helpers/objectSpread"); */;

// Converts argument to a function that always returns a Promise
function ___async_60(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
} // Awaits on a value that may or may not be a Promise (equivalent to the await keyword in ES2015, with continuations passed explicitly)


// Asynchronously call a function and pass the result to explicitly passed continuations
function ___invoke_60(body, then) {
  var result = body();

  if (result && result.then) {
    return result.then(then);
  }

  return then(result);
} // Asynchronously call a function and swallow the result


// Awaits on a value that may or may not be a Promise, then ignores it
function ___awaitIgnored_60(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(___empty_60) : Promise.resolve();
  }
} // Proceeds after a value has resolved, or proceeds immediately if the value is not thenable


// Empty function to implement break and other control flow that ignores asynchronous results
function ___empty_60() {} // Sentinel value for early returns in generators 


var authenticate = ___async_60(function (SASL, entity, mechname, credentials) {
  var mech = SASL.create([mechname]);

  if (!mech) {
    throw new Error('No compatible mechanism');
  }

  var domain = entity.options.domain;

  var creds = _$_objectSpread_8({
    username: null,
    password: null,
    server: domain,
    host: domain,
    realm: domain,
    serviceType: 'xmpp',
    serviceName: domain
  }, credentials);

  return new Promise(function (resolve, reject) {
    var handler = function handler(element) {
      if (element.attrs.xmlns !== __NS_60) {
        return;
      }

      if (element.name === 'challenge') {
        mech.challenge(decode(element.text()));
        var resp = mech.response(creds);
        entity.send(_$xml_70('response', {
          xmlns: __NS_60,
          mechanism: mech.name
        }, typeof resp === 'string' ? encode(resp) : ''));
        return;
      }

      if (element.name === 'failure') {
        reject(_$SASLError_61.fromElement(element));
      } else if (element.name === 'success') {
        resolve();
      }

      entity.removeListener('nonza', handler);
    };

    entity.on('nonza', handler);

    if (mech.clientFirst) {
      entity.send(_$xml_70('auth', {
        xmlns: __NS_60,
        mechanism: mech.name
      }, encode(mech.response(creds))));
    }
  });
});

var encode = _$b64_62.encode,
    decode = _$b64_62.decode;

/* removed: var _$SASLError_61 = require('./lib/SASLError'); */;

/* removed: var _$xml_70 = require('@xmpp/xml'); */;

/* removed: var _$main_26 = require('saslmechanisms'); */; // https://xmpp.org/rfcs/rfc6120.html#sasl


var __NS_60 = 'urn:ietf:params:xml:ns:xmpp-sasl';

function getMechanismNames(features) {
  return features.getChild('mechanisms', __NS_60).children.map(function (el) {
    return el.text();
  });
}

var _$sasl_60 = function sasl(_ref, credentials) {
  var streamFeatures = _ref.streamFeatures;
  var SASL = new _$main_26();
  streamFeatures.use('mechanisms', __NS_60, ___async_60(function (_ref2) {
    var stanza = _ref2.stanza,
        entity = _ref2.entity;
    var offered = getMechanismNames(stanza);

    var supported = SASL._mechs.map(function (_ref3) {
      var name = _ref3.name;
      return name;
    });

    var intersection = supported.filter(function (mech) {
      return offered.includes(mech);
    });
    var mech = intersection[0];
    return ___invoke_60(function () {
      if (typeof credentials === 'function') {
        return ___awaitIgnored_60(credentials(function (creds) {
          return authenticate(SASL, entity, mech, creds, stanza);
        }, mech));
      } else {
        if (!credentials.username && !credentials.password) {
          mech = 'ANONYMOUS';
        }

        return ___awaitIgnored_60(authenticate(SASL, entity, mech, credentials, stanza));
      }
    }, function () {
      return ___awaitIgnored_60(entity.restart());
    });
  }));
  return {
    use: function use() {
      return SASL.use.apply(SASL, arguments);
    }
  };
};

'use strict';

// Converts argument to a function that always returns a Promise
function ___async_63(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
} // Awaits on a value that may or may not be a Promise (equivalent to the await keyword in ES2015, with continuations passed explicitly)


function ___await_63(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
} // Awaits on a value that may or may not be a Promise, then ignores it


/* removed: var _$xml_70 = require('@xmpp/xml'); */; // https://tools.ietf.org/html/draft-cridland-xmpp-session-01


var __NS_63 = 'urn:ietf:params:xml:ns:xmpp-session';

var _$sessionEstablishment_63 = function (_ref) {
  var iqCaller = _ref.iqCaller,
      streamFeatures = _ref.streamFeatures;
  streamFeatures.use('session', __NS_63, ___async_63(function (context, next, feature) {
    return feature.getChild('optional') ? next() : ___await_63(iqCaller.request(_$xml_70('iq', {
      type: 'set'
    }, _$xml_70('session', __NS_63))), function () {
      return next();
    });
  }));
};

'use strict';

// Converts argument to a function that always returns a Promise
function ___async_65(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
} // Awaits on a value that may or may not be a Promise (equivalent to the await keyword in ES2015, with continuations passed explicitly)


// Asynchronously call a function and pass the result to explicitly passed continuations
function ___call_65(body, then, direct) {
  if (direct) {
    return then ? then(body()) : body();
  }

  try {
    var result = Promise.resolve(body());
    return then ? result.then(then) : result;
  } catch (e) {
    return Promise.reject(e);
  }
} // Asynchronously call a function and swallow the result


var _$route_65 = function route() {
  return ___async_65(function (_ref, next) {
    var stanza = _ref.stanza,
        entity = _ref.entity;
    return stanza.is('features', 'http://etherx.jabber.org/streams') ? ___call_65(next, function () {
      if (entity.jid) entity._status('online', entity.jid);
    }) : next();
  });
};

'use strict';
/**
 * References
 * https://xmpp.org/rfcs/rfc6120.html#streams-negotiation Stream Negotiation
 * https://xmpp.org/extensions/xep-0170.html XEP-0170: Recommended Order of Stream Feature Negotiation
 * https://xmpp.org/registrar/stream-features.html XML Stream Features
 */

/* removed: var _$route_65 = require('./route'); */;

var _$streamFeatures_64 = function (_ref) {
  var middleware = _ref.middleware;
  middleware.use(_$route_65());

  function use(name, xmlns, handler) {
    return middleware.use(function (ctx, next) {
      var stanza = ctx.stanza;
      if (!stanza.is('features', 'http://etherx.jabber.org/streams')) return next();
      var feature = stanza.getChild(name, xmlns);
      if (!feature) return next();
      return handler(ctx, next, feature);
    });
  }

  return {
    use: use
  };
};

'use strict';

/* removed: var _$_interopRequireDefault_6 = require("@babel/runtime/helpers/interopRequireDefault"); */;

var ___inheritsLoose2_68 = _$_interopRequireDefault_6(_$_inheritsLoose_5);

var __Parser_68 = _$xml_70.Parser,
    __Element_68 = _$xml_70.Element,
    __XMLError_68 = _$xml_70.XMLError;

var _$FramedParser_68 =
/*#__PURE__*/
function (_Parser) {
  (0, ___inheritsLoose2_68.default)(FramedParser, _Parser);

  function FramedParser() {
    return _Parser.apply(this, arguments) || this;
  }

  var _proto = FramedParser.prototype;

  _proto.onStartElement = function onStartElement(name, attrs) {
    var element = new __Element_68(name, attrs);
    var cursor = this.cursor;

    if (cursor) {
      cursor.append(element);
    }

    this.cursor = element;
  };

  _proto.onEndElement = function onEndElement(name) {
    var cursor = this.cursor;

    if (name !== cursor.name) {
      // <foo></bar>
      this.emit('error', new __XMLError_68(cursor.name + " must be closed."));
      return;
    }

    if (cursor.parent) {
      this.cursor = cursor.parent;
      return;
    }

    if (cursor.is('open', 'urn:ietf:params:xml:ns:xmpp-framing')) {
      this.emit('start', cursor);
    } else if (cursor.is('close', 'urn:ietf:params:xml:ns:xmpp-framing')) {
      this.emit('end', cursor);
    } else {
      this.emit('element', cursor);
    }

    this.cursor = null;
  };

  return FramedParser;
}(__Parser_68);

var _$Socket_69 = {};
(function (global){
'use strict';

/* removed: var _$_interopRequireDefault_6 = require("@babel/runtime/helpers/interopRequireDefault"); */;

var _inheritsLoose2 = _$_interopRequireDefault_6(_$_inheritsLoose_5);

/* removed: var _$empty_12 = require('ws'); */;

var WebSocket = global.WebSocket || _$empty_12;

/* removed: var _$EventEmitter_13 = require('events'); */;

var CODE = 'ECONNERROR';

var Socket =
/*#__PURE__*/
function (_EventEmitter) {
  (0, _inheritsLoose2.default)(Socket, _EventEmitter);

  function Socket() {
    var _this;

    _this = _EventEmitter.call(this) || this;
    _this.listeners = Object.create(null);
    return _this;
  }

  var _proto = Socket.prototype;

  _proto.connect = function connect(url) {
    this.url = url;

    this._attachSocket(new WebSocket(url, ['xmpp']));
  };

  _proto._attachSocket = function _attachSocket(socket) {
    var _this2 = this;

    var sock = this.socket = socket;
    var listeners = this.listeners;

    listeners.open = function () {
      _this2.emit('connect');
    };

    listeners.message = function (_ref) {
      var data = _ref.data;
      return _this2.emit('data', data);
    };

    listeners.error = function (event) {
      // WS
      var error = event.error; // DOM

      if (!error) {
        error = new Error("WebSocket " + CODE + " " + _this2.url);
        error.errno = CODE;
        error.code = CODE;
      }

      error.event = event;
      error.url = _this2.url;

      _this2.emit('error', error);
    };

    listeners.close = function (event) {
      _this2._detachSocket();

      _this2.emit('close', !event.wasClean, event);
    };

    sock.addEventListener('open', listeners.open);
    sock.addEventListener('message', listeners.message);
    sock.addEventListener('error', listeners.error);
    sock.addEventListener('close', listeners.close);
  };

  _proto._detachSocket = function _detachSocket() {
    delete this.url;
    var socket = this.socket,
        listeners = this.listeners;
    Object.getOwnPropertyNames(listeners).forEach(function (k) {
      socket.removeEventListener(k, listeners[k]);
      delete listeners[k];
    });
    delete this.socket;
  };

  _proto.end = function end() {
    this.socket.close();
  };

  _proto.write = function write(data, fn) {
    if (WebSocket === _$empty_12) {
      this.socket.send(data, fn);
    } else {
      this.socket.send(data);
      fn();
    }
  };

  return Socket;
}(_$EventEmitter_13);

_$Socket_69 = Socket;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

'use strict';

/* removed: var _$_interopRequireDefault_6 = require("@babel/runtime/helpers/interopRequireDefault"); */;

var ___inheritsLoose2_67 = _$_interopRequireDefault_6(_$_inheritsLoose_5);

/* removed: var _$Socket_69 = require('./Socket'); */;

/* removed: var _$connection_31 = require('@xmpp/connection'); */;

/* removed: var _$xml_70 = require('@xmpp/xml'); */;

/* removed: var _$FramedParser_68 = require('./FramedParser'); */;

var NS_FRAMING = 'urn:ietf:params:xml:ns:xmpp-framing';
/* References
 * WebSocket protocol https://tools.ietf.org/html/rfc6455
 * WebSocket Web API https://html.spec.whatwg.org/multipage/comms.html#network
 * XMPP over WebSocket https://tools.ietf.org/html/rfc7395
 */

var ConnectionWebSocket =
/*#__PURE__*/
function (_Connection) {
  (0, ___inheritsLoose2_67.default)(ConnectionWebSocket, _Connection);

  function ConnectionWebSocket() {
    return _Connection.apply(this, arguments) || this;
  }

  var _proto = ConnectionWebSocket.prototype;

  // https://tools.ietf.org/html/rfc7395#section-3.6
  _proto.footerElement = function footerElement() {
    return new _$xml_70.Element('close', {
      xmlns: NS_FRAMING
    });
  } // https://tools.ietf.org/html/rfc7395#section-3.4
  ;

  _proto.headerElement = function headerElement() {
    var el = _Connection.prototype.headerElement.call(this);

    el.name = 'open';
    el.attrs.xmlns = NS_FRAMING;
    return el;
  };

  _proto.socketParameters = function socketParameters(service) {
    return service.match(/^wss?:\/\//) ? service : undefined;
  };

  return ConnectionWebSocket;
}(_$connection_31);

ConnectionWebSocket.prototype.Socket = _$Socket_69;
ConnectionWebSocket.prototype.NS = 'jabber:client';
ConnectionWebSocket.prototype.Parser = _$FramedParser_68;
var _$ConnectionWebSocket_67 = ConnectionWebSocket;

'use strict';

/* removed: var _$ConnectionWebSocket_67 = require('./lib/Connection'); */;

var _$websocket_66 = function websocket(_ref) {
  var entity = _ref.entity;
  entity.transports.push(_$ConnectionWebSocket_67);
};

var _$client_30 = {};
'use strict';

/* removed: var _$_interopRequireDefault_6 = require("@babel/runtime/helpers/interopRequireDefault"); */;

var _objectWithoutPropertiesLoose2 = _$_interopRequireDefault_6(_$_objectWithoutPropertiesLoose_9);

var __xml_30 = _$clientCore_27.xml,
    __jid_30 = _$clientCore_27.jid,
    __Client_30 = _$clientCore_27.Client;

/* removed: var _$getDomain_29 = require('./lib/getDomain'); */;

/* removed: var _$reconnect_52 = require('@xmpp/reconnect'); */;

/* removed: var _$websocket_66 = require('@xmpp/websocket'); */;

/* removed: var _$middleware_47 = require('@xmpp/middleware'); */;

/* removed: var _$streamFeatures_64 = require('@xmpp/stream-features'); */;

/* removed: var _$iqCaller_42 = require('@xmpp/iq/caller'); */;

/* removed: var _$callee_41 = require('@xmpp/iq/callee'); */;

/* removed: var _$resolve_53 = require('@xmpp/resolve'); */; // Stream features - order matters and define priority


/* removed: var _$sasl_60 = require('@xmpp/sasl'); */;

/* removed: var _$resourceBinding_57 = require('@xmpp/resource-binding'); */;

/* removed: var _$sessionEstablishment_63 = require('@xmpp/session-establishment'); */; // SASL mechanisms - order matters and define priority


/* removed: var _$saslAnonymous_58 = require('@xmpp/sasl-anonymous'); */;

/* removed: var _$saslPlain_59 = require('@xmpp/sasl-plain'); */;

function client(options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      resource = _options.resource,
      credentials = _options.credentials,
      username = _options.username,
      password = _options.password,
      params = (0, _objectWithoutPropertiesLoose2.default)(_options, ["resource", "credentials", "username", "password"]);
  var domain = params.domain,
      service = params.service;

  if (!domain && service) {
    params.domain = _$getDomain_29(service);
  }

  var entity = new __Client_30(params);

  var reconnect = _$reconnect_52({
    entity: entity
  });

  var websocket = _$websocket_66({
    entity: entity
  });

  var middleware = _$middleware_47({
    entity: entity
  });

  var streamFeatures = _$streamFeatures_64({
    middleware: middleware
  });

  var iqCaller = _$iqCaller_42({
    middleware: middleware,
    entity: entity
  });

  var iqCallee = _$callee_41({
    middleware: middleware,
    entity: entity
  });

  var resolve = _$resolve_53({
    entity: entity
  }); // Stream features - order matters and define priority


  var sasl = _$sasl_60({
    streamFeatures: streamFeatures
  }, credentials || {
    username: username,
    password: password
  });

  var resourceBinding = _$resourceBinding_57({
    iqCaller: iqCaller,
    streamFeatures: streamFeatures
  }, resource);

  var sessionEstablishment = _$sessionEstablishment_63({
    iqCaller: iqCaller,
    streamFeatures: streamFeatures
  }); // SASL mechanisms - order matters and define priority


  var mechanisms = Object.entries({
    anonymous: _$saslAnonymous_58,
    plain: _$saslPlain_59
  }).map(function (_ref) {
    var _ref2;

    var k = _ref[0],
        v = _ref[1];
    return _ref2 = {}, _ref2[k] = v(sasl), _ref2;
  });
  return Object.assign(entity, {
    entity: entity,
    reconnect: reconnect,
    websocket: websocket,
    middleware: middleware,
    streamFeatures: streamFeatures,
    iqCaller: iqCaller,
    iqCallee: iqCallee,
    resolve: resolve,
    sasl: sasl,
    resourceBinding: resourceBinding,
    sessionEstablishment: sessionEstablishment,
    mechanisms: mechanisms
  });
}

_$client_30.xml = __xml_30;
_$client_30.jid = __jid_30;
_$client_30.client = client;

return _$client_30;

});
//# sourceMappingURL=xmpp.js.map
