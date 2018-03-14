const subscribeHook = (z, bundle) => {
  const options = {
    url: 'https://api.ethercast.io/subscriptions',
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
    url: `https://api.ethercast.io/subscriptions/${hookId}`,
    method: 'DELETE'
  };

  // You may return a promise or a normal data structure from any perform method.
  return z.request(options)
    .then((response) => JSON.parse(response.content));
};

const getExampleLogs = (z, bundle) => {
  // For the test poll, you should get some real data, to aid the setup process.
  const options = {
    url: 'https://api.ethercast.io/get-example-log',
    method: 'POST',
    params: {
      address: bundle.inputData.address.split(',').map(s => s.trim())
    }
  };

  return z.request(options)
    .then((response) => ([ JSON.parse(response.content) ]));
};


const parseIncomingLog = (z, bundle) => {
  return [ bundle.cleanedRequest ];
};


module.exports = {
  key: 'logs', // uniquely identifies the trigger
  noun: 'Log Subscription', // user-friendly word that is used to refer to the resource

  // `display` controls the presentation in the Zapier Editor
  display: {
    label: 'Log Emitted',
    description: 'Triggers when logs are emitted by a contract.'
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