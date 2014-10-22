import { tests } from 'tests';

var toc = document.getElementById('toc');
var rows = toc.querySelectorAll('tbody tr');

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
  let nativeCell = cells[cells.length - 2];
  let traceurCell = cells[cells.length - 1];

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
