const _ = require('underscore');

const ZERO_ADDRESS = `0x${_.range(0, 40).map(() => '0').join('')}`;
const ZERO_SIGNATURE = `0x${_.range(0, 8).map(() => '0').join('')}`;
const ZERO_TOPIC = `0x${_.range(0, 64).map(() => '0').join('')}`;

const LOG_FILTERS = [
  {
    key: 'address',
    placeholder: ZERO_ADDRESS,
    list: true,
    required: false,
    label: 'Contract Address',
    helpText: 'A list of contract addresses to filter on'
  },
  {
    key: 'topic0',
    placeholder: ZERO_TOPIC,
    list: true,
    required: false,
    label: 'Log Event Signature',
    helpText: 'A list of event signatures to filter on'
  },
  {
    key: 'topic1',
    placeholder: ZERO_TOPIC,
    list: true,
    required: false,
    label: 'First Argument',
    helpText: 'A list of first indexed arguments to filter on'
  },
  {
    key: 'topic2',
    placeholder: ZERO_TOPIC,
    list: true,
    required: false,
    label: 'Second Argument',
    helpText: 'A list of second indexed arguments to filter on'
  },
  {
    key: 'topic3',
    placeholder: ZERO_TOPIC,
    list: true,
    required: false,
    label: 'Third Argument',
    helpText: 'A list of third indexed arguments to filter on'
  }
];

const TRANSACTION_FILTERS = [
  {
    key: 'from',
    placeholder: ZERO_ADDRESS,
    list: true,
    required: false,
    label: 'From Address',
    helpText: 'A list of addresses from which transactions that can trigger this hook are sent'
  },
  {
    key: 'to',
    placeholder: ZERO_ADDRESS,
    list: true,
    required: false,
    label: 'To Address',
    helpText: 'A list of addresses to which transactions that can trigger this hook are sent'
  },
  {
    key: 'methodSignature',
    placeholder: ZERO_SIGNATURE,
    list: true,
    required: false,
    label: 'Method Signature',
    helpText: 'A list of transaction method signatures that can trigger this hook'
  }
];

module.exports = function getInputFields(type) {
  return type === 'log' ? LOG_FILTERS : TRANSACTION_FILTERS;
};