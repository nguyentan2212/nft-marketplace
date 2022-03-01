import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";

const Contract = require("@truffle/contract");
const MarketplaceAbi = require('../contracts/abi/Marketplace.json');

function useMarketplace() {
    const { provider } = useMoralis();
    const [marketplace, setMarketplace] = useState(null);
    const [marketplaceAddress, setMarketplaceAddress] = useState(null);

    useEffect(() => {
        const init = async () => {
            if (provider) {
                const contract = Contract(MarketplaceAbi);
                contract.setProvider(provider);
                const instance = await contract.deployed();
                setMarketplace(instance);
                setMarketplaceAddress(instance.address);
            }
        }
        init();
    },[provider]);
    return { marketplace, marketplaceAddress };
}

export default useMarketplace;
