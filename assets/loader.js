System.register("loader", [], function($__export) {
  "use strict";
  var __moduleName = "loader";
  function require(path) {
    return $traceurRuntime.require("loader", path);
  }
  return {
    setters: [],
    execute: function() {
      $__export('default', function(inId, outId, test, cb) {
        var interval = setInterval((function() {
          if (test()) {
            clearInterval(interval);
            setTimeout((function() {
              document.getElementById(inId).style.opacity = 1;
              document.getElementById(outId).style.opacity = 0;
              interval = setInterval((function() {
                var opacity = parseInt(window.getComputedStyle(document.getElementById(outId), null).getPropertyValue('opacity'), 10);
                if (opacity === 0) {
                  clearInterval(interval);
                  var loader = document.getElementById(outId);
                  loader.parentNode.removeChild(loader);
                }
              }), 500);
              cb();
            }), 500);
          }
        }), 500);
      });
    }
  };
});
