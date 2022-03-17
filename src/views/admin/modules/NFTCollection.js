import React from "react";
import { Form, Notification } from "web3uikit";
import Flex from "../../../uikit/Flex";
import HeaderStyled from "../../../uikit/HeaderStyled";
import Typography from "../../../uikit/Typography";
import useNFTControl from "../../../hooks/useNFTControl";

function NFTCollection() {
    const { stage, stages, error, deployNFTCollection } = useNFTControl();

    const onSubmit = async ({ data }) => {
        const nftCollectionInfo = {
            name: data[0].inputResult,
            royalties: Number(data[2].inputResult),
            symbol: data[1].inputResult,
            uri: "ipfs://"
        };
        console.log("nftCollectionInfo: ", nftCollectionInfo);
        await deployNFTCollection(nftCollectionInfo);
    };

    return (
        <>
            <HeaderStyled>
                <Typography variant="h1">Create NFT Collection</Typography>
            </HeaderStyled>
            <div style={{ position: "absolute", top: 70, right: 1 }}>
                <Notification isVisible={!!error} message={error ? error : ""} title={"Error"} />
            </div>
            <Flex background="white" borderRadius="20px" padding="16px">
                <Form
                    buttonConfig={{
                        disabled: stage !== "default",
                        isFullWidth: true,
                        isLoading: stage !== "default",
                        onClick: () => console.log(),
                        text: "Deploy",
                        theme: "primary",
                        type: "button",
                        loadingText: stages[stage],
                    }}
                    data={formConfig}
                    onSubmit={onSubmit}
                    id={"s"}
                    title={""}
                />
            </Flex>
        </>
    );
}

export default NFTCollection;

const formConfig = [
    {
        name: "Collection Name",
        type: "text",
        inputWidth: "100%",
        value: "",
        validation: {
            required: true,
        },
    },
    {
        name: "Symbol",
        type: "text",
        inputWidth: "100%",
        value: "",
        validation: {
            required: true,
        },
    },
    {
        name: "Royalty",
        type: "number",
        inputWidth: "100%",
        value: "",
        validation: {
            required: true,
        },
    },
];
