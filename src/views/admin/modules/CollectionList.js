import React, { useEffect, useState } from "react";
import { useChain, useMoralisWeb3Api } from "react-moralis";
import { Image } from "antd";
import { Table, Button, Illustration, Breadcrumbs, iconTypes } from "web3uikit";
import { useParams } from "react-router-dom";
import NFTMinter from "./NFTMinter";
import NFTLister from "./NFTLister";
import HeaderStyled from "../../../uikit/HeaderStyled";
import Flex from "../../../uikit/Flex";

const columnNameStyle = {
    color: "#68738D",
    fontWeight: "500",
    fontSize: "14px",
    display: "grid",
    placeItems: "flex-start",
    width: "100%",
    marginTop: "5px",
    marginBottom: "-5px",
};

function CollectionList() {
    const { chainId } = useChain();
    const { token } = useMoralisWeb3Api();
    const { address } = useParams();
    const [showMinter, setShowMinter] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [NFTs, setNFTs] = useState([]);
    const [nftToList, setNftToList] = useState();
    const [showLister, setShowLister] = useState(false);

    useEffect(() => {
        const fetchAllTokenId = async () => {
            let temp = await token.getAllTokenIds({
                address,
                chain: chainId,
            });
            console.log(temp);
            setNFTs(temp);
        };
        fetchAllTokenId();
    }, [address, chainId, token]);

    useEffect(() => {
        if (NFTs && NFTs.result && NFTs.result.length > 0) {
            setIsEmpty(false);
            const temp = [];
            NFTs.result.forEach((result, index) => {
                
                const metadata = JSON.parse(result.metadata);
                console.log(result);
                temp.push([
                    <span>{result.token_id}</span>,
                    // @ts-ignore
                    <Image
                        height={80}
                        width={80}
                        style={{ borderRadius: "15px" }}
                        src={
                            metadata && metadata.image ? metadata.image : "https://i.ibb.co/FzDBLqk/Image.png"
                        }
                    />,
                    <div>
                        <p>{metadata && metadata.name ? metadata.name : result.name}</p>
                        <span
                            style={{
                                fontSize: "small",
                                color: "gray",
                                display: "inline-block",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "50ch",
                            }}>
                            {metadata && metadata.description ? metadata.description : "No Description"}
                        </span>
                    </div>,
                    <div style={{ display: "flex", width: "100%", gap: "15px" }}>
                        <Button
                            theme={"outline"}
                            isFullWidth
                            onClick={() => {
                                setNftToList({
                                    token_address: result.token_address,
                                    token_id: result.token_id,
                                    metadata: metadata,
                                    name: result.name,
                                    type: result.contract_type,
                                });
                                setShowLister(true);
                            }}
                            text={"List"}
                        />
                    </div>,
                ]);
                if (index === NFTs.result.length - 1) {
                    setTableData(temp);
                }
            });
        }
        if (NFTs && NFTs.result && NFTs.result.length === 0) {
            setIsEmpty(true);
        }
    }, [NFTs]);

    return (
        <Flex maxWidth="900px" width="100%">
            <HeaderStyled>
                <Breadcrumbs
                    routes={[
                        {
                            breadcrumb: "Admin Panel",
                            path: "/admin",
                        },
                        {
                            breadcrumb: "Manage NFT Collection",
                            path: "current",
                        },
                    ]}
                    currentLocation="current"
                    style={{ marginBottom: "24px" }}
                    separator={"/"}
                />

                <div style={{ position: "absolute", right: 0, top: 0 }}>
                    <Button
                        theme={"primary"}
                        text={"Mint NFT"}
                        icon={iconTypes.plus}
                        iconLayout={"leading"}
                        onClick={() => setShowMinter(true)}
                    />
                </div>
            </HeaderStyled>
            {!showMinter && (
                <Table
                    columnsConfig="80px 90px 1fr 1fr"
                    data={tableData}
                    header={[
                        <div style={{ ...columnNameStyle, marginLeft: "15px" }}>
                            <span>#</span>
                        </div>,
                        <div style={columnNameStyle}>
                            <span>Logo</span>
                        </div>,
                        <div style={columnNameStyle}>
                            <span>Name</span>
                        </div>,
                        <div style={columnNameStyle}>
                            <span>Actions</span>
                        </div>,
                    ]}
                    maxPages={3}
                    onPageNumberChanged={function noRefCheck() {}}
                    pageSize={5}
                    customNoDataComponent={
                        <div
                            style={{
                                display: "grid",
                                placeItems: "center",
                                textAlign: "center",
                                gap: "25px",
                            }}>
                            <Illustration logo={"servers"} width={"150"} height={"150"} />
                            <span>{!isEmpty ? "Loading ..." : "Collection is empty"}</span>
                            {!isEmpty ? (
                                ""
                            ) : (
                                <Button
                                    theme={"primary"}
                                    text={"Mint First NFT"}
                                    icon={iconTypes.plus}
                                    iconLayout={"leading"}
                                    onClick={() => setShowMinter(true)}
                                />
                            )}
                        </div>
                    }
                />
            )}
            {showMinter && <NFTMinter address={address} />}
            {showLister && (
                <NFTLister modalActive={showLister} setModalActive={setShowLister} nft={nftToList} />
            )}
        </Flex>
    );
}

export default CollectionList;
