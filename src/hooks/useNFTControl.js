import { useState } from "react";
import TruffleContract from "@truffle/contract";
import { useChain, useMoralis, useNewMoralisObject, useMoralisFile, useMoralisWeb3Api } from "react-moralis";
const NFTCollectionAbi = require("../contracts/abi/NFTControl.json");

function useNFTCollection() {
    const [stage, setStage] = useState("default");
    const [error, setError] = useState();
    const { token } = useMoralisWeb3Api();
    const { account, provider } = useMoralis();
    const { saveFile } = useMoralisFile();
    const { save } = useNewMoralisObject("InstalledModules");
    const { chainId } = useChain();

    const deployNFTCollection = async (metadata) => {
        setStage("deploying");
        const contract = TruffleContract(NFTCollectionAbi);
        contract.setProvider(provider);
        const instance = await contract.deployed();
        try {
            const result = await instance.deployNFT(
                metadata.name,
                metadata.symbol,
                metadata.uri,
                metadata.royalties * 100,
                { from: account }
            );

            await syncContract(result, metadata.uri, metadata.name);
        } catch (e) {
            console.log(`Error: ${e.message}`);
            setError(e.message);
        }
    };

    const syncContract = async (receipt, uri, name) => {
        console.log("receipt: ", receipt);
        const { logs } = receipt;
        const { args } = logs[0];
        setStage("syncing");
        await token.syncNFTContract({
            address: args.contractAddress,
            chain: chainId,
        });
        setStage("addingModule");
        await save({ module: args.contractAddress, uri, name });
        setStage("default");
    };
    const stages = {
        default: "Loading...",
        deploying: "Deploying Contract...",
        addingModule: "Adding Module...",
        syncing: "Syncing Module...",
    };

    return { stage, stages, deployNFTCollection, error };
}

export default useNFTCollection;
