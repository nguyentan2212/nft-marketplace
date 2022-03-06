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

    const uploadNFTCollection = (e) => {
        setStage("uploading");
        let metadata = {
        name: e.name,
            symbol: e.symbol,
            image: e.image,
            royalty: e.royalties,
            description: e.description,
        };
        saveFile(
            "metadata.json",
            { base64: btoa(unescape(encodeURIComponent(JSON.stringify(metadata)))) },
            {
                type: "json",
                metadata,
                saveIPFS: true,
                onSuccess: (e) => deployNFTCollection(e, metadata),
            }
        ).then();
    };

    const deployNFTCollection = async (e, metadata) => {
        setStage("deploying");
        const hash = e["_hash"];
        const uri = `ipfs://${hash}`;
        const contract = TruffleContract(NFTCollectionAbi);
        contract.setProvider(provider);
        const instance = await contract.deployed();
        try {
            console.log(metadata, uri);
            const result = await instance.deployNFT(
                metadata.name, metadata.symbol, uri, metadata.royalty * 100,
                { from: account }
            );

            await syncContract(result, uri, metadata.name);
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
    };
    const stages = {
        default: "Loading...",
        uploading: "Uploading Metadata...",
        deploying: "Deploying Contract...",
        addingModule: "Adding Module...",
        syncing: "Syncing Module...",
    };

    return { stage, stages, uploadNFTCollection, error };
}

export default useNFTCollection;