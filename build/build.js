(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
require('whatwg-fetch');
module.exports = self.fetch.bind(self);

},{"whatwg-fetch":2}],2:[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
      list = []
      this.map[name] = list
    }
    list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || []
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
        callback.call(thisArg, value, name, this)
      }, this)
    }, this)
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return fileReaderReady(reader)
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    reader.readAsText(blob)
    return fileReaderReady(reader)
  }

  var support = {
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob();
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  function Body() {
    this.bodyUsed = false


    this._initBody = function(body) {
      this._bodyInit = body
      if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (!body) {
        this._bodyText = ''
      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
        // Only support ArrayBuffers for POST method.
        // Receiving ArrayBuffers happens via Blobs, instead.
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        return this.blob().then(readBlobAsArrayBuffer)
      }

      this.text = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text')
        } else {
          return Promise.resolve(this._bodyText)
        }
      }
    } else {
      this.text = function() {
        var rejected = consumed(this)
        return rejected ? rejected : Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body
    if (Request.prototype.isPrototypeOf(input)) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = input
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this)
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function headers(xhr) {
    var head = new Headers()
    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
    pairs.forEach(function(header) {
      var split = header.trim().split(':')
      var key = split.shift().trim()
      var value = split.join(':').trim()
      head.append(key, value)
    })
    return head
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = options.statusText
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request
      if (Request.prototype.isPrototypeOf(input) && !init) {
        request = input
      } else {
        request = new Request(input, init)
      }

      var xhr = new XMLHttpRequest()

      function responseURL() {
        if ('responseURL' in xhr) {
          return xhr.responseURL
        }

        // Avoid security warnings on getResponseHeader when not allowed by CORS
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
          return xhr.getResponseHeader('X-Request-URL')
        }

        return;
      }

      xhr.onload = function() {
        var status = (xhr.status === 1223) ? 204 : xhr.status
        if (status < 100 || status > 599) {
          reject(new TypeError('Network request failed'))
          return
        }
        var options = {
          status: status,
          statusText: xhr.statusText,
          headers: headers(xhr),
          url: responseURL()
        }
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function register(settings) {
    /*
     *
     * [register process]
     *
     * generate actions _____
     *                       |------> generate document ------> generate handlers
     * fetch template   _____|                          ------> maybe render
     *
     */
    settings = Object.assign({
        actions: {},
        handlers: {}
    }, settings);

    var Widget = function Widget(options) {
        var _this = this;

        this.options = Object.assign({
            actions: {},
            handlers: {}
        }, options);
        if (!options.template) {
            throw new Error('need a template');
        }
        this.props = {};
        this.fetchPromise = Promise.all([fetchTemplate(options.template), function () {
            Object.keys(settings.actions).forEach(function (index) {
                settings.actions[index] = bindScope(_this, settings.actions[index]);
            });
            Object.keys(settings.handlers).forEach(function (index) {
                settings.handlers[index] = bindScope(_this, settings.handlers[index]);
            });
            Object.keys(options.actions).forEach(function (index) {
                options.actions[index] = bindScope(_this, options.actions[index]);
            });
            Object.keys(options.handlers).forEach(function (index) {
                options.handlers[index] = bindScope(_this, options.handlers[index]);
            });
            Object.keys(settings.actions).forEach(function (index) {
                Widget.prototype[index] = generateActions(settings.actions[index], options.actions[index]).bind(_this);
            });
            Widget.prototype.render = generateActions({
                before: settings.actions.render.before,
                method: render.bind(_this, settings.actions.render.method),
                after: settings.actions.render.after
            }, options.actions.render);

            function render(widgetRender, finish, flow) {
                var _this2 = this;

                var target = flow.target;
                if (this.fetchPromise) return this.fetchPromise.then(function () {
                    if (typeof target === 'string') {
                        target = document.querySelector(target);
                    } else if (target instanceof HTMLElement) {
                        target = target;
                    } else {
                        console.warn('first argument of render method should be selector string or dom');
                    }
                    _this2.props.targetDOM = target;
                    _this2.props.targetDOM.appendChild(_this2.props.template);
                }).then(function () {
                    return flow.callback && flow.callback();
                }) // defined in render callback
                .then(function () {
                    if (widgetRender && typeof widgetRender === 'function') widgetRender.call(_this2, finish);
                }).catch(function (err) {
                    return console.error('render err:' + err);
                });
            }
        }()]).then(function (args) {
            return generateDocument(_this, args[0] /* template:DocumentFragment */);
        }).then(function (args) {
            _this.props.dom = args.dom;
            _this.props.template = args.template;
            _this.init();
        }).catch(function (err) {
            return console.error(err.stack);
        });
        this.fetchPromise.then(function () {
            var handlers = settings.handlers;
            if (handlers) {
                Object.keys(handlers).forEach(function (index) {
                    options.handlers[index].method.call(_this, generateHandlers(settings.handlers[index]).bind(_this));
                });
            }
        }).catch(function (err) {
            return console.error(err.stack);
        });
    };
    Widget.prototype.remove = function () {
        while (this.props.targetDOM.firstChild) {
            this.props.targetDOM.removeChild(this.props.targetDOM.firstChild);
        }
    };
    return Widget;
}

function bindScope(scope, action) {
    return {
        before: action.before ? action.before.bind(scope) : function () {}.bind(scope),
        method: action.method ? action.method.bind(scope) : function () {}.bind(scope),
        after: action.after ? action.after.bind(scope) : function () {}.bind(scope)
    };
}

function fetchTemplate(src) {
    var fetchPromise = (0, _isomorphicFetch2.default)(src).then(function (response) {
        return response.text();
    }).then(function (body) {
        var template = document.createElement('template');
        template.innerHTML = body;
        var clone = document.importNode(template.content, true);
        return clone;
    }).catch(function (err) {
        return console.error(err.stack);
    });
    return fetchPromise;
};

function generateDocument(widget, template) {
    var dom = {};
    [].forEach.call(template.querySelectorAll('[data-info]'), function (doc) {
        var info = doc.getAttribute('data-info');
        dom[info] = doc;
    });
    [].forEach.call(template.querySelectorAll('[data-event]'), function (doc) {
        var events = doc.getAttribute('data-event');
        // TODO: proper error messages
        events.split('|').forEach(function (event) {
            var eventName;
            var action;
            event.split(':').forEach(function (token, index) {
                if (index === 0) eventName = token;else if (index === 1) action = token;
            });
            if (!widget[action]) {
                console.warn('No such method:' + action + ' in ' + events + ', check data-event and widget methods definition');
                return;
            }
            doc.addEventListener(eventName, widget[action].bind(widget));
        });
    });
    return {
        template: template,
        dom: dom
    };
}

function generateActions(widgetAction, userAction) {
    if (!userAction) {
        userAction = {
            before: function before() {},
            method: function method() {},
            after: function after() {}
        };
        console.warn('widget has some actions not defined');
    }
    return function (flow) {
        console.log(userAction.before);
        return Promise.resolve(wrapUserEvent(widgetAction.before, userAction.before, flow)).then(function (flow) {
            return widgetAction.method(userAction.method, flow);
        }).then(function (flow) {
            return wrapUserEvent(widgetAction.after, userAction.after, flow);
        }).catch(function (err) {
            return console.error(err.stack);
        });
    };
}

function generateHandlers(widgetHandler) {
    return function (flow) {
        return Promise.resolve(wrapUserEvent(widgetHandler.before, widgetHandler.before, flow)).then(function (flow) {
            return widgetHandler.method(flow);
        }).then(function (flow) {
            return wrapUserEvent(widgetHandler.after, widgetHandler.after, flow);
        }).catch(function (err) {
            return console.error(err.stack);
        });
    };
}

function wrapUserEvent(widget, user, flow) {
    var continueDefault = !user || user() || true;
    if (continueDefault || typeof continueDefault === 'undefined' || continueDefault) {
        if (widget) {
            return widget(flow) || flow; // if widget before/after return nothing, we use previous return value
        }
        return null;
    }
    return null;
}

exports.default = register;

},{"isomorphic-fetch":1}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AuthPanel = (0, _component2.default)({
    actions: {
        init: {
            before: function before() {},
            method: function method(finish) {
                console.log('dev init');
                finish();
            },
            after: function after() {}
        },
        render: {
            before: function before() {},
            method: function method(finish) {
                console.log('dev render');
                finish();
            },
            after: function after() {
                this.props.dom.key.value = localStorage.getItem('key');
                this.props.dom.secret.value = localStorage.getItem('secret');
                this.props.dom.username.value = localStorage.getItem('username');
                this.props.dom.extension.value = localStorage.getItem('extension');
                this.props.dom.password.value = localStorage.getItem('password');
            }
        },
        login: {
            before: function before() {
                console.log('wd before');
                this.props.dom.login.disabled = true;
                this.props.dom.error.textContent = '';
                this.interval = loading(this.props.dom.login, 'login');
            },
            method: function method(finish) {
                console.log('login');
                return finish();
            },
            after: function after() {
                console.log('wd after');
                this.props.dom.login.disabled = false;
                // stop loading animation
                if (this.interval) {
                    this.interval.cancel();
                    this.interval = null;
                }
                localStorage.setItem('server', this.props.dom.server.value || '');
                localStorage.setItem('key', this.props.dom.key.value || '');
                localStorage.setItem('secret', this.props.dom.secret.value || '');
                localStorage.setItem('username', this.props.dom.username.value || '');
                localStorage.setItem('extension', this.props.dom.extension.value || '');
                localStorage.setItem('password', this.props.dom.password.value || '');
            }
        }
    }
});

function loading(target, text) {
    var dotCount = 1;
    var interval = window.setInterval(function () {
        var dot = '';
        var dotCountTmp = dotCount;
        while (dotCount--) {
            dot += '.';
        }target.textContent = text + dot;
        dotCount = (dotCountTmp + 1) % 4;
    }, 500);
    return {
        cancel: function cancel(text) {
            if (interval) {
                window.clearInterval(interval);
                interval = null;
                if (typeof text !== 'undefined') target.textContent = text;
            }
        }
    };
}

exports.default = AuthPanel;

},{"../component":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AutoComplete = (0, _component2.default)({
    actions: {
        init: {
            before: function before() {},
            method: function method() {},
            after: function after() {}
        },
        render: {
            before: function before() {},
            method: function method(finish) {
                finish();
            },
            after: function after() {}
        },
        autoComplete: {
            before: function before() {},
            method: function method(finish) {
                this.props.prefix = this.props.dom.input.value;
                return finish();
            },
            after: function after(flow) {
                console.log(flow);
            }
        }
    }

});

exports.default = AutoComplete;

},{"../component":3}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CallLogItem = (0, _component2.default)({
    beforeUpdate: function beforeUpdate(action) {},
    afterUpdate: function afterUpdate(action) {},
    methods: {}
});

