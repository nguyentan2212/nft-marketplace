import React from "react";
import { useMoralis, useMoralisFile } from "react-moralis";
import { Form } from "web3uikit";
import useCollection from "../../../hooks/useCollection";

function NFTMinter({ address }) {
    const { account } = useMoralis();
    const { saveFile, isUploading } = useMoralisFile();
    const { isMinting, mintingError, mintingSuccess, mint } = useCollection(address);

    const getButtonText = () => {
        if (isUploading) {
            return "Uploading Metadata";
        }
        if (isMinting) {
            return "Minting";
        }
        return "Mint NFT";
    };

    const mintNFT = (e) => {
        let metadata = {
            name: e.name,
            image: e.image,
            description: e.description,
        };
        saveFile(
            "metadata.json",
            { base64: btoa(unescape(encodeURIComponent(JSON.stringify(metadata)))) },
            {
                type: "json",
                metadata,
                saveIPFS: true,
            }
        ).then(async (file) => {
            const hash = file["_hash"];
            await mint(e.to, `${hash}`);
        });
    };
    return (
        <>
            <Form
                id={"form-mint-nft"}
                buttonConfig={{
                    isFullWidth: true,
                    text: getButtonText(),
                    isLoading: isUploading || isMinting,
                    theme: !isMinting ? "primary" : "secondary",
                    onClick: () => console.log("submitting ..."),
                }}
                data={[
                    {
                        name: "Name",
                        type: "text",
                        value: "",
                        inputWidth: "100%",
                        validation: {
                            required: true,
                        },
                    },
                    {
                        name: "Image URL",
                        type: "text",
                        value: "",
                        inputWidth: "100%",
                        validation: {
                            required: true,
                        },
                    },
                    {
                        name: "Description",
                        type: "text",
                        value: "",
                        inputWidth: "100%",
                        validation: {
                            required: true,
                        },
                    },
                    {
                        name: "To Address",
                        type: "text",
                        inputWidth: "100%",
                        value: account,
                        validation: {
                            required: true,
                        },
                    },
                ]}
                onSubmit={(e) => {
                    const name = String(e.data[0].inputResult);
                    const image = String(e.data[1].inputResult);
                    const description = e.data[2].inputResult;
                    const to = e.data[3].inputResult;
                    mintNFT({ name, image, description, to });
                }}
                title="Mint NFT"
            />
        </>
    );
}

export default NFTMinter;
