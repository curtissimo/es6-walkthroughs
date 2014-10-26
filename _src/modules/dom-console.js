let output = null;
let _log = console.log;
let _error = console.error;

function coerce(val) {
  if (val === Number.POSITIVE_INFINITY) {
    val = '<i>positive infinity</i>';
  } else if(val === Number.NEGATIVE_INFINITY) {
    val = '<i>negative infinity</i>';
  } else if (typeof val === 'number' && isNaN(val)) {
    val = '<i>not a number</i>';
  } else if (val === undefined) {
    val = '<i>undefined</i>';
  } else if (val === null) {
    val = '<i>null</i>';
  } else if (typeof val === 'function') {
    val = val.toString();
  } else {
    val = JSON.stringify(val);
  }
  return val;
}

let error = function (t) {
  _error.apply(console, arguments);

  if (output === null) {
    return;
  }
  output.innerHTML += '<pre class="error">&gt; ' + t.toString() + '</pre>';
  output.scrollTop = output.scrollHeight;
};

let log = function (t) {
  let a = [];
  _log.apply(console, arguments);

  if (arguments.length >= 1 && t !== undefined) {
    t = Array.prototype.slice.apply(arguments);
    for (let i = 0; i < t.length; i += 1) {
      a.push(coerce(t[i]));
    }
    t = a.join('<br>&gt; ');
  } else {
    t = '';
  }

  if (output === null) {
    return;
  }
  output.innerHTML += '<pre>&gt; ' + t.toString() + '</pre>';
  output.scrollTop = output.scrollHeight;
};

let logHTML = function (s) {
  log(s.replace(/</g, '&lt;'));
};

let install = function (elem) {
  if (typeof elem === 'string') {
    elem = document.querySelector(elem);
  }
  output = elem;
};

let clear = function () {
  if (output !== null) {
    output.innerHTML = '';
  }
}

export let cons = {
  clear,
  error,
  log,
  logHTML,
  install
};

console.log = log;
console.error = error;
console.logHTML = logHTML;