exports.default = CallLogItem;

},{"../component":3}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _callLogItem = require('./call-log-item');

var _callLogItem2 = _interopRequireDefault(_callLogItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CallLog = (0, _component2.default)({

    afterUpdate: function afterUpdate(action, options) {
        var allCallTab = this.props.dom.allCallTab;
        var missedCallTab = this.props.dom.missedCallTab;
        var logs = this.props.dom.logs;

        if (action === 'enableAllCallTab') {
            if (allCallTab.classList.contains('active') === false) {
                allCallTab.classList.add('active');
                missedCallTab.classList.remove('active');
            }
        } else if (action === 'enableMissedCallTab') {

            if (missedCallTab.classList.contains('active') === false) {
                missedCallTab.classList.add('active');
                allCallTab.classList.remove('active');
            }
        }
    },
    methods: {

        enableAllCallTab: function enableAllCallTab(finish, event) {

            return finish();
        },
        enableMissedCallTab: function enableMissedCallTab(finish, event) {

            return finish();
        },
        logUpdated: function logUpdated(logItems) {

            var props = this.props;
            logItems.forEach(function (item) {

                var callLogItem = new _callLogItem2.default({
                    template: '../template/call-log-item.html',
                    afterUpdate: function afterUpdate(action) {
                        if (action === 'mount') {
                            if (item.result === "Missed") {
                                this.props.dom.callResult.classList.add('call-missed');
                            }

                            if (item.direction === 'Outbound') {
                                if (item.to.name) {
                                    this.props.dom.contact.innerHTML = item.to.name;
                                } else {
                                    this.props.dom.contact.innerHTML = item.to.phoneNumber;
                                }

                                if (item.to.location) {
                                    this.props.dom.location.innerHTML = item.to.location;
                                }
                                this.props.dom.time.innerHTML = item.startTime;

                                if (item.result !== "Missed") {
                                    this.props.dom.callResult.classList.add('call-outbound');
                                }
                            } else {
                                if (item.from.name) {
                                    this.props.dom.contact.innerHTML = item.from.name;
                                } else {
                                    this.props.dom.contact.innerHTML = item.from.phoneNumber;
                                }
                                this.props.dom.time.innerHTML = item.startTime;

                                if (item.result !== "Missed") {
                                    this.props.dom.callResult.classList.add('call-inbound');
                                }
                            }
                        }
                    }

                });

                callLogItem.render(props.dom.logs);
            });
        }

    }
});

exports.default = CallLog;

},{"../component":3,"./call-log-item":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var state = {
    'HIDDEN': 0,
    'CALLIN': 1,
    'CALLOUT': 2,
    'ONLINE': 3
};
var currentState = state.HIDDEN;
var CallPanel = (0, _component2.default)({
    beforeUpdate: function beforeUpdate(action, options) {},
    afterUpdate: function afterUpdate(action, options) {
        if (action === 'mount') {
            currentState = state.HIDDEN;
            triggerView(this.props);
        } else if (action === 'answer') {
            currentState = state.ONLINE;
            triggerView(this.props);
        } else if (action === 'ignore') {
            currentState = state.HIDDEN;
            triggerView(this.props);
        } else if (action === 'cancel') {
            currentState = state.HIDDEN;
            triggerView(this.props);
        } else if (action === 'hangup') {
            currentState = state.HIDDEN;
            triggerView(this.props);
        } else if (action === 'record') {} else if (action === 'hold') {} else if (action === 'mute') {}
    },
    methods: {
        answer: function answer(finish) {
            return finish();
        },
        ignore: function ignore(finish) {
            return finish();
        },
        cancel: function cancel(finish) {
            return finish();
        },
        hangup: function hangup(finish) {
            return finish();
        },
        called: function called(event) {
            console.log('callin');
            currentState = state.CALLIN;
            triggerView(this.props);
        },
        callStarted: function callStarted(event) {
            console.log('call start');
            currentState = state.ONLINE;
            triggerView(this.props);
        },
        callRejected: function callRejected(event) {
            console.log('call reject');
            currentState = state.HIDDEN;
            triggerView(this.props);
        },
        callEnded: function callEnded(event) {
            console.log('end');
            currentState = state.HIDDEN;
            triggerView(this.props);
        },
        callFailed: function callFailed(event) {
            console.log('fail');
            currentState = state.HIDDEN;
            triggerView(this.props);
        }
    }
});

var triggerView = function triggerView(props) {
    props.dom['callin-panel'].style.display = 'none';
    props.dom['callout-panel'].style.display = 'none';
    props.dom['online-panel'].style.display = 'none';
    if (currentState === state.CALLIN) {
        props.dom['callin-panel'].style.display = 'block';
    } else if (currentState === state.CALLOUT) {
        props.dom['callout-panel'].style.display = 'block';
    } else if (currentState === state.ONLINE) {
        props.dom['online-panel'].style.display = 'block';
        // this.callTimeInterval = this.updateCallTime(this.line.timeCallStarted);
    }
};
var loading = function loading(target, text) {
    var dotCount = 1;
    var interval = window.setInterval(function () {
        var dot = '';
        var dotCountTmp = dotCount;
        while (dotCount--) {
            dot += '.';
        }target.textContent = text + dot;
        dotCount = (dotCountTmp + 1) % 4;
    }, 500);
    return {
        cancel: function cancel(text) {
            if (interval) {
                window.clearInterval(interval);
                interval = null;
                if (typeof text !== 'undefined') target.textContent = text;
            }
        }
    };
};
// var prototype.updateCallTime = function(startTime) {
//     // FIXME: it's not accurate
//     if (!startTime)
//         return;
//     var currentTime = Date.now() - startTime;
//     var callPanel = this;
//     var callTimeInterval = window.setInterval(() => {
//         var sec = currentTime % 60;
//         var min = Math.floor(currentTime / 60);
//         this.element.panel.onlinePanel.callTime.textContent = min + ":" + sec;
//         currentTime++;
//     }, 1000);
//     return {
//         cancel: function() {
//             if (!callTimeInterval)
//                 return;
//             window.clearInterval(callTimeInterval);
//             callPanel.element.panel.onlinePanel.callTime.textContent = "0:0";
//             callTimeInterval = null;
//         }
//     }
// };
exports.default = CallPanel;

},{"../component":3}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _autoComplete = require('./auto-complete');

