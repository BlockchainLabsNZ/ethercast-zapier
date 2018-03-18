const LOG_FILTERS = [
  {
    key: 'address',
    required: false,
    label: 'Contract Address',
    helpText: 'A comma delimited list of contract addresses to filter on'
  },
  {
    key: 'topic0',
    required: false,
    label: 'Log Event Signature',
    helpText: 'A comma delimited list of event signatures to filter on'
  },
  {
    key: 'topic1',
    required: false,
    label: 'First Argument',
    helpText: 'A comma delimited list of first indexed arguments to filter on'
  },
  {
    key: 'topic2',
    required: false,
    label: 'Second Argument',
    helpText: 'A comma delimited list of second indexed arguments to filter on'
  },
  {
    key: 'topic3',
    required: false,
    label: 'Third Argument',
    helpText: 'A comma delimited list of third indexed arguments to filter on'
  }
];

const TRANSACTION_FILTERS = [
  {
    key: 'from',
    required: false,
    label: 'From Address',
    helpText: 'A comma delimited list of addresses from which transactions that can trigger this hook are sent'
  },
  {
    key: 'to',
    required: false,
    label: 'To Address',
    helpText: 'A comma delimited list of addresses to which transactions that can trigger this hook are sent'
  },
  {
    key: 'methodSignature',
    required: false,
    label: 'Method Signature',
    helpText: 'A comma delimited list of transaction method signatures that can trigger this hook'
  }
];

module.exports = function getInputFields(type) {
  return type === 'log' ? LOG_FILTERS : TRANSACTION_FILTERS;
};