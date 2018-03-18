const _ = require('underscore');
const createTrigger = require('./triggers/create-trigger');

const { authentication, addBearerHeader } = require('./authentication');

const triggers = [
  createTrigger('mainnet', 'https://api.ethercast.io', 'log'),
  createTrigger('mainnet', 'https://api.ethercast.io', 'transaction'),
  createTrigger('kovan', 'https://kovan.api.ethercast.io', 'log'),
  createTrigger('kovan', 'https://kovan.api.ethercast.io', 'transaction')
];

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
  creates: {}
};

// Finally, export the app.
module.exports = App;
