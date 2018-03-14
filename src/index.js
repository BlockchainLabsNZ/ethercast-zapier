const logs = require('./triggers/logs');
const subscription = require('./creates/subscription');

const { authentication, addBearerHeader } = require('./authentication');

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
  triggers: {
    logs
  },

  // If you want your searches to show up, you better include it here!
  searches: {},

  // If you want your creates to show up, you better include it here!
  creates: {
    subscription
  }
};

// Finally, export the app.
module.exports = App;
