System.register("index", ["tests"], function($__export) {
  "use strict";
  var __moduleName = "index";
  var tests,
      toc,
      rows,
      i;
  return {
    setters: [function(m) {
      tests = m.tests;
    }],
    execute: function() {
      toc = document.getElementById('toc');
      rows = toc.querySelectorAll('tbody tr');
      for (i = 0; i < rows.length; i += 1) {
        try {
          throw undefined;
        } catch (traceurCell) {
          try {
            throw undefined;
          } catch (nativeCell) {
            try {
              throw undefined;
            } catch (contentCell) {
              try {
                throw undefined;
              } catch (cells) {
                try {
                  throw undefined;
                } catch (data) {
                  try {
                    throw undefined;
                  } catch (traceurSupport) {
                    try {
                      throw undefined;
                    } catch (nativeSupport) {
                      try {
                        throw undefined;
                      } catch (row) {
                        {
                          row = rows[$traceurRuntime.toProperty(i)];
                          nativeSupport = true;
                          traceurSupport = true;
                          data = row.getAttribute('data-test').split(',');
                          data.forEach(function(value, index) {
                            value = value.trim();
                            nativeSupport = nativeSupport && tests[$traceurRuntime.toProperty(value)].nativeSupport;
                            traceurSupport = traceurSupport && tests[$traceurRuntime.toProperty(value)].traceurSupport;
                          });
                          cells = row.querySelectorAll('td');
                          contentCell = cells[0];
                          nativeCell = cells[$traceurRuntime.toProperty(cells.length - 2)];
                          traceurCell = cells[$traceurRuntime.toProperty(cells.length - 1)];
                          nativeCell.className = nativeSupport ? 'good' : 'bad';
                          traceurCell.className = traceurSupport ? 'good' : 'bad';
                          if (data.length === 1) {
                            contentCell.innerHTML = '<a class="fa fa-external-link" target="_blank" href="' + tests[$traceurRuntime.toProperty(data[0])].link + '"></a>' + contentCell.innerHTML;
                          } else if (data.length > 1) {
                            contentCell.innerHTML = '<a class="fa fa-external-link-square" target="_blank" href="#"></a>' + contentCell.innerHTML;
                          }
                          if (!nativeSupport && !traceurSupport) {
                            cells[$traceurRuntime.toProperty(cells.length - 3)].className = 'unsupported';
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
});
