import loader from 'loader';

const HAVE_ENOUGH_DATA = 4;

let keyframes = {};
let keystops = [ 0 ];
let lowerTime = 0;
let upperTime = 0;
let upperTimeIndex = 0;
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
    if (i >= text.length) {
      clearInterval(typeInterval);
      setTimeout(cb, 0);
      return;
    }
    click.play();
    editor.insert(text[i]);
    i += 1;
  }, 35);
}

function replActionEvaluator(actions) {
  for (var action of actions) {
    switch (action) {
      case 'clear':
        handlers.clear();
        break;
      case 'execute':
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
      let mover = () => editor.setValue('');
      switch(keyframes[lowerTime].position) {
        case -1:
          mover = () => editor.navigateFileStart();
          break;
        case 1:
          mover = () => editor.navigateFileEnd();
          break;
      }
      intervalTyper(mover, keyframes[lowerTime].text, () => {
        replActionEvaluator(keyframes[lowerTime].replActions);
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
  },
  played() {
    let icon = document.querySelector('#play .fa');
    icon.className = 'fa fa-pause';

    let label = document.querySelector('#play .label');
    label.innerHTML = 'Pause';
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

let test = () => {
  return document.getElementById('editor').className.contains('ace-twilight')
      && document.getElementById('narration').readyState === HAVE_ENOUGH_DATA;
};
let cb = handlers.pageReady;
loader('workspace', 'loader', test, cb);

let editor = ace.edit('editor');
editor.setReadOnly(true);
editor.setTheme('ace/theme/twilight');
editor.getSession().setTabSize(2);
editor.getSession().setMode('ace/mode/javascript');

window.addEventListener('resize', handlers.resize);
handlers.resize();

export let install = (kf, keys) => {
  Object.keys(kf).forEach(k => {
    if (typeof kf[k] === 'string') {
      kf[k] = { text: kf[k], position: 1, replActions: [ 'execute' ] };
    }
    if (kf[k].position === 'end') {
      kf[k].position = 1;
    } else if (kf[k].position === 'start') {
      kf[k].position = -1;
    } else if (kf[k].position === 'replace') {
      kf[k].position = 0;
    }
    kf[k].replActions = kf[k].replActions || [];
    keystops.push(k - 0);
  });
  keyframes = kf;
  keyframes['0'] = { text: '', position: 0 };
  keyframes['600'] = { text: '', position: -1 };
  keystops.push(600);
  keystops.sort((a, b) => a - b);
};
