import loader from 'loader';

let handlers = {
  resize() {
    console.log('moo');
  }
}

let test = () => document.getElementById('editor').className.contains('ace-twilight');
let cb = () => handlers.resize();
loader('workspace', 'loader', test, cb);

let editor = ace.edit('editor');
editor.setTheme('ace/theme/twilight');