var _autoComplete2 = _interopRequireDefault(_autoComplete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DialPad = (0, _component2.default)({
    actions: {
        init: {
            before: function before() {},
            method: function method() {},
            after: function after() {}
        },
        render: {
            before: function before() {},
            method: function method() {},
            after: function after() {
                var _this = this;

                var dialPad = this;
                var autoComplete = new _autoComplete2.default({
                    template: '../template/auto-complete.html',
                    actions: {
                        autoComplete: {
                            before: function before() {},
                            method: function method() {
                                return dialPad.getCandidates();
                            },
                            after: function after() {}
                        }
                    },
                    handlers: {}
                });
                autoComplete.render({
                    target: this.props.dom.number,
                    callback: function callback() {
                        _this.props.autoComplete = autoComplete;
                    }
                });
            }
        },
        dialing: {
            before: function before() {},
            method: function method(finish) {
                var button = event.target;
                var ac = this.props.autoComplete;
                ac.props.dom.input.value += button.getAttribute('data-value');
                ac.autoComplete();
                return finish();
            },
            after: function after() {}
        },
        callout: {
            before: function before() {
                this.interval = loading(this.props.dom.callout, 'Call');
            },
            method: function method(finish) {
                var ac = this.props.autoComplete;
                this.props.toNumber = ac.props.dom.input.value;
                this.props.fromNumber = localStorage.getItem('username');
                return finish();
            },
            after: function after() {
                if (this.interval) {
                    this.interval.cancel('Call');
                    this.interval = null;
                }
            }
        },
        getCandidates: {
            before: function before() {},
            method: function method(finish) {
                return finish();
            },
            after: function after() {}
        }
    }
});

function loading(target, text) {
    var dotCount = 1;
    var interval = window.setInterval(function () {
        var dot = '';
        var dotCountTmp = dotCount;
        while (dotCount--) {
            dot += '.';
        }target.textContent = text + dot;
        dotCount = (dotCountTmp + 1) % 4;
    }, 500);
    return {
        cancel: function cancel(text) {
            if (interval) {
                window.clearInterval(interval);
                interval = null;
                if (typeof text !== 'undefined') target.textContent = text;
            }
        }
    };
}
exports.default = DialPad;

},{"../component":3,"./auto-complete":5}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _rcSdk = require('./rc-sdk');

