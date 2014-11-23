System.register("narrated-walkthrough-setup", ["loader"], function($__export) {
  "use strict";
  var __moduleName = "narrated-walkthrough-setup";
  function require(path) {
    return $traceurRuntime.require("narrated-walkthrough-setup", path);
  }
  var loader,
      handlers,
      test,
      cb,
      editor;
  return {
    setters: [function(m) {
      loader = m.default;
    }],
    execute: function() {
      handlers = {resize: function() {
          console.log('moo');
        }};
      test = (function() {
        return document.getElementById('editor').className.contains('ace-twilight');
      });
      cb = (function() {
        return handlers.resize();
      });
      loader('workspace', 'loader', test, cb);
      editor = ace.edit('editor');
      editor.setTheme('ace/theme/twilight');
    }
  };
});
