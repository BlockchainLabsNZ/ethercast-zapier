module.exports = {
  key: 'subscription',

  noun: 'Subscription',

  display: {
    label: 'Create Subscription',
    description: 'Create a new transaction or log subscription'
  },

  operation: {
    perform: (z, bundle) => {
      return z.request({
        url: 'https://api.ethercast.io/subscriptions',
        method: 'POST'
      });
    },
    sample: {
      id: 'uuid'
    }
  }
};