System.register("tests", ["data-es6"], function($__export) {
  "use strict";
  var __moduleName = "tests";
  var data,
      tests,
      Test,
      test;
  return {
    setters: [function(m) {
      data = m.default;
    }],
    execute: function() {
      tests = $__export("tests", {});
      Test = (function() {
        var Test = function Test(name, link, criterion, traceurSupport) {
          this.name = name;
          this.link = link;
          this.traceurSupport = traceurSupport;
          if (typeof criterion !== 'function') {
            criterion = criterion[0].script;
          }
          criterion = criterion.toString().replace('/*', '').replace('*/', '');
          if (this.name === 'let') {
            criterion = criterion.replace('test', 'return ');
          } else if (this.name === 'Array.prototype.entries') {
            criterion = 'function(){return [].entries && [].entries().next;}';
          }
          try {
            this.nativeSupport = eval('(' + criterion + ')()');
          } catch (e) {}
        };
        return ($traceurRuntime.createClass)(Test, {}, {});
      }());
      for (var $__1 = data.tests[Symbol.iterator](),
          $__2; !($__2 = $__1.next()).done; ) {
        test = $__2.value;
        {
          if (test.exec === undefined) {
            continue;
          }
          tests[test.name] = new Test(test.name, test.link, test.exec, test.res.tr);
        }
      }
    }
  };
});