var _rcSdk2 = _interopRequireDefault(_rcSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CallLogService = function (sdk) {

    var callLogUpdatedHandlers = [];

    return {

        getCallLogs: function getCallLogs() {

            sdk.platform().get('/account/~/extension/~/call-log', { dateFrom: '2016-2-28' }).then(function (response) {
                var records = response.json().records;
                callLogUpdatedHandlers.forEach(function (fun) {
                    return fun(records);
                });
            }).catch(function (e) {
                console.error('Recent Calls Error: ' + e.message);
            });
        },

        registerCallLogUpdatedHandler: function registerCallLogUpdatedHandler(handler) {
            callLogUpdatedHandlers.push(handler);
        }
    };
}(_rcSdk2.default);

exports.default = CallLogService;

},{"./rc-sdk":14}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var sdk = new RingCentral.SDK({
    appKey: 'eac8797af1b3502F2CEAAEECAC3Ed378AA7858A386656f28A008b0c638A754B1',
    appSecret: 'c082702E4ea4DA18c4b1377917778a8aafabCA3Be579B78B66d17C36874b27F4',
    server: RingCentral.SDK.server.production
});
var webPhone = new RingCentral.WebPhone({
    audioHelper: {
        incoming: '../demo/audio/incoming.ogg',
        outgoing: '../demo/audio/outgoing.ogg'
    }
});;
var rcHelper = function (sdk, webPhone) {
    var line;
    var handlers = {
        called: [],
        callStarted: [],
        callRejected: [],
        callEnded: [],
        callFailed: []
    };
    return {
        login: function login(props) {
            console.log('helper login');
            var dom = props.dom;
            return sdk.platform().login({
                username: dom.username.value,
                extension: dom.extension.value,
                password: dom.password.value
            }).then(function () {
                return registerSIP();
            });

            function registerSIP() {
                console.log('register');
                return sdk.platform().post('/client-info/sip-provision', {
                    sipInfo: [{
                        transport: 'WSS'
                    }]
                }).then(function (res) {
                    var data = res.json();
                    console.log("Sip Provisioning Data from RC API: " + JSON.stringify(data));
                    console.log(data.sipFlags.outboundCallsEnabled);
                    var checkFlags = false;
                    return webPhone.register(data, checkFlags).then(function () {
                        console.log('Registered');
                    }).catch(function (e) {
                        return Promise.reject(err);
                    });
                }).catch(function (e) {
                    return console.error(e);
                });
            }
        },
        callout: function callout(props) {
            console.log('user callout');
            var toNumber = props.toNumber;
            var fromNumber = props.fromNumber;

            // TODO: validate toNumber and fromNumber
            if (!sdk || !webPhone) {
                throw Error('Need to set up SDK and webPhone first.');
                return;
            }
            return sdk.platform().get('/restapi/v1.0/account/~/extension/~').then(function (res) {
                console.log(res);
                var info = res.json();
                if (info && info.regionalSettings && info.regionalSettings.homeCountry) {
                    return info.regionalSettings.homeCountry.id;
                }
                return null;
            }).then(function (countryId) {
                webPhone.call(toNumber, fromNumber, countryId);
            }).catch(function (e) {
                return console.error(e);
            });
        },
        answer: function answer(props) {
            return webPhone.answer(line).catch(function (e) {
                console.error(e);
            });
        },
        ignore: function ignore(props) {},
        cancel: function cancel(props) {
            return line.cancel().catch(function (e) {
                console.error(e);
            });
        },
        hangup: function hangup(props) {
            return webPhone.hangup(line).catch(function (err) {
                return console.error(err);
            });
        },
        record: function record(props) {},
        hold: function hold(props) {},
        mute: function mute(props) {},
        called: function called(handler) {
            handlers.called.push(handler);
        },
        callStarted: function callStarted(handler) {
            handlers.callStarted.push(handler);
        },
        callRejected: function callRejected(handler) {
            handlers.callRejected.push(handler);
        },
        callEnded: function callEnded(handler) {
            handlers.callEnded.push(handler);
        },
        callFailed: function callFailed(handler) {
            handlers.callFailed.push(handler);
        },
        initPhoneListener: function initPhoneListener(props) {
            var _this = this;

            webPhone.ua.on('sipIncomingCall', function (e) {
                console.log(handlers);
                line = e;
                handlers.called.forEach(function (h) {
                    return h(e);
                });
            });
            webPhone.ua.on('callStarted', function (e) {
                console.log(handlers);
                console.log(_this);
                handlers.callStarted.forEach(function (h) {
                    return h(e);
                });
            });
            webPhone.ua.on('callRejected', function (e) {
                console.log(handlers);
                handlers.callRejected.forEach(function (h) {
                    return h(e);
                });
            });
            webPhone.ua.on('callEnded', function (e) {
                console.log(handlers);
                handlers.callEnded.forEach(function (h) {
                    return h(e);
                });
            });
            webPhone.ua.on('callFailed', function (e) {
                console.log(handlers);
                handlers.callFailed.forEach(function (h) {
                    return h(e);
                });
            });
        },
        getCandidates: function getCandidates(props) {
            // FIXME: because of nested component
            var prefix = props.autoComplete.props.prefix;
            var test = ['111', '222', '333'];
            return test.filter(function (item) {
                return item.indexOf(prefix) === 0;
            });
        }
    };
}(sdk, webPhone);
exports.default = rcHelper;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _rcSdk = require('./rc-sdk');

