import { tests } from 'tests';

function wirePage () {
  let toc = document.getElementById('toc');
  let rows = toc.querySelectorAll('tbody tr');

  toc.addEventListener('click', function (e) {
    var target, href, table;
    target = e.target;
    table = target;
    while (table.tagName.toLowerCase() !== 'table') {
      table = table.parentNode;
    }
    if (target.className.indexOf('good') > -1 && target.parentNode.className !== 'not-ready') {
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

  for (var i = 0; i < rows.length; i += 1) {
    let row = rows[i];
    let nativeSupport = true;
    let traceurSupport = true;
    let data = row.getAttribute('data-test').split(',');

    data.forEach(function (value, index) {
      value = value.trim();
      nativeSupport = nativeSupport && tests[value].nativeSupport;
      traceurSupport = traceurSupport && tests[value].traceurSupport;
    });

    let cells = row.querySelectorAll('td');
    let contentCell = cells[0];
    let nativeCell = cells[cells.length - 1];

    if (nativeSupport) {
      nativeCell.className = 'good native';
    } else if(traceurSupport) {
      nativeCell.className = 'good traceur';
    } else {
      nativeCell.className = 'bad';
    }

    if (data.length === 1) {
      contentCell.innerHTML = '<a class="fa fa-external-link" target="_blank" href="' + tests[data[0]].link + '"></a>' + contentCell.innerHTML;
    } else if (data.length > 1) {
      contentCell.innerHTML = '<a class="fa fa-external-link-square" target="_blank" href="#"></a>' + contentCell.innerHTML;
    }
  }

  let links = document.querySelectorAll('#tools a');
  for(i = 0; i < links.length; i += 1) {
    links[i].addEventListener('click', function (e) {
      var height, href, i, link, links, target, targets;
      e.preventDefault();
      targets = [
        document.getElementById('browser'),
        document.getElementById('contributors'),
        document.getElementById('why'),
        document.getElementById('thanks')
      ];
      links = document.querySelectorAll('#tools a');
      href = this.href;
      href = href.substring(href.lastIndexOf('#') + 1);
      for(i = 0; i < targets.length; i += 1) {
        target = targets[i];
        link = links[i];
        if (target.id === href && target.className !== 'show') {
          link.parentNode.className = 'pure-menu-selected';
          target.className = 'show';
        } else {
          link.parentNode.className = '';
          target.className = '';
        }
      }
    });
  }

  let multiRefs = document.querySelectorAll('a.fa.fa-external-link-square');
  for(i = 0; i < multiRefs.length; i += 1) {
    let multiRef = multiRefs[i];
    multiRef.addEventListener('click', function (e) {
      var data = e.target.parentNode.parentNode.getAttribute('data-test').split(',');
      e.preventDefault();
      data.forEach(function (key) {
        window.open(tests[key.trim()].link, '_blank');
      });
    });
  }
}

if (document.readyState !== 'loading') {
  wirePage();
} else {
  document.addEventListener('DOMContentLoaded', wirePage);
}
