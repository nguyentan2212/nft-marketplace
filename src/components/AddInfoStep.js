import React from "react";
import { Input, Select, Icon, TextArea, Checkbox, Button } from "web3uikit";

function AddInfoStep({ nftType }) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                minWidth: "400px",
                maxWidth: "500px",
                marginTop: "24px",
                marginBottom: "24px",
                marginLeft: "auto",
                marginRight: "auto",
            }}>
            <Input type="text" label="Name" width="100%"></Input>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" }}>
                <Select
                    width="100%"
                    defaultOptionIndex={0}
                    label={`Choose ${nftType}`}
                    options={[
                        {
                            id: "discord",
                            label: "Discord",
                            prefix: <Icon fill="#68738D" svg="discord" />,
                        },
                        {
                            id: "emoji",
                            label: "Emoji",
                            prefix: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
                        },
                        {
                            id: "txt",
                            label: "TXT",
                            prefix: "TXT",
                        },
                        {
                            id: "dapp",
                            label: "dApp",
                            prefix: <Icon fill="#68738D" svg="server" />,
                        },
                    ]}
                />
                <Button
                    icon="plus"
                    iconLayout="icon-only"
                    id="test-button-secondary-icon"
                    text=""
                    theme="primary"
                    type="button"
                />
            </div>
            <Input type="number" label="Price" width="100%"></Input>
            <TextArea label="Description" width="100%"></TextArea>
            <Input type="number" label="Royalty" width="100%"></Input>
            <Checkbox label="Lazy Minting" />
        </div>
    );
}

export default AddInfoStep;
