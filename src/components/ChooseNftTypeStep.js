import React from "react";
import { Card, Illustration } from "web3uikit";

function ChooseNftTypeStep({ nftType, setNftType }) {
    return (
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "24px", marginBottom: "24px" }}>
            <div
                style={{
                    width: "250px",
                }}>
                <Card
                    onClick={function noRefCheck() {}}
                    isSelected={nftType === "Collection"}
                    setIsSelected={() => setNftType("Collection")}
                    title="NFT Collection"
                    description="ERC-721">
                    <div>
                        <Illustration height="180px" logo="chest" width="100%" />
                    </div>
                </Card>
            </div>
            <div
                style={{
                    width: "250px",
                }}>
                <Card
                    onClick={function noRefCheck() {}}
                    isSelected={nftType === "Edition"}
                    setIsSelected={() => setNftType("Edition")}
                    title="NFT Edition"
                    description="ERC-1155">
                    <div>
                        <Illustration height="180px" logo="pack" width="100%" />
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default ChooseNftTypeStep;