var _rcSdk2 = _interopRequireDefault(_rcSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LoginService = function (sdk) {

    var onLoginHandler = [];

    return {

        login: function login(username, extension, password) {
            console.log('LoginService -> start login');
            return sdk.platform().login({
                'username': username,
                'extension': extension,
                'password': password
            }).then(function () {
                onLoginHandler.forEach(function (handler) {
                    return handler();
                });
            });
        },

        checkLoginStatus: function checkLoginStatus() {

            return sdk.platform().loggedIn().then(function (isLoggedIn) {
                if (isLoggedIn) {
                    onLoginHandler.forEach(function (handler) {
                        return handler();
                    });
                }
                return isLoggedIn;
            });
        },

        registerLoginHandler: function registerLoginHandler(handler) {
            onLoginHandler.push(handler);
        }

    };
}(_rcSdk2.default);

exports.default = LoginService;

},{"./rc-sdk":14}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _rcSdk = require('./rc-sdk');

var _rcSdk2 = _interopRequireDefault(_rcSdk);

var _rcWebphone = require('./rc-webphone');

var _rcWebphone2 = _interopRequireDefault(_rcWebphone);

var _loginService = require('./login-service');

var _loginService2 = _interopRequireDefault(_loginService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PhoneService = function () {
    var line;
    var handlers = {
        called: [],
        callStarted: [],
        callRejected: [],
        callEnded: [],
        callFailed: []
    };

    return {

        registerSIP: function registerSIP() {
            return _rcSdk2.default.platform().post('/client-info/sip-provision', {
                sipInfo: [{
                    transport: 'WSS'
                }]
            }).then(function (res) {
                var data = res.json();
                console.log("Sip Provisioning Data from RC API: " + JSON.stringify(data));
                console.log(data.sipFlags.outboundCallsEnabled);
                var checkFlags = false;
                return _rcWebphone2.default.register(data, checkFlags).then(function () {
                    console.log('Registered');
                }).catch(function (e) {
                    return Promise.reject(err);
                });
            }).catch(function (e) {
                return console.error(e);
            });
        },

        callout: function callout(fromNumber, toNumber) {
            console.log('user callout');

            // TODO: validate toNumber and fromNumber
            if (!_rcSdk2.default || !_rcWebphone2.default) {
                throw Error('Need to set up SDK and webPhone first.');
                return;
            }
            return _rcSdk2.default.platform().get('/restapi/v1.0/account/~/extension/~').then(function (res) {
                console.log(res);
                var info = res.json();
                if (info && info.regionalSettings && info.regionalSettings.homeCountry) {
                    return info.regionalSettings.homeCountry.id;
                }
                return null;
            }).then(function (countryId) {
                _rcWebphone2.default.call(toNumber, fromNumber, countryId);
            }).catch(function (e) {
                return console.error(e);
            });
        },
        answer: function answer(props) {
            return _rcWebphone2.default.answer(line).catch(function (e) {
                console.error(e);
            });
        },
        ignore: function ignore(props) {},
        cancel: function cancel(props) {
            return line.cancel().catch(function (e) {
                console.error(e);
            });
        },
        hangup: function hangup(props) {
            return _rcWebphone2.default.hangup(line).catch(function (err) {
                return console.error(err);
            });
        },
        called: function called(handler) {
            handlers.called.push(handler);
        },
        callStarted: function callStarted(handler) {
            handlers.callStarted.push(handler);
        },
        callRejected: function callRejected(handler) {
            handlers.callRejected.push(handler);
        },
        callEnded: function callEnded(handler) {
            handlers.callEnded.push(handler);
        },
        callFailed: function callFailed(handler) {
            handlers.callFailed.push(handler);
        },
        initPhoneListener: function initPhoneListener(props) {
            var _this = this;

            _rcWebphone2.default.ua.on('sipIncomingCall', function (e) {
                console.log(handlers);
                line = e;
                handlers.called.forEach(function (h) {
                    return h(e);
                });
            });
            _rcWebphone2.default.ua.on('callStarted', function (e) {
                console.log(handlers);
                console.log(_this);
                handlers.callStarted.forEach(function (h) {
                    return h(e);
                });
            });
            _rcWebphone2.default.ua.on('callRejected', function (e) {
                console.log(handlers);
                handlers.callRejected.forEach(function (h) {
                    return h(e);
                });
            });
            _rcWebphone2.default.ua.on('callEnded', function (e) {
                console.log(handlers);
                handlers.callEnded.forEach(function (h) {
                    return h(e);
                });
            });
            _rcWebphone2.default.ua.on('callFailed', function (e) {
                console.log(handlers);
                handlers.callFailed.forEach(function (h) {
                    return h(e);
                });
            });
        }

    };
}();

exports.default = PhoneService;

},{"./login-service":12,"./rc-sdk":14,"./rc-webphone":15}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var sdk = new RingCentral.SDK({
    appKey: '8mOtYiilT5OUPwwdeGgvpw',
    appSecret: 'cqNn89RmR2SR76Kpp8xJaAdNzNOqR8Qfmjb0B-gDOHTw',
    server: RingCentral.SDK.server.production
});

