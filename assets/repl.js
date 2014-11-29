System.register("repl", ["tests"], function($__export) {
  "use strict";
  var __moduleName = "repl";
  function require(path) {
    return $traceurRuntime.require("repl", path);
  }
  var tests,
      factory;
  function nativeEval(content, cb) {
    try {
      eval('"use strict";' + content);
      cb();
    } catch (e) {
      cb(e);
    }
  }
  function noopEval() {
    console.error('cannot evaluate this functionality...');
  }
  function traceurEval(content, cb) {
    traceur.options.experimental = true;
    var options = {
      address: 'foo',
      name: 'foo',
      referrer: window.location.href,
      tracuerOptions: traceur.options
    };
    traceur.System.module(content, options).then((function() {
      return cb();
    })).catch((function(e) {
      return cb(e);
    }));
  }
  return {
    setters: [function(m) {
      tests = m.tests;
    }],
    execute: function() {
      factory = $__export("factory", function(testName) {
        if (!Array.isArray(testName)) {
          testName = [testName];
        }
        var nativeSupport = true;
        var traceurSupport = true;
        for (var $__0 = testName[$traceurRuntime.toProperty(Symbol.iterator)](),
            $__1; !($__1 = $__0.next()).done; ) {
          var name = $__1.value;
          {
            var test = tests[name];
            nativeSupport = nativeSupport && test.nativeSupport;
            traceurSupport = traceurSupport && test.traceurSupport;
          }
        }
        if (nativeSupport) {
          return nativeEval;
        } else if (traceurSupport) {
          return traceurEval;
        } else {
          return noopEval;
        }
      });
    }
  };
});
