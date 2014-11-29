import { tests } from 'tests';

function nativeEval (content, cb) {
  try {
    eval('"use strict";' + content);
    cb();
  } catch (e) {
    cb(e);
  }
}

function noopEval() {
  console.error('cannot evaluate this functionality...');
}

function traceurEval (content, cb) {
  traceur.options.experimental = true;
  let options = {
    address: 'foo',
    name: 'foo',
    referrer: window.location.href,
    tracuerOptions: traceur.options
  };
  traceur.System.module(content, options)
    .then(() => cb())
    .catch(e => cb(e));
}

export let factory = function (testName) {
  if (!Array.isArray(testName)) {
    testName = [ testName ];
  }
  let nativeSupport = true;
  let traceurSupport = true;

  for(var name of testName) {
    let test = tests[name];

    nativeSupport = nativeSupport && test.nativeSupport;
    traceurSupport = traceurSupport && test.traceurSupport;
  }

  if (nativeSupport) {
    return nativeEval;
  } else if (traceurSupport) {
    return traceurEval;
  } else {
    return noopEval;
  }
};
