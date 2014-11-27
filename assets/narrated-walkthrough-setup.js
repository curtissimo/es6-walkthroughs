System.register("narrated-walkthrough-setup", ["loader"], function($__export) {
  "use strict";
  var __moduleName = "narrated-walkthrough-setup";
  function require(path) {
    return $traceurRuntime.require("narrated-walkthrough-setup", path);
  }
  var loader,
      HAVE_ENOUGH_DATA,
      keyframes,
      keystops,
      lowerTime,
      upperTime,
      upperTimeIndex,
      click,
      handlers,
      test,
      cb,
      editor,
      install;
  function intervalTyper(move, text) {
    move();
    var i = 0;
    var typeInterval = setInterval(function() {
      if (i >= text.length) {
        clearInterval(typeInterval);
        return;
      }
      click.play();
      editor.insert(text[i]);
      i += 1;
    }, 35);
  }
  return {
    setters: [function(m) {
      loader = m.default;
    }],
    execute: function() {
      HAVE_ENOUGH_DATA = 4;
      keyframes = {};
      keystops = [0];
      lowerTime = 0;
      upperTime = 0;
      upperTimeIndex = 0;
      click = {
        audios: [document.getElementById('click')],
        index: 0,
        play: function() {
          this.audios[this.index].play();
          this.index += 1;
          this.index = this.index % this.audios.length;
        }
      };
      handlers = {
        markerChanged: function(e) {
          var narration = document.getElementById('narration');
          var time = document.querySelector('#play .time');
          var totalSeconds = narration.currentTime;
          var minutes = Math.floor(totalSeconds / 60);
          var seconds = Math.floor(totalSeconds) % 60;
          if (seconds < 10) {
            seconds = "0" + seconds;
          }
          time.innerHTML = minutes + ":" + seconds;
          if (totalSeconds < upperTime && totalSeconds >= lowerTime) {
            var mover = (function() {
              return editor.setValue('');
            });
            switch (keyframes[lowerTime].position) {
              case -1:
                mover = (function() {
                  return editor.navigateFileStart();
                });
                break;
              case 1:
                mover = (function() {
                  return editor.navigateFileEnd();
                });
                break;
            }
            intervalTyper(mover, keyframes[lowerTime].text);
            lowerTime = upperTime;
            upperTime = keystops[upperTimeIndex];
            upperTimeIndex += 1;
          }
        },
        pageReady: function() {
          var rewindButton = document.getElementById('rewind');
          rewindButton.addEventListener('click', handlers.rewind);
          rewindButton.disabled = false;
          var playButton = document.getElementById('play');
          playButton.disabled = false;
          playButton.addEventListener('click', handlers.togglePlay);
          var narration = document.getElementById('narration');
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
        paused: function() {
          var icon = document.querySelector('#play .fa');
          icon.className = 'fa fa-play';
          var label = document.querySelector('#play .label');
          label.innerHTML = 'Play';
        },
        played: function() {
          var icon = document.querySelector('#play .fa');
          icon.className = 'fa fa-pause';
          var label = document.querySelector('#play .label');
          label.innerHTML = 'Pause';
        },
        resize: function() {
          var height = window.innerHeight - 2 * document.querySelector('form.unsubmitable').offsetHeight - 10;
          document.getElementById('console').style.height = height + 'px';
          editor.container.style.height = height + 20 + 'px';
          editor.resize();
        },
        rewind: function(e) {
          e.preventDefault();
          var narration = document.getElementById('narration');
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
        togglePlay: function(e) {
          e.preventDefault();
          var narration = document.getElementById('narration');
          if (narration.paused) {
            narration.play();
          } else {
            narration.pause();
          }
        }
      };
      test = (function() {
        return document.getElementById('editor').className.contains('ace-twilight') && document.getElementById('narration').readyState === HAVE_ENOUGH_DATA;
      });
      cb = handlers.pageReady;
      loader('workspace', 'loader', test, cb);
      editor = ace.edit('editor');
      editor.setReadOnly(true);
      editor.setTheme('ace/theme/twilight');
      editor.getSession().setTabSize(2);
      editor.getSession().setMode('ace/mode/javascript');
      window.addEventListener('resize', handlers.resize);
      handlers.resize();
      install = $__export("install", (function(kf, keys) {
        Object.keys(kf).forEach((function(k) {
          if (typeof kf[k] === 'string') {
            kf[k] = {
              text: kf[k],
              position: 1
            };
          }
          if (kf[k].position === 'end') {
            kf[k].position = 1;
          } else if (kf[k].position === 'start') {
            kf[k].position = -1;
          } else if (kf[k].position === 'replace') {
            kf[k].position = 0;
          }
          keystops.push(k - 0);
        }));
        keyframes = kf;
        keyframes['0'] = {
          text: '',
          position: 0
        };
        keyframes['600'] = {
          text: '',
          position: -1
        };
        keystops.push(600);
        keystops.sort((function(a, b) {
          return a - b;
        }));
      }));
    }
  };
});
