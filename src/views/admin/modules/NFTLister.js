import React, { useState, useEffect } from "react";
import { Input, Modal, Select } from "web3uikit";
import { Image } from "antd";
import useMarketplace from "../../../hooks/useMarketplace";
import useCollection from "../../../hooks/useCollection";

function NFTLister({ nft, modalActive, setModalActive }) {
    const { listNFT, isListing, zeroAddress, marketplaceAddress } = useMarketplace();
    const { getApproved, approve } = useCollection(nft.token_address);
    const [currency, setCurrency] = useState(zeroAddress);
    const [price, setPrice] = useState();
    const [isApproved, setIsApproved] = useState(false);

    useEffect(() => {
        const init = async () => {
            const result = await getApproved(nft.token_id);
            setIsApproved(result === marketplaceAddress);
            console.log(result, marketplaceAddress);
        };
        init();
    }, [nft, getApproved, marketplaceAddress]);
    return (
        <Modal
            isVisible={modalActive}
            title={`List ${nft.metadata ? nft.metadata.name : nft.name} #${nft.token_id} For Sale`}
            onCloseButtonPressed={() => {
                setModalActive(false);
            }}
            okText="List NFT"
            onOk={async () => {
                await listNFT(nft.token_address, nft.token_id, currency, price);
                setModalActive(false);
            }}
            isOkDisabled={!price || isListing || !isApproved}
            cancelText="Approve token"
            onCancel={async () => {
                await approve(marketplaceAddress, nft.token_id);
                setIsApproved(true);
            }}
            isCancelDisabled={isApproved || isListing}
            children={[
                <div key={1} style={{ display: "grid", gap: "30px", placeItems: "center" }}>
                    <div
                        style={{
                            maxWidth: "250px",
                            maxHeight: "250px",
                            borderRadius: "15px",
                            overflow: "hidden",
                            display: "grid",
                            placeItems: "center",
                        }}>
                        {
                            // @ts-ignore
                            <Image
                                src={
                                    nft.metadata && nft.metadata.image
                                        ? nft.metadata.image
                                        : "https://i.ibb.co/FzDBLqk/Image.png"
                                }
                            />
                        }
                    </div>
                    <div
                        style={{
                            color: "black",
                            fontSize: "18px",
                            display: "grid",
                            placeItems: "center",
                        }}>
                        <p style={{ fontWeight: 600 }}>{`${nft.metadata ? nft.metadata.name : nft.name} #${
                            nft.token_id
                        }`}</p>
                        <p style={{ fontSize: "12px" }}>{nft.type}</p>
                    </div>
                    <div style={{ width: "100%", display: "flex", gap: "10px" }}>
                        <Select
                            defaultOptionIndex={0}
                            label={"Currency"}
                            onChange={(e) => {
                                setCurrency(e.id);
                            }}
                            options={[
                                {
                                    id: zeroAddress,
                                    label: "ETH",
                                    prefix: (
                                        <Image src="https://etherscan.io/token/images/weth_28.png" alt="" />
                                    ),
                                },
                                {
                                    id: "bnb",
                                    label: "BNB",
                                    prefix: (
                                        <Image src="https://etherscan.io/token/images/weth_28.png" alt="" />
                                    ),
                                },
                            ]}
                        />
                        <Input
                            width={"100%"}
                            onChange={(e) => (e.target.value > 0 ? setPrice(e.target.value) : null)}
                            label={"Price"}
                            type={"number"}
                        />
                    </div>
                </div>,
            ]}
        />
    );
}

export default NFTLister;
