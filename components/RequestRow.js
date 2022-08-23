import React, { useState } from 'react';
import { Button, Table } from 'semantic-ui-react';
import campaignContractInstance from '../ethereum/campaign';
import web3 from '../ethereum/web3';

const { Row, Cell } = Table;
const RequestRow = ({ id, request, address, approversCount }) => {
  const { description, value, recipient, complete, approvalCount } = request;
  const [approveLoading, setApproveLoading] = useState(false);
  const [finalizeLoading, setFinalizeLoading] = useState(false);
  const approveRequest = async () => {
    try {
      setApproveLoading(true);
      const accounts = await web3.eth.getAccounts();
      const campaign = campaignContractInstance(address);
      await campaign.methods.approveRequest(id).send({ from: accounts[0] });
    } catch (error) {
      console.log(error);
    } finally {
      setApproveLoading(false);
    }
  };
  const finalizeRequest = async () => {
    try {
      setFinalizeLoading(true);

      const accounts = await web3.eth.getAccounts();
      const campaign = campaignContractInstance(address);
      await campaign.methods.finalizeRequest(id).send({ from: accounts[0] });
    } catch (error) {
      console.log(error);
    } finally {
      setFinalizeLoading(false);
    }
  };

  const readyToFinalize = approvalCount > approversCount / 2;
  return (
    <Row disabled={complete} positive={readyToFinalize && !complete} >
      <Cell>{id}</Cell>
      <Cell>{description}</Cell>
      <Cell>{web3.utils.fromWei(value, 'ether')}</Cell>
      <Cell>{recipient}</Cell>
      <Cell>{`${approvalCount}/${approversCount}`}</Cell>
      <Cell>
        {!complete && (
          <Button loading={approveLoading} color="green" basic onClick={approveRequest}>
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {!complete && (
          <Button loading={finalizeLoading} color="teal" basic onClick={finalizeRequest}>
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  );
};

export default RequestRow;
