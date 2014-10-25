System.register("repl", ["tests"], function($__export) {
  "use strict";
  var __moduleName = "repl";
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
        var test = tests[testName];
        if (test === undefined || test.nativeSupport) {
          return nativeEval;
        } else if (test.traceurSupport) {
          return traceurEval;
        } else {
          return noopEval;
        }
      });
    }
  };
});
