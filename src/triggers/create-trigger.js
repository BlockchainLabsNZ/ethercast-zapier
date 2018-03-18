const toTitleCase = require('../util/to-title-case');
const parseFilter = require('../util/parse-filter');

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

module.exports = function createTrigger(network, apiUrl, type) {
  const subscribeHook = (z, bundle) => {
    const subscription = {
      name: bundle.inputData.name,
      description: `Webhook created by Zapier with ID ${bundle.meta.zap.id}`,
      webhookUrl: bundle.targetUrl,
      type,
      filters: type === 'log' ? {
        address: parseFilter(bundle.inputData.address),
        topic0: parseFilter(bundle.inputData.topic0),
        topic1: parseFilter(bundle.inputData.topic1),
        topic2: parseFilter(bundle.inputData.topic2),
        topic3: parseFilter(bundle.inputData.topic3)
      } : {
        from: parseFilter(bundle.inputData.from),
        to: parseFilter(bundle.inputData.to),
        methodSignature: parseFilter(bundle.inputData.methodSignature)
      }
    };

    const options = {
      url: `${apiUrl}/subscriptions`,
      method: 'POST',
      body: z.JSON.stringify(subscription)
    };

    return z.request(options)
      .then((response) => {
        if (response.status === 200) {
          return response.json;
        } else {
          z.console.log('failed to create subscription', JSON.stringify(subscription), JSON.stringify(response.json));

          throw new Error(`Unexpected status code ${response.status}`);
        }
      });
  };

  const unsubscribeHook = (z, bundle) => {
    // bundle.subscribeData contains the parsed response JSON from the subscribe
    // request made initially.
    const hookId = bundle.subscribeData.id;

    // You can build requests and our client will helpfully inject all the variables
    // you need to complete. You can also register middleware to control this.
    const options = {
      url: `${apiUrl}/subscriptions/${hookId}`,
      method: 'DELETE'
    };

    // You may return a promise or a normal data structure from any perform method.
    return z.request(options)
      .then((response) => {
        if (response.status === 204) {
          return;
        }

        z.console.log('failed to unsubscribe', response);

        throw new Error(`Unexpected status code: ${response.status}`);
      });
  };

  const getExampleLogs = (z, bundle) => {
    // For the test poll, you should get some real data, to aid the setup process.
    const options = {
      url: `${apiUrl}/get-examples`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: z.JSON.stringify({
        type: 'log',
        filters: {
          address: bundle.inputData.address.split(',').map(s => s.trim())
        }
      })
    };

    return z.request(options)
      .then((response) => ([ response.json ]));
  };


  const parseIncomingLog = (z, bundle) => {
    return [ bundle.cleanedRequest ];
  };


  return {
    key: `${network}${toTitleCase(type)}`, // uniquely identifies the trigger
    noun: toTitleCase(type), // user-friendly word that is used to refer to the resource

    // `display` controls the presentation in the Zapier Editor
    display: {
      label: `${toTitleCase(network)} ${toTitleCase(type)}`,
      description: `Triggers when a ${type} is found in a new block on the ${toTitleCase(network)} network.`
    },

    // `operation` implements the API call used to fetch the data
    operation: {
      type: 'hook',

      inputFields: [
        {
          key: 'name',
          required: true,
          label: 'Name of the subscription',
          helpText: 'Name your subscription!'
        }
      ].concat(type === 'log' ? LOG_FILTERS : TRANSACTION_FILTERS),

      outputFields: [
        { key: 'id', label: 'ID' }
      ],

      perform: parseIncomingLog,
      performList: getExampleLogs,

      performSubscribe: subscribeHook,
      performUnsubscribe: unsubscribeHook,
      sample: {
        required: 'for no reason'
      }
    }
  };
};