const {
  CLIENT_URL,
  BACKEND_API,
  STATIC_DOMAIN,
  IS_PROD,
  ENVIRONMENT,
  SENTRY_DSN,
  NETWORKS,
  EXPLORER_URLS,
  API_URLS,
  DEFAULT_NETWORK,
  EXCHANGE_API,
  IMGIX_URL,
  DEFAULT_WEB3_URL,
  MONA_TOKEN_ADDRESSES,
  DIGITAL_MARKETPLACE_ADDRESSES,
  ACCESS_CONTROL_ADDRESSES,
  DTX_ADDRESSES
} = require('config');
const withImages = require('next-images');

const webpack = require('webpack')

const env = {
  PINATA_API_KEY: process.env.PINATA_API_KEY,
  PINATA_API_SECRET_KEY: process.env.PINATA_API_SECRET_KEY,
  INFURA_API_KEY: process.env.INFURA_API_KEY
};

module.exports = withImages({
  publicRuntimeConfig: {
    BACKEND_API,
    STATIC_DOMAIN,
    CLIENT_URL,
    IS_PROD,
    ENVIRONMENT,
    SENTRY_DSN,
    NETWORKS,
    EXPLORER_URLS,
    API_URLS,
    DEFAULT_NETWORK,
    EXCHANGE_API,
    IMGIX_URL,
    DEFAULT_WEB3_URL,
    MONA_TOKEN_ADDRESSES,
    DIGITAL_MARKETPLACE_ADDRESSES,
    ACCESS_CONTROL_ADDRESSES,
    DTX_ADDRESSES
  },
  trailingSlash: true,
  assetPrefix: './',
  images: {
    domains: ['digitalax.mypinata.cloud'],
  },
  webpack(cfg, { isServer }) {
    const originalEntry = cfg.entry;
    cfg.entry = async () => {
      const entries = await originalEntry();
      if (entries['main.js'] && !entries['main.js'].includes('./polyfills.js')) {
        entries['main.js'].unshift('./polyfills.js');
      }
      return entries;
    };

    if (!isServer) {
      cfg.node = {
        ws: 'empty',
      };
    }

    cfg.plugins.push(new webpack.EnvironmentPlugin(env))

    return cfg;
  },
});
