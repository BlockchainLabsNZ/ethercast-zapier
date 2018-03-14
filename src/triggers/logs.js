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


const parseIncomingLog = (z, bundle) => {
  return [ bundle.cleanedRequest ];
};


module.exports = {
  key: 'logs', // uniquely identifies the trigger
  noun: 'Log Subscription', // user-friendly word that is used to refer to the resource

  // `display` controls the presentation in the Zapier Editor
  display: {
    label: 'New Log Subscription',
    description: 'Triggers when logs are emitted in a new block.'
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
        helpText: 'The address of the contract for which to listen to logs'
      }
    ],
    outputFields: [
      { key: 'id', label: 'ID' }
    ],
    perform: parseIncomingLog,
    performSubscribe: subscribeHook,
    sample: {
      transactionHash: '0x0'
    }
  }
};