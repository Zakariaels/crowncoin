import React, {useEffect} from 'react';
import factoryContractInstance from '../ethereum/factory';

export default function CampaignIndex() {
    useEffect(() => {
        const getCampaigns = async () => {
            const campaigns = await factoryContractInstance.methods.getDeployedCampaigns().call();
            console.log(campaigns);
        }
        getCampaigns();
    }, [])
    
    
    return (
        <h1>CampaignIndex</h1>
    );
}