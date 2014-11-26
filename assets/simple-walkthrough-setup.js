System.register("simple-walkthrough-setup", ["repl", "dom-console", "loader"], function($__export) {
  "use strict";
  var __moduleName = "simple-walkthrough-setup";
  function require(path) {
    return $traceurRuntime.require("simple-walkthrough-setup", path);
  }
  var factory,
      cons,
      loader,
      evaluator,
      install,
      assetLocation,
      forms,
      editor,
      handlers,
      run,
      test,
      cb;
  return {
    setters: [function(m) {
      factory = m.factory;
    }, function(m) {
      cons = m.cons;
    }, function(m) {
      loader = m.default;
    }],
    execute: function() {
      cons.install('#console');
      install = $__export("install", (function(test) {
        return evaluator = factory(test);
      }));
      assetLocation = document.body.getAttribute('data-asset-location');
      forms = Array.from(document.querySelectorAll('form.unsubmitable'));
      for (var $__0 = forms[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__1; !($__1 = $__0.next()).done; ) {
        var form = $__1.value;
        {
          form.addEventListener('submit', function(e) {
            e.preventDefault();
          });
        }
      }
      editor = ace.edit('editor');
      editor.setTheme('ace/theme/twilight');
      editor.getSession().setTabSize(2);
      editor.getSession().setMode('ace/mode/javascript');
      editor.container.getElementsByTagName('textarea')[0].addEventListener('keydown', (function(e) {
        if (e.which === 69 && (e.metaKey || e.ctrlKey)) {
          handlers.evaluate(e);
        } else if (e.which === 27) {
          handlers.clear(e);
        }
      }));
      handlers = {
        evaluate: function(e) {
          e.preventDefault();
          evaluator(editor.getValue(), (function(e) {
            if (e) {
              cons.error(e);
            }
          }));
        },
        clear: function(e) {
          e.preventDefault();
          cons.clear();
        },
        resize: function() {
          var height = window.innerHeight - 2 * document.querySelector('form.unsubmitable').offsetHeight - 10;
          document.getElementById('console').style.height = height + 'px';
          editor.container.style.height = height + 20 + 'px';
          editor.resize();
        }
      };
      window.addEventListener('resize', handlers.resize);
      handlers.resize();
      Mousetrap.bind(['ctrl+e', 'command+e'], handlers.evaluate);
      Mousetrap.bind('esc', handlers.clear);
      document.getElementById('clear-console').addEventListener('click', handlers.clear);
      run = document.getElementById('evaluate');
      run.addEventListener('click', handlers.evaluate);
      if (window.navigator.platform.indexOf('Mac') < 0) {
        run.innerHTML = '<span class="fa fa-play"></span> Evaluate (Ctrl+S)';
      }
      test = (function() {
        return document.getElementById('editor').className.contains('ace-twilight');
      });
      cb = (function() {
        return handlers.resize();
      });
      loader('workspace', 'loader', test, cb);
    }
  };
});
