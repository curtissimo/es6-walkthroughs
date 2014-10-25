import { factory } from 'repl';
import { cons } from 'dom-console';

cons.install('#console');

let q = decodeURIComponent(location.search.substring(1));
let evaluator = factory(q);
let assetLocation = document.body.getAttribute('data-asset-location');

let forms = Array.from(document.querySelectorAll('form.unsubmitable'));
for (let form of forms) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
  });
}

let editor = ace.edit('editor');
editor.setTheme('ace/theme/twilight');
editor.getSession().setTabSize(2);
editor.getSession().setMode('ace/mode/javascript');
editor.getSession().setValue('// loading content...');
editor.container.getElementsByTagName('textarea')[0].addEventListener('keydown', e => {
  if (e.which === 83 && (e.metaKey || e.ctrlKey)) {
    handlers.save(e);
  } else if (e.which === 27) {
    handlers.clear(e);
  }
});

let handlers = {
  save(e) {
    e.preventDefault();
    evaluator(editor.getValue(), e => {
      if(e) {
        cons.error(e);
      }
    });
  },

  clear(e) {
    e.preventDefault();
    cons.clear();
  },

  resize() {
    let height = window.innerHeight - 2 * document.querySelector('form.unsubmitable').offsetHeight - 10;
    document.getElementById('console').style.height = height + 'px';
    editor.container.style.height = height + 20 + 'px';
    editor.resize();
  }
};

let ajax = new XMLHttpRequest();
if (ajax.overrideMimeType) {
  ajax.overrideMimeType('application/json');
}
ajax.addEventListener('load', e => {
  try {
    let spec = JSON.parse(e.target.response);
    document.title = spec.title;
    editor.getSession().setValue(spec.code);
  } catch (e) {
    editor.getSession().setValue('// :(');
    cons.error('Error loading content for ' + q);
  }
});
ajax.addEventListener('error', e => {
  editor.getSession().setValue('// :(');
  cons.error('Error loading content for ' + q);
});
ajax.addEventListener('abort', e => {
  editor.getSession().setValue('// :(');
  cons.error('Error loading content for ' + q);
  cons.error(e);
});
ajax.open('GET', assetLocation + q + '.json');
try {
  ajax.send();
} catch (e) {
  cons.error(e);
}

window.addEventListener('resize', handlers.resize);
handlers.resize();

Mousetrap.bind([ 'ctrl+s', 'command+s' ], handlers.save);
Mousetrap.bind('esc', handlers.clear);

document
  .getElementById('clear-console')
  .addEventListener('click', handlers.clear);

let run = document.getElementById('run');
run.addEventListener('click', handlers.save);

if (window.navigator.platform.indexOf('Mac') < 0) {
  run.innerHTML = '<span class="fa fa-play"></span> Run (Ctrl+S)';
}
