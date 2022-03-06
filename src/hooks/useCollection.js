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
        setIsMinting(true);
        const contract = TruffleContract(CollectionAbi);
        contract.setProvider(provider);
        const instance = await contract.at(address);
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

    return { mint, isMinting, mintingError, mintingSuccess };
}

export default useCollection;
