System.register("dom-console", [], function($__export) {
  "use strict";
  var __moduleName = "dom-console";
  var output,
      _log,
      _error,
      error,
      log,
      logHTML,
      install,
      clear,
      cons;
  function coerce(val) {
    if (val === Number.POSITIVE_INFINITY) {
      val = '<i>positive infinity</i>';
    } else if (val === Number.NEGATIVE_INFINITY) {
      val = '<i>negative infinity</i>';
    } else if (typeof val === 'number' && isNaN(val)) {
      val = '<i>not a number</i>';
    } else if (val === undefined) {
      val = '<i>undefined</i>';
    } else if (val === null) {
      val = '<i>null</i>';
    } else if (typeof val === 'function') {
      val = val.toString();
    } else {
      val = JSON.stringify(val);
    }
    return val;
  }
  return {
    setters: [],
    execute: function() {
      output = null;
      _log = console.log;
      _error = console.error;
      error = function(t) {
        _error.apply(console, arguments);
        if (output === null) {
          return;
        }
        output.innerHTML += '<pre class="error">&gt; ' + t.toString() + '</pre>';
        output.scrollTop = output.scrollHeight;
      };
      log = function(t) {
        var a = [];
        _log.apply(console, arguments);
        if (arguments.length >= 1 && t !== undefined) {
          t = Array.prototype.slice.apply(arguments);
          for (var i = 0; i < t.length; i += 1) {
            a.push(coerce(t[i]));
          }
          t = a.join('<br>&gt; ');
        } else {
          t = '';
        }
        if (output === null) {
          return;
        }
        output.innerHTML += '<pre>&gt; ' + t.toString() + '</pre>';
        output.scrollTop = output.scrollHeight;
      };
      logHTML = function(s) {
        log(s.replace(/</g, '&lt;'));
      };
      install = function(elem) {
        if (typeof elem === 'string') {
          elem = document.querySelector(elem);
        }
        output = elem;
      };
      clear = function() {
        if (output !== null) {
          output.innerHTML = '';
        }
      };
      cons = $__export("cons", {
        clear: clear,
        error: error,
        log: log,
        logHTML: logHTML,
        install: install
      });
      console.log = log;
      console.error = error;
      console.logHTML = logHTML;
    }
  };
});
