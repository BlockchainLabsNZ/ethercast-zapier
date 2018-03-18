const toTitleCase = require('../util/to-title-case');
const getInputFields = require('../util/get-input-fields');
const createInputDataFilter = require('../util/create-input-data-filters');

module.exports = function createTrigger(network, apiUrl, type) {
  const subscribeHook = (z, bundle) => {
    const subscription = {
      name: `Zapier ${bundle.meta.zap.id}`,
      description: `Subscription created by Zapier with ID ${bundle.meta.zap.id}`,
      webhookUrl: bundle.targetUrl,
      type,
      filters: createInputDataFilter(type, bundle.inputData)
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
        filters: createInputDataFilter(type, bundle.inputData)
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
    noun: `${toTitleCase(type)} Subscription`, // user-friendly word that is used to refer to the resource

    // `display` controls the presentation in the Zapier Editor
    display: {
      label: `${toTitleCase(network)} ${toTitleCase(type)}`,
      description: `Triggers when a ${type} is found in a new block on the ${toTitleCase(network)} network.`
    },

    // `operation` implements the API call used to fetch the data
    operation: {
      type: 'hook',

      inputFields: getInputFields(type),

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