import { factory } from 'repl';
import { cons } from 'dom-console';

cons.install('#console');

let evaluator;
export let install = test => evaluator = factory(test);
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
