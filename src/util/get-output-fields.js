module.exports = function getOutputFields(type) {
  return type === 'log' ? [] : [];
};