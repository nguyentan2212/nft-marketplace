import React from "react";
import { Form, Notification } from "web3uikit";
import { useNavigate } from "react-router-dom";
import Flex from "../../../uikit/Flex";
import HeaderStyled from "../../../uikit/HeaderStyled";
import Typography from "../../../uikit/Typography";
import useNFTControl from "../../../hooks/useNFTControl";

function NFTCollection() {
    const { stage, stages, error, uploadNFTCollection } = useNFTControl();
    const navigate = useNavigate();

    const onSubmit = async ({ data }) => {
        const nftCollectionInfo = {
            description: data[3].inputResult,
            image: String(data[1].inputResult),
            name: String(data[0].inputResult),
            royalties: data[4].inputResult,
            symbol: data[2].inputResult,
        };
        console.log("nftCollectionInfo: ", nftCollectionInfo);
        await uploadNFTCollection(nftCollectionInfo);
        navigate("admin");
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
                <div style={{ padding: "16px" }}>
                    <Typography variant="h4">Image, Video, Audio, or 3D Model</Typography>
                    <Typography variant="span">
                        File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. <br />
                        Max size: 100 MB
                    </Typography>
                </div>
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
        name: "Image URL",
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
        name: "Description",
        type: "text",
        inputWidth: "100%",
        value: "",
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
