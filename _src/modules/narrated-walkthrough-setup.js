import { factory } from 'repl';
import { cons } from 'dom-console';
import loader from 'loader';

const HAVE_ENOUGH_DATA = 4;

cons.install('#console');

let keyframes = {};
let keystops = [];
let lowerTime = 0;
let upperTime = 0;
let upperTimeIndex = 0;
let evaluator = function () { throw "NO EVALUATOR!"; };
let pausedText = "";
let flushIntervalTyper = false;

let click = {
  audios: [
    document.getElementById('click')
  ],
  index: 0,
  play() {
    this.audios[this.index].play();
    this.index += 1;
    this.index = this.index % this.audios.length;
  }
};

function intervalTyper (move, text, cb) {
  move();
  let i = 0;
  let typeInterval = setInterval(function () {
    if (flushIntervalTyper) {
      flushIntervalTyper = false;
      editor.insert(text.substring(i));
      i = text.length;
    }
    if (i >= text.length) {
      clearInterval(typeInterval);
      setTimeout(cb, 0);
      return;
    }
    click.play();
    editor.insert(text[i]);
    i += 1;
  }, 10);
}

function replActionEvaluator(actions) {
  for (var action of actions) {
    switch (action) {
      case 'clear':
        handlers.clear();
        break;
      case 'evaluate':
        handlers.evaluate();
        break;
    }
  }
}

let handlers = {
  clear(e) {
    e = e || { preventDefault: () => true };
    e.preventDefault();
    cons.clear();
  },
  evaluate(e) {
    e = e || { preventDefault: () => true };
    e.preventDefault();
    evaluator(editor.getValue(), e => {
      if(e) {
        cons.error(e);
      }
    });
  },
  feedback(e) {
    let feedbackPanel = document.getElementById('feedback-panel');
    if (feedbackPanel.classList.contains('show')) {
      feedbackPanel.classList.remove('show');
    } else {
      feedbackPanel.classList.add('show');
    }
  },
  markerChanged() {
    let narration = document.getElementById('narration');
    let time = document.querySelector('#play .time');
    let totalSeconds = narration.currentTime;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds) % 60;
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    time.innerHTML = minutes + ":" + seconds;

    if (totalSeconds < upperTime && totalSeconds >= lowerTime) {
      let frame = keyframes[lowerTime];

      let mover = () => editor.navigateFileEnd();
      switch(frame.position) {
        case 'start':
          mover = () => editor.navigateFileStart();
          break;
        case 'replace':
          mover = () => editor.setValue('');
          break;
      }

      intervalTyper(mover, frame.text, () => {
        replActionEvaluator(frame.replActions);
      });

      lowerTime = upperTime;
      upperTime = keystops[upperTimeIndex];
      upperTimeIndex += 1;
    }
  },
  pageReady() {
    let rewindButton = document.getElementById('rewind');
    rewindButton.addEventListener('click', handlers.rewind);
    rewindButton.disabled = false;

    let playButton = document.getElementById('play');
    playButton.disabled = false;
    playButton.addEventListener('click', handlers.togglePlay);

    let stepForward = document.getElementById('step-forward');
    stepForward.disabled = false;
    stepForward.addEventListener('click', handlers.stepForward);

    let narration = document.getElementById('narration');
    narration.addEventListener('playing', handlers.played);
    narration.addEventListener('pause', handlers.paused);
    narration.addEventListener('timeupdate', handlers.markerChanged);

    setTimeout(narration.play.bind(narration), 500);

    handlers.resize();

    if (keystops.length > 2) {
      lowerTime = keystops[upperTimeIndex];
      upperTimeIndex += 1;

      upperTime = keystops[upperTimeIndex];
      upperTimeIndex += 1;
    }
  },
  paused() {
    let icon = document.querySelector('#play .fa');
    icon.className = 'fa fa-play';

    let label = document.querySelector('#play .label');
    label.innerHTML = 'Play';

    let evaluate = document.getElementById('evaluate');
    evaluate.disabled = false;

    let clearConsole = document.getElementById('clear-console');
    clearConsole.disabled = false;

    pausedText = editor.getValue();
    editor.setBehavioursEnabled(true);
    editor.setReadOnly(false);
  },
  played() {
    let icon = document.querySelector('#play .fa');
    icon.className = 'fa fa-pause';

    let label = document.querySelector('#play .label');
    label.innerHTML = 'Pause';

    let evaluate = document.getElementById('evaluate');
    evaluate.disabled = true;

    let clearConsole = document.getElementById('clear-console');
    clearConsole.disabled = true;

    editor.setReadOnly(true);
    editor.setBehavioursEnabled(false);
    editor.setValue(pausedText);
    editor.navigateFileEnd();
  },
  resize() {
    let height = window.innerHeight - 2 * document.querySelector('form.unsubmitable').offsetHeight - 10;
    document.getElementById('console').style.height = height + 'px';
    editor.container.style.height = height + 20 + 'px';
    editor.resize();
  },
  rewind(e) {
    e.preventDefault();
    let narration = document.getElementById('narration');
    narration.currentTime = 0;
    editor.setValue('');

    lowerTime = 0;
    upperTime = 0;
    upperTimeIndex = 0;
    if (keystops.length > 2) {
      lowerTime = keystops[upperTimeIndex];
      upperTimeIndex += 1;

      upperTime = keystops[upperTimeIndex];
      upperTimeIndex += 1;
    }
  },
  stepForward(e) {
    e = e || { preventDefault: () => true };
    e.preventDefault();
    let narration = document.getElementById('narration');
    narration.currentTime += 5;
  },
  togglePlay(e) {
    e = e || { preventDefault: () => true };
    e.preventDefault();
    let narration = document.getElementById('narration');
    if (narration.paused) {
      narration.play();
    } else {
      narration.pause();
    }
  }
}

