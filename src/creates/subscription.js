module.exports = {
  key: 'subscription',
  noun: 'Subscription',
  display: { label: 'Create Subscription', description: 'Create a new transaction or log subscription' },
  operation: {
    perform: {
      url: 'https://api.ethercast.io/{{id}}'
    },
    sample: {
      id: 'uuid'
    }
  }
};