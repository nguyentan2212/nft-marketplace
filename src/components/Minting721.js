import React from "react";
import { Form } from "web3uikit";

function Minting721() {
    return (
        <Form
            id={"form-mint-nft"}
            buttonConfig={{
                isFullWidth: true,
                text: "Hello",
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
                    type: "textarea",
                    value: "",
                    inputWidth: "100%",
                    validation: {
                        required: true,
                    },
                }
            ]}
            title="Mint NFT"
        />
    );
}

export default Minting721;