exports.default = sdk;

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var webPhone = new RingCentral.WebPhone({
    audioHelper: {}
});

exports.default = webPhone;

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PhoneService = exports.CallLogService = exports.LoginService = exports.webPhone = exports.sdk = exports.rcHelper = exports.AutoComplete = exports.CallLogItem = exports.CallLog = exports.DialPad = exports.CallPanel = exports.AuthPanel = undefined;

var _authPanel = require('./components/auth-panel');

var _authPanel2 = _interopRequireDefault(_authPanel);

var _callPanel = require('./components/call-panel');

var _callPanel2 = _interopRequireDefault(_callPanel);

var _dialPad = require('./components/dial-pad');

var _dialPad2 = _interopRequireDefault(_dialPad);

var _callLog = require('./components/call-log');

var _callLog2 = _interopRequireDefault(_callLog);

var _callLogItem = require('./components/call-log-item');

var _callLogItem2 = _interopRequireDefault(_callLogItem);

var _autoComplete = require('./components/auto-complete');

var _autoComplete2 = _interopRequireDefault(_autoComplete);

var _helper = require('./helpers/helper');

var _helper2 = _interopRequireDefault(_helper);

var _rcSdk = require('./helpers/rc-sdk');

var _rcSdk2 = _interopRequireDefault(_rcSdk);

