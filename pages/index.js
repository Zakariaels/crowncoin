import React, { useEffect } from 'react';
import factoryContractInstance from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';
function CampaignIndex({ campaigns }) {
  const renderCampaigns = () => {
    const items = campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });

    return items;
  };
  return (
    <Layout>
      <div>
        <h3>Open Campaigns</h3>
        <Link route="campaigns/new">
          <a>
            <Button floated="right" content="Create Campaign" icon="add circle" primary />
          </a>
        </Link>

        <Card.Group items={renderCampaigns()} />
      </div>
    </Layout>
  );
}

CampaignIndex.getInitialProps = async () => {
  const campaigns = await factoryContractInstance.methods.getDeployedCampaigns().call();
  return { campaigns };
};

export default CampaignIndex;
