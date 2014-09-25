(function () {
  var run = document.getElementById('run');
  run.removeEventListener('click', traceurEval);
  run.addEventListener('click', () => {
    prefix = 'native';
    subprefix = '      ';
    try {
      eval('"use strict";' + editor.getValue());
      flush();
    } catch (e) {
      log = '';
      console.error(e.message);
    }
  });
  document.getElementById('use-traceur').checked = false;
  document.getElementById('use-traceur').disabled = false;
}());
