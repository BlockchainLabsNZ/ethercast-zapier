const parseFilter = require('./parse-filter');

module.exports = function createInputDataFilters(type, inputData) {
  return type === 'log' ? {
    address: parseFilter(inputData.address),
    topic0: parseFilter(inputData.topic0),
    topic1: parseFilter(inputData.topic1),
    topic2: parseFilter(inputData.topic2),
    topic3: parseFilter(inputData.topic3)
  } : {
    from: parseFilter(inputData.from),
    to: parseFilter(inputData.to),
    methodSignature: parseFilter(inputData.methodSignature)
  };
};