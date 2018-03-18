module.exports = function parseFilter(str) {
  if (Array.isArray(str)) {
    return str.map(s => s.trim().toLowerCase());
  } else if (typeof str === 'string') {
    return str.split(',').map(s => s.trim().toLowerCase());
  } else {
    return null;
  }
};