var _rcWebphone = require('./helpers/rc-webphone');

var _rcWebphone2 = _interopRequireDefault(_rcWebphone);

var _loginService = require('./helpers/login-service');

var _loginService2 = _interopRequireDefault(_loginService);

var _callLogService = require('./helpers/call-log-service');

var _callLogService2 = _interopRequireDefault(_callLogService);

var _phoneService = require('./helpers/phone-service');

var _phoneService2 = _interopRequireDefault(_phoneService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.AuthPanel = _authPanel2.default;
window.CallPanel = _callPanel2.default;
window.DialPad = _dialPad2.default;
window.CallLog = _callLog2.default;
window.CallLogItem = _callLogItem2.default;
window.AutoComplete = _autoComplete2.default;
window.rcHelper = _helper2.default;
window.sdk = _rcSdk2.default;
window.webPhone = _rcWebphone2.default;
window.LoginService = _loginService2.default;
window.CallLogService = _callLogService2.default;
window.PhoneService = _phoneService2.default;

exports.AuthPanel = _authPanel2.default;
exports.CallPanel = _callPanel2.default;
exports.DialPad = _dialPad2.default;
exports.CallLog = _callLog2.default;
exports.CallLogItem = _callLogItem2.default;
exports.AutoComplete = _autoComplete2.default;
exports.rcHelper = _helper2.default;
exports.sdk = _rcSdk2.default;
exports.webPhone = _rcWebphone2.default;
exports.LoginService = _loginService2.default;
exports.CallLogService = _callLogService2.default;
exports.PhoneService = _phoneService2.default;

},{"./components/auth-panel":4,"./components/auto-complete":5,"./components/call-log":7,"./components/call-log-item":6,"./components/call-panel":8,"./components/dial-pad":9,"./helpers/call-log-service":10,"./helpers/helper":11,"./helpers/login-service":12,"./helpers/phone-service":13,"./helpers/rc-sdk":14,"./helpers/rc-webphone":15}]},{},[16])


//# sourceMappingURL=build.js.map
