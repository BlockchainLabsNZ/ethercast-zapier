module.exports = function (str) {
  return str.split(' ')
    .map(w => w.length > 0 ? w[ 0 ].toUpperCase() + w.substr(1) : '')
    .join(' ');
};