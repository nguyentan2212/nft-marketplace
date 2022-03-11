import { useState } from "react";
import { useMoralis, useChain, useMoralisWeb3Api } from "react-moralis";
import TruffleContract from "@truffle/contract";

const CollectionAbi = require("../contracts/abi/NFT721.json");

function useCollection(address) {
    const { account, provider } = useMoralis();
    const { chainId } = useChain();
    const { token } = useMoralisWeb3Api();
    const [isMinting, setIsMinting] = useState(false);
    const [mintingSuccess, setMintingSuccess] = useState(false);
    const [mintingError, setMintingError] = useState(null);

    const mint = async (to, uri) => {
        const contract = TruffleContract(CollectionAbi);
        contract.setProvider(provider);
        const instance = await contract.at(address);

        setIsMinting(true);
        try {
            await instance.safeMint(to, uri, { from: account });
            token.syncNFTContract({
                address,
                chain: chainId,
            });
            setIsMinting(false);
            setMintingSuccess(true);
        } catch (e) {
            setIsMinting(false);
            setMintingError(e.message);
        }
    };

    const getApproved = async (tokenId) => {
        const contract = TruffleContract(CollectionAbi);
        contract.setProvider(provider);
        const instance = await contract.at(address);
        const result = await instance.getApproved(tokenId, { from: account });

        return result;
    };

    const approve = async (to, tokenId) => {
        const contract = TruffleContract(CollectionAbi);
        contract.setProvider(provider);
        const instance = await contract.at(address); 
        await instance.approve(to, tokenId, { from: account });
    };

    return { mint, isMinting, mintingError, mintingSuccess, approve, getApproved };
}

export default useCollection;
