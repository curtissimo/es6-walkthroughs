'use strict';
var i, test, tests, subscribe;

if (tests === undefined) {
  tests = {};
  subscribe = true;
} else {
  subscribe = false;
}

for (i = 0; i < exports.tests.length; i += 1) {
  test = exports.tests[i];

  if (test.exec === undefined) {
    continue;
  }

  tests[test.name] = {
    script: function () { return false; },
    tr: test.res.tr,
    link: test.link
  }

  if (typeof test.exec !== 'function') {
    tests[test.name].script = test.exec[0].script;
  } else {
    tests[test.name].script = test.exec;
  }

  tests[test.name].script = tests[test.name].script.toString().replace('/*', '').replace('*/', '');
  if (test.name === 'let') {
    tests[test.name].script = tests[test.name].script.replace('test', 'return ');
  } else if (test.name === 'Array.prototype.entries') {
    tests[test.name].script = 'function(){return [].entries && [].entries().next;}';
  }

  try {
    tests[test.name].script = eval('(' + tests[test.name].script + ')()');
  } catch(e) {
    tests[test.name].script = false;
  }
}

if (subscribe) {
  document.addEventListener('DOMContentLoaded', function () {
    var links, i, cells, contentCell, data, multiRef, multiRefs, nativeCell, traceurCell, row, rows, nativeSupport, traceurSupport, toc;
    toc = document.getElementById('toc');
    rows = toc.querySelectorAll('tbody tr');
    toc.addEventListener('click', function (e) {
      var target, href, table;
      target = e.target;
      table = target;
      while (table.tagName.toLowerCase() !== 'table') {
        table = table.parentNode;
      }
      if (target.className === 'good' && target.parentNode.className !== 'not-ready') {
        href = target.parentNode.getAttribute('data-href');
        if (href === null) {
          href = table.getAttribute('data-href') + '?' + target.parentNode.getAttribute('data-test');
        }
        window.location = href;
      }
    });

    document.addEventListener('scroll', function () {
      var i, header, headers, scrollTop, tables;
      tables = [
        document.getElementById('interesting'),
        document.getElementById('boring')
      ];
      scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

      tables.forEach(function (table) {
        if (scrollTop < table.offsetTop && table.tHead.className.length) {
          table.tHead.className = '';
        } else if(scrollTop > table.offsetTop && !table.tHead.className.length) {
          table.tHead.style.width = table.offsetWidth + 'px';
          headers = table.tHead.getElementsByTagName('th');
          for (i = 0; i < headers.length; i += 1) {
            header = headers[i];
            header.style.width = window.getComputedStyle(header, null).getPropertyValue('width');
          }
          table.tHead.className = 'fixed';
        }
      });
    });

    for (i = 0; i < rows.length; i += 1) {
      row = rows[i];
      nativeSupport = true;
      traceurSupport = true;
      data = row.getAttribute('data-test').split(',');

      data.forEach(function (value, index) {
        value = value.trim();
        nativeSupport = nativeSupport && tests[value].script;
        traceurSupport = traceurSupport && tests[value].tr;
      });

      cells = row.querySelectorAll('td');
      contentCell = cells[0];
      nativeCell = cells[cells.length - 2];
      traceurCell = cells[cells.length - 1];

      nativeCell.className = nativeSupport ? 'good' : 'bad';
      traceurCell.className = traceurSupport ? 'good' : 'bad';

      if (data.length === 1) {
        contentCell.innerHTML = '<a class="fa fa-external-link" target="_blank" href="' + tests[data[0]].link + '"></a>' + contentCell.innerHTML;
      } else if (data.length > 1) {
        contentCell.innerHTML = '<a class="fa fa-external-link-square" target="_blank" href="#"></a>' + contentCell.innerHTML;
      }

      if (!nativeSupport && !traceurSupport) {
        cells[cells.length - 3].className = 'unsupported';
      }
    }

    links = document.querySelectorAll('#tools a');
    for(i = 0; i < links.length; i += 1) {
      links[i].addEventListener('click', function (e) {
        var height, href, i, target, targets;
        e.preventDefault();
        window.focus();
        targets = [
          document.getElementById('why'),
          document.getElementById('thanks'),
          document.getElementById('contributors'),
          document.getElementById('browser')
        ];
        href = this.href;
        href = href.substring(href.lastIndexOf('#') + 1);
        for(i = 0; i < targets.length; i += 1) {
          target = targets[i];
          if (target.id === href && target.className !== 'show') {
            target.className = 'show';
          } else {
            target.className = '';
          }
        }
      });
    }

    multiRefs = document.querySelectorAll('a.fa.fa-external-link-square');
    for(i = 0; i < multiRefs.length; i += 1) {
      multiRef = multiRefs[i];
      multiRef.addEventListener('click', function (e) {
        var data = e.target.parentNode.parentNode.getAttribute('data-test').split(',');
        e.preventDefault();
        data.forEach(function (key) {
          window.open(tests[key.trim()].link, '_blank');
        });
      });
    }
  });
}
