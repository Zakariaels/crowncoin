import React from 'react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';
import { Button, Table } from 'semantic-ui-react';
import campaignContractInstance from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import RequestRow from '../../../components/RequestRow';

const { Header, Row, HeaderCell, Body } = Table;

const RequestIndex = ({ address, requests, requestsCount, approversCount }) => {
    const renderRows = () => {
        return requests.map((req, idx) => {
            return (
                <RequestRow 
                    id={idx}
                    key={idx}
                    request={req}
                    address={address}
                    approversCount={approversCount}
                />
            )
        })
    }
  return (
    <Layout>
      <h3>Requests</h3>
      <Link route={`/campaigns/${address}/requests/new`}>
        <a>
          <Button style={{marginBottom: 10}} primary floated='right'>Add a request</Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>
            {renderRows()}
        </Body>
      </Table>
      <div> Found { requestsCount } requests </div>
    </Layout>
  );
};

RequestIndex.getInitialProps = async ({ query: { address } }) => {
  const campaign = campaignContractInstance(address);
  const accounts = await web3.eth.getAccounts();
  const requestsCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.approversCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestsCount))
      .fill()
      .map((elm, idx) => campaign.methods.requests(idx).call())
  );

  return { address, requests, requestsCount, approversCount };
};

export default RequestIndex;
