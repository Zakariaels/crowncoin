const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledCampaign = require('../ethereum/build/Campaign.json');
const compiledCampaignFactory = require('../ethereum/build/CampaignFactory.json');

const GAS_AMOUNT = '1000000';

let accounts;
let factory;
let campaignAddress;
let campaign;

const MINIMUM_REQUIRED = '100';
const MORE_THAN_MINIMUM_REQUIRED = (Number(MINIMUM_REQUIRED) + 10).toString();
const LESS_THAN_MINIMUM_REQUIRED = (Number(MINIMUM_REQUIRED) - 10).toString();

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledCampaignFactory.interface))
        .deploy({ data: compiledCampaignFactory.bytecode })
        .send({ from: accounts[0], gas: GAS_AMOUNT });

    await factory.methods.createCampaign('100').send({ from: accounts[0], gas: GAS_AMOUNT });
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
});

const constructRequest = (recipient) => ({
    description: 'Request description',
    value: '10',
    recipient
});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });
    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });
    it('allows people to contribute money and marks them as approvers', async () => {
        const contributer = accounts[1];
        await campaign.methods.contribute().send({ value: MORE_THAN_MINIMUM_REQUIRED, from: contributer });
        const isContributor = await campaign.methods.approvers(contributer).call();
        assert(isContributor);
    });
    it('requires a minimum contribution', async () => {
        assert.rejects(campaign.methods.contribute().send({ value: LESS_THAN_MINIMUM_REQUIRED, from: accounts[1] }));
    });
    it('allows a manager to make a payment request', async () => {
        const { description, value, recipient } = constructRequest(accounts[1]);
        await campaign.methods.createRequest(description, value, recipient).send({ from: accounts[0], gas: GAS_AMOUNT });
        const request = await campaign.methods.requests(0).call();
        assert.equal(description, request.description);
        assert.equal(value, request.value);
        assert.equal(recipient, request.recipient);
        assert.equal(request.complete, false);
        assert.equal(request.approvalCount, 0);
    });

    it('processes requests - E2E', async () => {
        const { description, value, recipient } = constructRequest(accounts[1]);
        const initialBalance = await web3.eth.getBalance(accounts[1]);
        
        await campaign.methods.contribute().send({ value: MORE_THAN_MINIMUM_REQUIRED, from: accounts[0] });
        await campaign.methods.createRequest(description, value, recipient).send({ from: accounts[0], gas: GAS_AMOUNT });
        await campaign.methods.approveRequest(0).send({ from: accounts[0], gas: GAS_AMOUNT });
        await campaign.methods.finalizeRequest(0).send({ from: accounts[0], gas: GAS_AMOUNT });
        const request = await campaign.methods.requests(0).call();
        assert.equal(request.complete, true);

        const balance = await web3.eth.getBalance(accounts[1]);
        assert(balance > initialBalance);
    });
});