import React from 'react';
import Layout from '../../components/Layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import factoryContractInstance from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

const CampaignNew = () => {
  const [minimumContribution, setMinimumContribution] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const accounts = await web3.eth.getAccounts();
      await factoryContractInstance.methods
        .createCampaign(minimumContribution)
        .send({ from: accounts[0] });
      Router.pushRoute('/');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h3>Create a Campaign</h3>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Minumum Contribution (Wei)</label>
          <Input
            label="Wei"
            labelPosition="right"
            placeholder="Minumum Contribution (Wei)"
            value={minimumContribution}
            onChange={(ev) => setMinimumContribution(ev.target.value)}
          />
        </Form.Field>
        <Message error header="Oops!" content={errorMessage} />
        <Button loading={loading} type="submit" primary>
          Create
        </Button>
      </Form>
    </Layout>
  );
};

export default CampaignNew;
