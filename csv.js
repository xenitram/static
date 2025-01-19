var csv=function(){
        /**
         * Wrapped CSV line parser
         * @param s      String delimited CSV string
         * @param sep    Separator override
         * @attribution: http://www.greywyvern.com/?post=258 (comments closed on blog :( )
         */
          const parse=function parseCSV(s,sep) {
            // http://stackoverflow.com/questions/1155678/javascript-string-newline-character
            var universalNewline = /\r\n|\r|\n/g;
            var a = s.split(universalNewline);
            for(var i in a){
                for (var f = a[i].split(sep = sep || ","), x = f.length - 1, tl; x >= 0; x--) {
                    if (f[x].replace(/"\s+$/, '"').charAt(f[x].length - 1) == '"') {
                        if ((tl = f[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
                            f[x] = f[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
                          } else if (x) {
                        f.splice(x - 1, 2, [f[x - 1], f[x]].join(sep));
                      } else f = f.shift().split(sep).concat(f);
                    } else f[x].replace(/""/g, '"');
                  } a[i] = f;
        }
        return a;
        }

const stringify = function (table, replacer) {
  replacer =
    replacer ||
    function (r, c, v) {
      return v;
    };
  var csv = "",
    c,
    cc,
    r,
    rr = table.length,
    cell;
  for (r = 0; r < rr; ++r) {
    if (r) {
      csv += "\r\n";
    }
    for (c = 0, cc = table[r].length; c < cc; ++c) {
      if (c) {
        csv += ",";
      }
      cell = replacer(r, c, table[r][c]);
      if (/[,\r\n"]/.test(cell)) {
        cell = '"' + cell.replace(/"/g, '""') + '"';
      }
      csv += cell || 0 === cell ? cell : "";
    }
  }
  return csv;
};

return {parse,stringify};
}();