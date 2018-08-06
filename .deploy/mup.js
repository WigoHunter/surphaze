var keys = require("../keys.json").keys;

module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: keys.host,
      username: 'root',
      // pem: './path/to/pem'
      password: keys.password,
      // or neither for authenticate from ssh-agent
    }
  },

  app: {
    // TODO: change app name and path
    name: 'surphaze',
    path: '../',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'https://surphaze.me',
      MONGO_URL: keys.MONGO_URL,
    },

    docker: {
      // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
      image: 'zodern/meteor:root',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true,
    deployCheckWaitTime: 200,
  },

  proxy: {
    domains: "surphaze.me",
    ssl: {
      letsEncryptEmail: "kh736@cornell.edu",
      forceSSL: true
    }
  }

  /*
  mongo: {
    version: '3.4.1',
    servers: {
      one: {}
    }
  },
  */

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  // proxy: {
  //   domains: 'mywebsite.com,www.mywebsite.com',

  //   ssl: {
  //     // Enable Let's Encrypt
  //     letsEncryptEmail: 'email@domain.com'
  //   }
  // }
};
