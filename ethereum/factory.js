import web3 from './web3';
import factory from './build/CampaignFactory.json';

// create an instance of the factory smart contract using its interface and address
const factoryContractInstance = new web3.eth.Contract(JSON.parse(factory.interface), '0x61B106c4500Ae40312A4fe1eD6A6cf46ebEf9941');

export default factoryContractInstance;