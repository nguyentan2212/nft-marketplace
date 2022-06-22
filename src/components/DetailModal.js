import React from "react";
import {
    Modal,
    Icon,
    Typography,
    LinkTo,
    Information,
    getEllipsisTxt,
    getExplorer,
    getChainHex,
    Row,
} from "web3uikit";

const { Col } = Row;

function DetailModal({ open, setOpen, nft, chain }) {
    return (
        <div>
            <Modal
                hasFooter={false}
                headerHasBottomBorder
                isVisible={open}
                onCloseButtonPressed={() => setOpen(!open)}
                width="600px"
                title={
                    <div style={{ display: "flex", gap: 8 }}>
                        <Icon fill="#68738D" size={28} svg="book" />
                        <Typography color="#68738D" variant="h2">
                            Details
                        </Typography>
                    </div>
                }>
                <div
                    style={{
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                    }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                        }}>
                        <Typography variant="subtitle2">Collection</Typography>
                        <LinkTo
                            type="external"
                            text={nft.collectionName}
                            address={`/collection/${chain}/${nft.address}`}
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                        }}>
                        <Typography variant="subtitle2">Contract Address</Typography>
                        <LinkTo
                            type="external"
                            text={getEllipsisTxt(nft.address, 10)}
                            address={`${getExplorer(getChainHex(chain))}address/${nft.address}`}
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                        }}>
                        <Typography variant="subtitle2">Token Id</Typography>
                        <Typography variant="body16" copyable>
                            {nft.id}
                        </Typography>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                        }}>
                        <Typography variant="subtitle2">Symbol</Typography>
                        <Typography variant="body16">{nft.symbol}</Typography>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                        }}>
                        <Typography variant="subtitle2">Token Standard</Typography>
                        <Typography variant="body16">{nft.standard}</Typography>
                    </div>
                    {nft.description && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "stretch",
                                marginBottom: "10px",
                                gap: "6px",
                            }}>
                            <Typography variant="subtitle2">Description</Typography>
                            <Typography variant="body16">{nft.description}</Typography>
                        </div>
                    )}
                    {nft.attributes && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "stretch",
                                marginBottom: "10px",
                                gap: "6px",
                            }}>
                            <Typography variant="subtitle2">Attributes</Typography>
                            <Row justifyContent="flex-start" alignItems="stretch" colGap={6}>
                                {nft.attributes.map((att, idx) => (
                                    <Col span={12} key={idx}>
                                        <Information information={att.value} topic={att.trait_type} />
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}

export default DetailModal;
