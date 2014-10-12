var i, editor, log, flush, prefix, evaluator, nativeEval, traceurEval, _log, forms, subprefix, ajax, q, run;
(function (tests) {
  var assetLocation, evaller;
  evaller  = document.getElementById('use-traceur').parentNode;
  q = decodeURIComponent(location.search.substring(1));
  assetLocation = document.body.getAttribute('data-asset-location');

  if (!tests[q].tr) {
    evaller.parentNode.removeChild(evaller);
  }

  forms = document.querySelectorAll('form.unsubmitable')
  for (i = 0; i < forms.length; i += 1) {
    forms[i].addEventListener('submit', function (e) {
      e.preventDefault();
    });
  }

  function saveHandler(e) {
    e.preventDefault();
    document.getElementById('run').click();
  }

  function clearHandler(e) {
    e.preventDefault();
    document.getElementById('clear-console').click();
  }

  function resizeHandler() {
    var height = window.innerHeight - 2 * document.querySelector('form.unsubmitable').offsetHeight - 10;
    document.getElementById('console').style.height = height + 'px';
    editor.container.style.height = height + 20 + 'px';
    editor.resize();
  }

  traceurEval = function () {
    prefix = 'traceur';
    subprefix = '       ';
    var c, options;
    c = editor.getValue();
    options = {
      address: 'foo',
      name: 'foo',
      referrer: window.location.href,
      traceurOptions: traceur.options
    };
    try {
      System.module(c, options)
        .then(function (m) {
          flush();
        })
        .catch(function (e) {
          log = '';
          console.error(e.message);
        });
    } catch (e) {
      log = '';
      console.error(e.message);
    }
  }
  evaluator = traceurEval;

  editor = ace.edit('editor');
  editor.setTheme('ace/theme/twilight');
  editor.getSession().setTabSize(2);
  editor.getSession().setMode('ace/mode/javascript');
  editor.getSession().setValue('// loading content...');

  console.error = function (t) {
    var c = document.getElementById('console');
    c.innerHTML += '<pre class="error">[' + prefix + ']&gt; ' + t.toString() + '</pre>';
    c.scrollTop = c.scrollHeight;
  };

  ajax = new XMLHttpRequest();
  if (ajax.overrideMimeType) {
    ajax.overrideMimeType('application/json');
  }
  ajax.addEventListener('load', function (e) {
    try {
      var spec = JSON.parse(e.target.response);
      document.title = spec.title;
      editor.getSession().setValue(spec.code);
    } catch (e) {
      editor.getSession().setValue('// :(');
      console.error('Error loading content for ' + q);
    }
  });
  ajax.addEventListener('error', function (e) {
    editor.getSession().setValue('// :(');
    console.error('Error loading content for ' + q);
  });
  ajax.addEventListener('abort', function (e) {
    _log.call(console, e);
    editor.getSession().setValue('// :(');
    console.error('Error loading content for ' + q);
  });
  ajax.open('GET', assetLocation + q + '.json');
  try {
    ajax.send();
  } catch (e) {
    console.error(e);
  }

  editor.container.getElementsByTagName('textarea')[0].addEventListener('keydown', function (e) {
    if (e.which === 83 && (e.metaKey || e.ctrlKey)) {
      saveHandler(e);
    } else if (e.which === 27) {
      clearHandler(e);
    }
  });
  window.addEventListener('resize', resizeHandler);
  resizeHandler();

  log = '';
  _log = console.log;
  console.log = function (t) {
    var a = [], i;
    if (document.getElementById('use-console').checked) {
      _log.apply(console, arguments);
    }
    if (arguments.length >= 1 && t !== undefined) {
      t = Array.prototype.slice.apply(arguments);
      for (i = 0; i < t.length; i += 1) {
        if (t[i] === Number.POSITIVE_INFINITY) {
          a.push('<i>positive infinity</i>');
        } else if(t[i] === Number.NEGATIVE_INFINITY) {
          a.push('<i>negative infinity</i>');
        } else if (typeof t[i] === 'number' && isNaN(t[i])) {
          a.push('<i>not a number</i>');
        } else if (t[i] === undefined) {
          a.push('<i>undefined</i>');
        } else if (t[i] === null) {
          a.push('<i>null</i>');
        } else if (typeof t[i] === 'function') {
          a.push(t[i].toString());
        } else {
          a.push(JSON.stringify(t[i]));
        }
      }
      t = a.join('<br> ' + subprefix + ' > ');
    } else {
      t = '';
    }
    log += '<pre>[' + prefix + ']&gt; ' + t.toString() + '</pre>';
  };
  console.logHTML = function (s) {
    console.log(s.replace(/</g, '&lt;'));
  };
  flush = function () {
    var c = document.getElementById('console');
    c.innerHTML += log;
    log = '';
    c.scrollTop = c.scrollHeight;
  };

  Mousetrap.bind([ 'ctrl+s', 'command+s' ], saveHandler);
  Mousetrap.bind('esc', clearHandler);
  traceur.options.experimental = true;

  run = document.getElementById('run');
  run.addEventListener('click', function () {
    evaluator();
  });

  if (window.navigator.platform.indexOf('Mac') < 0) {
    run.innerHTML = '<span class="fa fa-play"></span> Run (Ctrl+S)';
  }

  document
    .getElementById('clear-console')
    .addEventListener('click', function () {
      document.querySelector('#console').innerHTML = '';
    });
}(tests));
