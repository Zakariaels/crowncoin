import React from 'react';
import Layout from '../../components/Layout';
import web3 from '../../ethereum/web3';
import campaignContractInstance from '../../ethereum/campaign';
import { Card, Grid, Button } from 'semantic-ui-react';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

const CampaignShow = (props) => {
  const { minimumContribution, balance, requestsCount, approversCount, manager, address } = props;

  const items = [
    {
      header: manager,
      description: 'Address of Manager',
      meta: 'The manager created this campaign and can create requests to withdraw money',
      style: { overflowWrap: 'break-word' },
    },
    {
      header: minimumContribution,
      description: 'Minimum Contribution (Wei)',
      meta: 'You must contribute at least this much wei to become an approver',
    },
    {
      header: approversCount,
      description: 'Number of Approvers',
      meta: 'Approvers donate to the campaign and validate manager requests',
    },
    {
      header: requestsCount,
      description: 'Number of Requests',
      meta: 'A request created by the manager to withdraw money from the contract. Requests must be approved!',
    },
    {
      header: web3.utils.fromWei(balance, 'ether'),
      description: 'Campaign Balance (Ether)',
      meta: 'The balance is how much money this campaign has left to spend',
    },
  ];

  return (
    <Layout>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={items} />
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={address} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link route={`/campaigns/${address}/requests`}>
              <a>
                <Button primary>View Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

CampaignShow.getInitialProps = async ({ query: { address } }) => {
  const campaign = campaignContractInstance(address);
  const summary = await campaign.methods.getSummary().call();
  return {
    minimumContribution: summary['0'],
    balance: summary['1'],
    requestsCount: summary['2'],
    approversCount: summary['3'],
    manager: summary['4'],
    address,
  };
};

export default CampaignShow;
