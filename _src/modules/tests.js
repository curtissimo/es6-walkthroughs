import data from 'data-es6';

export var tests = {};

class Test {
  constructor (name, link, criterion, traceurSupport) {
    this.name = name;
    this.link = link;
    this.traceurSupport = traceurSupport;

    if (typeof criterion !== 'function') {
      criterion = criterion[0].script;
    }
    criterion = criterion.toString().replace('/*', '').replace('*/', '');
    if (this.name === 'let') {
      criterion = criterion.replace('test', 'return ');
    } else if (this.name === 'Array.prototype.entries') {
      criterion = 'function(){return [].entries && [].entries().next;}';
    }

    this._criterion = criterion;
  }

  get nativeSupport() {
    try {
      return eval('(' + this._criterion + ')()');
    } catch (e) {
      return false;
    }
  }
}

for (var test of data.tests) {
  if (test.exec === undefined) {
    continue;
  }

  tests[test.name] = new Test(test.name, test.link, test.exec, test.res.tr);
}
