import React, { useState } from 'react';
import { Form, Input, Button, Message } from 'semantic-ui-react';
import campaignContractInstance from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';
import Layout from '../../../components/Layout';

const RequestsNew = ({ address }) => {
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [recipient, setRecipient] = useState('');

  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (ev) => {
    setLoading(true);
    setErrorMessage('');
    event.preventDefault();

    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = campaignContractInstance(address);
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({ from: accounts[0] });
      Router.pushRoute(`/campaigns/${address}/requests`);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setValue('');
      setDescription('');
      setRecipient('');
      setLoading(false);
    }
  };

  const onDescriptionChange = (ev) => {
    setErrorMessage('');
    setDescription(ev.target.value);
  };
  const onValueChange = (ev) => {
    setErrorMessage('');
    setValue(ev.target.value);
  };
  const onRecipientChange = (ev) => {
    setErrorMessage('');
    setRecipient(ev.target.value);
  };

  return (
    <Layout>
      <Link route={`/campaigns/${address}/requests`}>
        <a>Back </a>
      </Link>

      <h3>New Request</h3>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input value={description} onChange={onDescriptionChange} />
        </Form.Field>
        <Form.Field>
          <label>Value (Ether)</label>
          <Input value={value} onChange={onValueChange} />
        </Form.Field>
        <Form.Field>
          <label>Recipient Address</label>
          <Input value={recipient} onChange={onRecipientChange} />
        </Form.Field>
        <Message error header="Oops!" content={errorMessage} />
        <Button primary loading={loading}>
          Create Request
        </Button>
      </Form>
    </Layout>
  );
};

RequestsNew.getInitialProps = ({ query: { address } }) => {
  return { address };
};

export default RequestsNew;
