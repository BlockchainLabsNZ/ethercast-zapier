const toTitleCase = require('../util/to-title-case');

module.exports = function logsTrigger(network, apiUrl) {
  const subscribeHook = (z, bundle) => {
    const options = {
      url: `${apiUrl}/subscriptions`,
      method: 'POST',
      body: {
        name: bundle.inputFields.name,
        webhookUrl: bundle.targetUrl
      }
    };

    return z.request(options)
      .then((response) => response.json);
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
      .then((response) => JSON.parse(response.content));
  };

  const getExampleLogs = (z, bundle) => {
    // For the test poll, you should get some real data, to aid the setup process.
    const options = {
      url: `${apiUrl}/get-examples`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        type: 'log',
        filters: {
          address: bundle.inputData.address.split(',').map(s => s.trim())
        }
      }
    };

    return z.request(options)
      .then((response) => ([ JSON.parse(response.content) ]));
  };


  const parseIncomingLog = (z, bundle) => {
    return [ bundle.cleanedRequest ];
  };


  return {
    key: `${network}Logs`, // uniquely identifies the trigger
    noun: 'Log', // user-friendly word that is used to refer to the resource

    // `display` controls the presentation in the Zapier Editor
    display: {
      label: `${toTitleCase(network)} Ethereum Contract Log Emitted`,
      description: `Triggers when logs are emitted by an Ethereum smart contract on the ${toTitleCase(network)} network.`
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
        },
        {
          key: 'address',
          required: true,
          label: 'Contract Address',
          helpText: 'A comma delimited list of contract addresses'
        },
        {
          key: 'topic0',
          required: false,
          label: 'Log Event Signature',
          helpText: 'This is the signature of the emitted log event'
        }
      ],

      outputFields: [
        { key: 'id', label: 'ID' }
      ],

      perform: parseIncomingLog,
      performList: getExampleLogs,

      performSubscribe: subscribeHook,
      performUnsubscribe: unsubscribeHook,
      sample: {
        transactionHash: '0x0'
      }
    }
  };
};