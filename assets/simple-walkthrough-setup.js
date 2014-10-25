System.register("simple-walkthrough-setup", ["repl", "dom-console"], function($__export) {
  "use strict";
  var __moduleName = "simple-walkthrough-setup";
  var factory,
      cons,
      evaluator,
      install,
      assetLocation,
      forms,
      editor,
      handlers,
      run;
  return {
    setters: [function(m) {
      factory = m.factory;
    }, function(m) {
      cons = m.cons;
    }],
    execute: function() {
      cons.install('#console');
      install = $__export("install", (function(test) {
        return evaluator = factory(test);
      }));
      assetLocation = document.body.getAttribute('data-asset-location');
      forms = Array.from(document.querySelectorAll('form.unsubmitable'));
      for (var $__0 = forms[Symbol.iterator](),
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
        if (e.which === 83 && (e.metaKey || e.ctrlKey)) {
          handlers.save(e);
        } else if (e.which === 27) {
          handlers.clear(e);
        }
      }));
      handlers = {
        save: function(e) {
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
      Mousetrap.bind(['ctrl+s', 'command+s'], handlers.save);
      Mousetrap.bind('esc', handlers.clear);
      document.getElementById('clear-console').addEventListener('click', handlers.clear);
      run = document.getElementById('run');
      run.addEventListener('click', handlers.save);
      if (window.navigator.platform.indexOf('Mac') < 0) {
        run.innerHTML = '<span class="fa fa-play"></span> Run (Ctrl+S)';
      }
    }
  };
});
