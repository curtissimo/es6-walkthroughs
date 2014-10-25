System.register("simple-walkthrough-setup", ["repl", "dom-console"], function($__export) {
  "use strict";
  var __moduleName = "simple-walkthrough-setup";
  var factory,
      cons,
      q,
      evaluator,
      assetLocation,
      forms,
      editor,
      handlers,
      ajax,
      run;
  return {
    setters: [function(m) {
      factory = m.factory;
    }, function(m) {
      cons = m.cons;
    }],
    execute: function() {
      cons.install('#console');
      q = decodeURIComponent(location.search.substring(1));
      evaluator = factory(q);
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
      editor.getSession().setValue('// loading content...');
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
      ajax = new XMLHttpRequest();
      if (ajax.overrideMimeType) {
        ajax.overrideMimeType('application/json');
      }
      ajax.addEventListener('load', (function(e) {
        try {
          var spec = JSON.parse(e.target.response);
          document.title = spec.title;
          editor.getSession().setValue(spec.code);
        } catch (e) {
          editor.getSession().setValue('// :(');
          cons.error('Error loading content for ' + q);
        }
      }));
      ajax.addEventListener('error', (function(e) {
        editor.getSession().setValue('// :(');
        cons.error('Error loading content for ' + q);
      }));
      ajax.addEventListener('abort', (function(e) {
        editor.getSession().setValue('// :(');
        cons.error('Error loading content for ' + q);
        cons.error(e);
      }));
      ajax.open('GET', assetLocation + q + '.json');
      try {
        ajax.send();
      } catch (e) {
        cons.error(e);
      }
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