let forms = Array.from(document.querySelectorAll('form.unsubmitable'));
for (let form of forms) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
  });
}

let test = () => {
  return document.getElementById('editor').className.contains('ace-twilight')
      && document.getElementById('narration').readyState === HAVE_ENOUGH_DATA;
};
let cb = handlers.pageReady;
loader('workspace', 'loader', test, cb);

let editor = ace.edit('editor');
let oldSessionNewLine = editor.getSession().getDocument().isNewLine;
editor.setBehavioursEnabled(false);
editor.setReadOnly(true);
editor.setTheme('ace/theme/twilight');
editor.getSession().setTabSize(2);
editor.getSession().setMode('ace/mode/javascript');
editor.getSession().getDocument().isNewLine = function () {
  return false;
};
editor.container.getElementsByTagName('textarea')[0].addEventListener('keydown', e => {
  if (e.which === 69 && (e.metaKey || e.ctrlKey)) {
    handlers.evaluate(e);
  } else if (e.which === 27) {
    handlers.clear(e);
  }
});

window.addEventListener('resize', handlers.resize);
handlers.resize();

Mousetrap.bind([ 'ctrl+e', 'command+e' ], handlers.evaluate);
Mousetrap.bind('esc', handlers.clear);

document
  .getElementById('clear-console')
  .addEventListener('click', handlers.clear);

document
  .getElementById('feedback')
  .addEventListener('click', handlers.feedback);

let run = document.getElementById('evaluate');
run.addEventListener('click', handlers.evaluate);

if (window.navigator.platform.indexOf('Mac') < 0) {
  run.innerHTML = '<span class="fa fa-play"></span> Evaluate (Ctrl+S)';
}

export let install = (kf, tests) => {
  if (kf['0'] === undefined) {
    kf['0'] = { text: '', position: 'replace', replActions: [] };
  }
  kf['600'] = { text: '', position: 'start', replActions: [] };
  Object.keys(kf).forEach(k => {
    if (typeof kf[k] === 'string') {
      kf[k] = { text: kf[k], position: 'end', replActions: [ 'clear', 'evaluate' ] };
    }

    kf[k].text = kf[k].text || '';
    kf[k].position = kf[k].position || 'end';
    kf[k].replActions = kf[k].replActions || [ 'clear', 'evaluate' ];
    keystops.push(k - 0);
  });
  keyframes = kf;
  keystops.sort((a, b) => a - b);

  evaluator = factory(tests);
};
