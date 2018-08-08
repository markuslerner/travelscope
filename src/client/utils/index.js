export function formatNumber(n, c, d, t) {
  c = isNaN(c = Math.abs(c)) ? 2 : c;
  d = d === undefined ? '.' : d;
  t = t === undefined ? ',' : t;
  var s = n < 0 ? '-' : '';
  var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + '';
  var j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
};

export function toSentenceStart(s) {
  return s.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1);
  });
};

export const cleanURLString = (string) => {
  return string
    .toLowerCase()
    .replace(/[àáâãåæāăą]/g, 'a')
    .replace(/[äæ]/g, 'ae')
    .replace(/[çćĉċč]/g, 'c')
    .replace(/[èéêëēĕėęě]/g, 'e')
    .replace(/[ĝğġģ]/g, 'g')
    .replace(/[ĥħ]/g, 'h')
    .replace(/[ìíîïĩīĭįıĳ]/g, 'i')
    .replace(/[ĵĵ]/g, 'j')
    .replace(/[ĺļľŀł]/g, 'l')
    .replace(/[ñńņňŉŋ]/g, 'n')
    .replace(/[òóôõōŏ]/g, 'o')
    .replace(/[öøőœ]/g, 'oe')
    .replace(/[ŕŗř]/g, 'r')
    .replace(/[śŝşš]/g, 's')
    .replace(/[ţťŧ]/g, 't')
    .replace(/[ùúûũūŭůų]/g, 'u')
    .replace(/[üű]/g, 'ue')
    .replace(/[ŵ]/g, 'w')
    .replace(/[ýÿŷ]/g, 'y')
    .replace(/[źżž]/g, 'z')
    .replace(/[^a-z0-9]+/g, '-');
};
