System.register("narrated-walkthrough-setup", ["repl", "dom-console", "loader"], function($__export) {
  "use strict";
  var __moduleName = "narrated-walkthrough-setup";
  function require(path) {
    return $traceurRuntime.require("narrated-walkthrough-setup", path);
  }
  var factory,
      cons,
      loader,
      HAVE_ENOUGH_DATA,
      keyframes,
      keystops,
      lowerTime,
      upperTime,
      upperTimeIndex,
      evaluator,
      pausedText,
      flushIntervalTyper,
      click,
      handlers,
      forms,
      test,
      cb,
      editor,
      oldSessionNewLine,
      run,
      install;
  function intervalTyper(move, text, cb) {
    move();
    var i = 0;
    var typeInterval = setInterval(function() {
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
    for (var $__0 = actions[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__1; !($__1 = $__0.next()).done; ) {
      var action = $__1.value;
      {
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
  }
  return {
    setters: [function(m) {
      factory = m.factory;
    }, function(m) {
      cons = m.cons;
    }, function(m) {
      loader = m.default;
    }],
    execute: function() {
      HAVE_ENOUGH_DATA = 4;
      cons.install('#console');
      keyframes = {};
      keystops = [];
      lowerTime = 0;
      upperTime = 0;
      upperTimeIndex = 0;
      evaluator = function() {
        throw "NO EVALUATOR!";
      };
      pausedText = "";
      flushIntervalTyper = false;
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
        clear: function(e) {
          e = e || {preventDefault: (function() {
              return true;
            })};
          e.preventDefault();
          cons.clear();
        },
        evaluate: function(e) {
          e = e || {preventDefault: (function() {
              return true;
            })};
          e.preventDefault();
          evaluator(editor.getValue(), (function(e) {
            if (e) {
              cons.error(e);
            }
          }));
        },
        feedback: function(e) {
          var feedbackPanel = document.getElementById('feedback-panel');
          if (feedbackPanel.classList.contains('show')) {
            feedbackPanel.classList.remove('show');
          } else {
            feedbackPanel.classList.add('show');
          }
        },
        markerChanged: function() {
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
            var frame = keyframes[lowerTime];
            var mover = (function() {
              return editor.navigateFileEnd();
            });
            switch (frame.position) {
              case 'start':
                mover = (function() {
                  return editor.navigateFileStart();
                });
                break;
              case 'replace':
                mover = (function() {
                  return editor.setValue('');
                });
                break;
            }
            intervalTyper(mover, frame.text, (function() {
              replActionEvaluator(frame.replActions);
            }));
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
          var stepForward = document.getElementById('step-forward');
          stepForward.disabled = false;
          stepForward.addEventListener('click', handlers.stepForward);
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
          var evaluate = document.getElementById('evaluate');
          evaluate.disabled = false;
          var clearConsole = document.getElementById('clear-console');
          clearConsole.disabled = false;
          pausedText = editor.getValue();
          editor.setBehavioursEnabled(true);
          editor.setReadOnly(false);
        },
        played: function() {
          var icon = document.querySelector('#play .fa');
          icon.className = 'fa fa-pause';
          var label = document.querySelector('#play .label');
          label.innerHTML = 'Pause';
          var evaluate = document.getElementById('evaluate');
          evaluate.disabled = true;
          var clearConsole = document.getElementById('clear-console');
          clearConsole.disabled = true;
          editor.setReadOnly(true);
          editor.setBehavioursEnabled(false);
          editor.setValue(pausedText);
          editor.navigateFileEnd();
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
        stepForward: function(e) {
          e = e || {preventDefault: (function() {
              return true;
            })};
          e.preventDefault();
          var narration = document.getElementById('narration');
          narration.currentTime += 5;
        },
        togglePlay: function(e) {
          e = e || {preventDefault: (function() {
              return true;
            })};
          e.preventDefault();
          var narration = document.getElementById('narration');
          if (narration.paused) {
            narration.play();
          } else {
            narration.pause();
          }
        }
      };
      forms = Array.from(document.querySelectorAll('form.unsubmitable'));
      for (var $__0 = forms[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__1; !($__1 = $__0.next()).done; ) {
        var form = $__1.value;
        {
          form.addEventListener('submit', function(e) {
            e.preventDefault();
          });
        }
      }
      test = (function() {
        return document.getElementById('editor').className.contains('ace-twilight') && document.getElementById('narration').readyState === HAVE_ENOUGH_DATA;
      });
      cb = handlers.pageReady;
      loader('workspace', 'loader', test, cb);
      editor = ace.edit('editor');
      oldSessionNewLine = editor.getSession().getDocument().isNewLine;
      editor.setBehavioursEnabled(false);
      editor.setReadOnly(true);
      editor.setTheme('ace/theme/twilight');
      editor.getSession().setTabSize(2);
      editor.getSession().setMode('ace/mode/javascript');
      editor.getSession().getDocument().isNewLine = function() {
        return false;
      };
      editor.container.getElementsByTagName('textarea')[0].addEventListener('keydown', (function(e) {
        if (e.which === 69 && (e.metaKey || e.ctrlKey)) {
          handlers.evaluate(e);
        } else if (e.which === 27) {
          handlers.clear(e);
        }
      }));
      window.addEventListener('resize', handlers.resize);
      handlers.resize();
      Mousetrap.bind(['ctrl+e', 'command+e'], handlers.evaluate);
      Mousetrap.bind('esc', handlers.clear);
      document.getElementById('clear-console').addEventListener('click', handlers.clear);
      document.getElementById('feedback').addEventListener('click', handlers.feedback);
      run = document.getElementById('evaluate');
      run.addEventListener('click', handlers.evaluate);
      if (window.navigator.platform.indexOf('Mac') < 0) {
        run.innerHTML = '<span class="fa fa-play"></span> Evaluate (Ctrl+S)';
      }
      install = $__export("install", (function(kf, tests) {
        if (kf['0'] === undefined) {
          kf['0'] = {
            text: '',
            position: 'replace',
            replActions: []
          };
        }
        kf['600'] = {
          text: '',
          position: 'start',
          replActions: []
        };
        Object.keys(kf).forEach((function(k) {
          if (typeof kf[k] === 'string') {
            kf[k] = {
              text: kf[k],
              position: 'end',
              replActions: ['clear', 'evaluate']
            };
          }
          kf[k].text = kf[k].text || '';
          kf[k].position = kf[k].position || 'end';
          kf[k].replActions = kf[k].replActions || ['clear', 'evaluate'];
          keystops.push(k - 0);
        }));
        keyframes = kf;
        keystops.sort((function(a, b) {
          return a - b;
        }));
        evaluator = factory(tests);
      }));
    }
  };
});
