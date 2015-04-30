// http://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript

padNumber = function(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

toSeconds = function(hours, minutes, seconds) {
  return hours * 60 * 60 + minutes * 60 + seconds;
};

