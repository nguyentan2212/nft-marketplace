import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMoralisWeb3Api, useMoralis } from "react-moralis";
import {
    Row,
    Typography,
    Skeleton,
    LinkTo,
    getEllipsisTxt,
    getChainHex,
    getExplorer,
    Button,
} from "web3uikit";
import NFTCard from "../components/NFTCard";
var console = require("console-browserify");

const { Col } = Row;

function Collection() {
    const { token } = useMoralisWeb3Api();
    const { Moralis } = useMoralis();
    const params = useParams();
    const [collection, setCollection] = useState({});
    const [items, setItems] = useState([]);
    const [res, setRes] = useState({});

    useEffect(() => {
        const fetchNFTMetadata = async () => {
            const options = {
                address: params.address,
                chain: params.chain,
            };
            const metaData = await token.getNFTMetadata(options);
            setCollection({
                ...collection,
                address: metaData.token_address,
                name: metaData.name,
                symbol: metaData.symbol,
                standard: metaData.contract_type,
            });
        };
        fetchNFTMetadata();
    }, []);

    useEffect(() => {
        const fetchAllTokenIds = async () => {
            const options = {
                address: params.address,
                chain: "eth",
                limit: 12,
            };
            const result = await Moralis.Web3API.token.getAllTokenIds(options);
            setRes({ ...result });
            setItems([...result.result]);
        };
        fetchAllTokenIds();
    }, []);

    const loadMore = async () => {
        const result = await res.next();
        setRes({ ...result });
        setItems([...items, ...result.result]);
    };
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "12px",
            }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "flex-end",
                    gap: "10px",
                }}>
                {collection.name ? (
                    <Typography variant="h2">{collection.name}</Typography>
                ) : (
                    <Skeleton theme="text" />
                )}
                {collection.symbol ? (
                    <Typography variant="body16">{collection.symbol}</Typography>
                ) : (
                    <Skeleton theme="text" />
                )}
                {collection.address ? (
                    <LinkTo
                        type="external"
                        text={getEllipsisTxt(collection.address, 10)}
                        address={`${getExplorer(getChainHex(params.chain))}address/${collection.address}`}
                    />
                ) : (
                    <Skeleton theme="text" />
                )}
            </div>

            <Row lg={24} md={24} sm={12} xs={8} alignItems="start">
                {items &&
                    items.map((item, idx) => (
                        <Col
                            key={idx}
                            breakpointsConfig={{
                                lg: 6,
                                md: 6,
                                sm: 4,
                                xs: 4,
                            }}
                            span={6}>
                            <NFTCard
                                chain={params.chain}
                                address={item.address}
                                tokenId={item.id}
                                tokenData={item}
                                isFetchData={false}
                            />
                        </Col>
                    ))}
            </Row>
            <div style={{ marginLeft: "auto", marginRight: "auto", marginTop: "24px" }}>
                <Button text="Load more" theme="primary" size="large" onClick={() => loadMore()} />
            </div>
        </div>
    );
}

export default Collection;
