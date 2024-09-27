const webpack = require('webpack');

module.exports = function override(config, env) {
  // Polyfill Node.js core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    buffer: require.resolve("buffer/"),
    stream: require.resolve("stream-browserify"),
    crypto: require.resolve("crypto-browserify"),
  };

  // Add any other Webpack customizations here
  return config;
};
