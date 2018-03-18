const toTitleCase = require('../util/to-title-case');
const getInputFields = require('../util/get-input-fields');

module.exports = function createSubscriptionCreate(network, apiUrl, type) {

  return {
    key: `create_${network}_${type}_subscription`,

    noun: `${toTitleCase(network)} Subscription`,

    display: {
      label: `Create ${toTitleCase(network)} ${toTitleCase(type)} Subscription`,
      description: 'Create a new subscription'
    },

    operation: {
      inputFields: [
        {
          key: 'name',
          required: true,
          label: 'Name',
          helpText: 'Name of the subscription to be created'
        },
        {
          key: 'webhookUrl',
          required: true,
          label: 'Webhook URL',
          helpText: 'The webhook URL to which events for this subscription should be sent'
        }
      ].concat(getInputFields(type)),

      perform: (z, bundle) => {
        const subscription = {
          name: bundle.inputData.name,
          description: `Subscription created by Zapier`,
          webhookUrl: bundle.inputData.webhookUrl,
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
      },
      sample: {
        id: 'string'
      }
    }
  };
};