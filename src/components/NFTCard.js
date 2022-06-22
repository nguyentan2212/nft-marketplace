import React, { useEffect, useState } from "react";
import { Card, Skeleton, Button, Icon } from "web3uikit";
import { useMoralisWeb3Api } from "react-moralis";
import DetailModal from "./DetailModal";

function NFTCard(props) {
    const { chain, address, tokenId, tokenData, isFetchData = true } = props;
    const { token } = useMoralisWeb3Api();
    const [nft, setNft] = useState({});
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        const fetchTokenIdMetadata = async () => {
            const options = {
                address,
                token_id: tokenId,
                chain: chain,
            };
            const tokenIdMetadata = await token.getTokenIdMetadata(options);
            let metadata = JSON.parse(tokenIdMetadata.metadata);
            setNft({
                ...nft,
                collectionName: tokenIdMetadata.name,
                name: metadata.name ? metadata.name : `${tokenIdMetadata.name} #${tokenIdMetadata.token_id}`,
                id: tokenIdMetadata.token_id,
                address: tokenIdMetadata.token_address,
                image: "https://gateway.moralisipfs.com/ipfs" + metadata.image.substring(6),
                uri: tokenIdMetadata.token_uri,
                standard: tokenIdMetadata.contract_type,
                symbol: tokenIdMetadata.symbol,
                attributes: metadata.attributes ? [...metadata.attributes] : null,
                description: metadata.description
                    ? metadata.description
                    : "Juliet is a young girl in Italy who falls in love with one of her family's enemies. She chooses her love with Romeo above all else. The story has a long history that precedes Shakespeare himself.",
            });
        };
        if (isFetchData) {
            fetchTokenIdMetadata();
        } else {
            let metadata = JSON.parse(tokenData.metadata);
            setNft({
                ...nft,
                collectionName: tokenData.name,
                name: metadata.name ? metadata.name : `${tokenData.name} #${tokenData.token_id}`,
                id: tokenData.token_id,
                address: tokenData.token_address,
                image: "https://gateway.moralisipfs.com/ipfs" + metadata.image.substring(6),
                uri: tokenData.token_uri,
                standard: tokenData.contract_type,
                symbol: tokenData.symbol,
                attributes: metadata.attributes ? [...metadata.attributes] : null,
                description: metadata.description
                    ? metadata.description
                    : "Juliet is a young girl in Italy who falls in love with one of her family's enemies. She chooses her love with Romeo above all else. The story has a long history that precedes Shakespeare himself.",
            });
        }
    }, [chain, address, tokenId]);

    return (
        <div
            style={{
                width: "100%",
            }}>
            <Card
                description={
                    false ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}>
                            <Button text="Buy" theme="primary" size="large" type="button" />
                            <Button text="Unlist" theme="secondary" size="large" type="button" />
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                            <Button text="Buy" theme="primary" size="large" type="button" />
                        </div>
                    )
                }
                title={
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: "12px",
                        }}>
                        {!nft.name && <Skeleton theme="text" />}
                        {nft && <p style={{ margin: 0 }}>{nft.name}</p>}
                        {nft && (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    gap: "6px",
                                    marginBottom: "16px",
                                }}>
                                <p style={{ margin: 0 }}>Price: 1230</p>
                                {chain && <Icon fill="#2E7DAF" size={14} svg={chain} />}
                            </div>
                        )}
                    </div>
                }>
                {nft.image ? (
                    <div style={{ position: "relative", height: "200px", width: "100%" }}>
                        <div
                            style={{
                                position: "absolute",
                                alignItems: "center",
                                display: "flex",
                                justifyContent: "center",
                                margin: 0,
                                top: "10px",
                                right: "10px",
                            }}>
                            <Button
                                icon="helpCircle"
                                iconLayout="icon-only"
                                id="test-button-outline-icon-only"
                                onClick={() => setOpenModal(true)}
                                text="Outline icon only"
                                size="small"
                                theme="text"
                                type="button"
                            />
                        </div>
                        <img src={nft.image} height="200px" alt="nft" width="100%" />
                    </div>
                ) : (
                    <Skeleton theme="image" />
                )}
            </Card>
            <DetailModal open={openModal} setOpen={setOpenModal} nft={nft} chain={chain} />
        </div>
    );
}

export default NFTCard;
