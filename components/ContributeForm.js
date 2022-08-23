import React, { useState } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import campaignContractInstance from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

const ContributeForm = ({ address }) => {
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const onChange = (event) => {
    setErrorMessage('');

    setValue(event.target.value);
  };
  const onSubmit = async (event) => {
    setLoading(true);
    setErrorMessage('');
    event.preventDefault();

    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = campaignContractInstance(address);
      await campaign.methods
        .contribute()
        .send({ value: web3.utils.toWei(value, 'ether'), from: accounts[0] });
      Router.replaceRoute(`/campaigns/${address}`);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setValue('');
      setLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit} error={!!errorMessage}>
      <Form.Field>
        <label> Amount to Contribute </label>
        <Input label="ether" labelPosition="right" value={value} onChange={onChange} />
      </Form.Field>
      <Message error header="Oops!" content={errorMessage} />
      <Button type="submit" primary loading={loading}>
        Contribute
      </Button>
    </Form>
  );
};

export default ContributeForm;
