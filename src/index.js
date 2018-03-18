const _ = require('underscore');
const createTrigger = require('./triggers/create-trigger');
const createSubscriptionCreate = require('./creates/create-subscription-create');

const { authentication, addBearerHeader } = require('./authentication');

const NETWORKS = [
  { name: 'mainnet', apiUrl: 'https://api.ethercast.io' },
  { name: 'kovan', apiUrl: 'https://kovan.api.ethercast.io' }
];

const TYPES = [
  'log',
  'transaction'
];

function forEachCombo(action) {
  return _.flatten(
    _.map(
      NETWORKS,
      ({ name, apiUrl }) => _.map(TYPES, type => action(name, apiUrl, type))
    )
  );
}

const triggers = forEachCombo(createTrigger);
const creates = forEachCombo(createSubscriptionCreate);

// We can roll up all our behaviors in an App.
const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('../package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication,
  // beforeRequest & afterResponse are optional hooks into the provided HTTP client
  beforeRequest: [ addBearerHeader ],

  afterResponse: [],

  // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
  resources: {},

  // If you want your trigger to show up, you better include it here!
  triggers: _.indexBy(triggers, 'key'),

  // If you want your searches to show up, you better include it here!
  searches: {},

  // If you want your creates to show up, you better include it here!
  creates: _.indexBy(creates, 'key')
};

// Finally, export the app.
module.exports = App;
