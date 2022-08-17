const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledCampaignFactory = require('./build/CampaignFactory.json');

require('dotenv').config();

const MNEMONIC = process.env.MNEMONIC;
const INFURA_KEY = process.env.INFURA_KEY;

const INITIAL_MESSAGE = 'Hi there!';
const GAS = '1000000';

const provider = new HDWalletProvider(MNEMONIC, INFURA_KEY);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compiledCampaignFactory.interface))
    .deploy({ data: compiledCampaignFactory.bytecode })
    .send({ gas: GAS, from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();
