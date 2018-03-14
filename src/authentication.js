const authentication = {
  type: 'oauth2',
  connectionLabel: 'Ethercast',

  test: {
    url: 'https://api.ethercast.io/subscriptions'
  },

  // you can provide additional fields for inclusion in authData
  oauth2Config: {
    // "authorizeUrl" could also be a function returning a string url
    authorizeUrl: {
      method: 'GET',
      url: 'https://ethercast.auth0.com/authorize',
      params: {
        client_id: '{{process.env.CLIENT_ID}}',
        state: '{{bundle.inputData.state}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        response_type: 'code',
        scope: 'offline_access read:subscription create:subscription deactivate:subscription',
        audience: 'https://api.ethercast.io'
      }
    },
    // Zapier expects a response providing {access_token: 'abcd'}
    // "getAccessToken" could also be a function returning an object
    getAccessToken: {
      method: 'POST',
      url: 'https://ethercast.auth0.com/oauth/token',
      audience: 'https://api.ethercast.io',
      body: {
        code: '{{bundle.inputData.code}}',
        client_id: '{{process.env.CLIENT_ID}}',
        client_secret: '{{process.env.CLIENT_SECRET}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        grant_type: 'authorization_code'
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  },
  // If you need any fields upfront, put them here
  fields: []
};

const addBearerHeader = (request, z, bundle) => {
  if (bundle.authData && bundle.authData.access_token) {
    const { access_token } = bundle.authData;
    request.headers.Authorization = `Bearer ${access_token}`;
  }

  return request;
};

module.exports = {
  authentication,
  addBearerHeader
};