import web3 from './web3';
import factory from './build/CampaignFactory.json';

const factoryContractInstance = new web3.eth.Contract(JSON.parse(factory.interface), '0xe76F525ba436D33b878B8Ec9AB5a5AD190cA9226');

export default factoryContractInstance;