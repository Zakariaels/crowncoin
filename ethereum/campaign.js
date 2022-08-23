import web3 from './web3';
import campaignContract from './build/Campaign.json';

const _interface = JSON.parse(campaignContract.interface);

export default (address) => {
    const campaignContractInstance = new web3.eth.Contract(_interface, address);
    return campaignContractInstance;
};
