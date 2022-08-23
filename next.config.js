require('dotenv').config();

module.exports = {
  env: {
    MNEMONIC: process.env.MNEMONIC,
    INFURA_KEY: process.env.INFURA_KEY,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false, stream: false, constants: false };
    return config;
  },
};
