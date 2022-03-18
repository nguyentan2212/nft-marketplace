import React, { useState, useEffect } from "react";
import { Button, iconTypes, Illustration, LinkTo, Table } from "web3uikit";
import { useMoralisQuery, useMoralisWeb3Api, useMoralis } from "react-moralis";
import useMarketplace from "../../hooks/useMarketplace";
import { Image } from "antd";
import Flex from "../../uikit/Flex";
import { getEllipsisTxt } from "../../helpers/formatters";
import { getExplorer } from "../../helpers/networks";

function Marketplace({ ownListings }) {
    const [tableData, setTableData] = useState([]);
    const [reload, setReload] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);
    const { data, error, isLoading } = useMoralisQuery("Marketplace", (query) =>
        query.contains("status", "listing").equalTo("isOnMarketplace", true).descending("listingIndex")
    );

    const { token } = useMoralisWeb3Api();
    const { chainId, Moralis, account } = useMoralis();
    const { zeroAddress, unlisting } = useMarketplace();

    const unlist = async (address, id) => {
        await unlisting(address, id);
        setReload((prevState) => !prevState);
    };

    useEffect(() => {
        const init = async () => {
            setTableData([]);

            if (data && data.length > 0 && !isLoading) {
                setDataLoading(true);
                data.forEach((nft, index) => {
                    onForEach(data, nft, index);
                });
            }
        };
        init();
    }, [data, isLoading, reload]);

    const onForEach = (nftList, nft, index) => {
        console.log(nft);
        token
            .getTokenIdMetadata({
                chain: chainId,
                address: nft.get("tokenAddress"),
                token_id: nft.get("tokenId"),
            })
            .then(async (metadataResult) => {
                console.log(metadataResult);
                const metadata = JSON.parse(metadataResult.metadata);
                var tokenResult;
                if (nft.get("currency") === zeroAddress) {
                    tokenResult = [
                        {
                            decimals: 18,
                            symbol: "ETH",
                        },
                    ];
                } else {
                    tokenResult = await token.getTokenMetadata({
                        addresses: nft.get("currency"),
                        chain: chainId,
                    });
                }
                console.log(tokenResult);
                const row = [
                    <div
                        style={{
                            display: "grid",
                            alignItems: "center",
                            width: "100%",
                            height: "100%",
                        }}>
                        <span style={{ color: "#041836", fontSize: "16px" }}>{nft.get("tokenId")}</span>
                    </div>,
                    <div
                        style={{
                            display: "grid",
                            alignItems: "center",
                            width: "100%",
                            height: "100%",
                            borderRadius: "15px",
                            marginTop: "-5px",
                        }}>
                        <Image
                            src={metadata.image ? metadata.image : "https://i.ibb.co/FzDBLqk/Image.png"}
                            width={80}
                            height={80}
                            alt={""}
                        />
                    </div>,
                    <div
                        style={{
                            display: "grid",
                            alignItems: "center",
                            width: "100%",
                            height: "100%",
                        }}>
                        <span style={{ color: "#041836", fontSize: "16px" }}>
                            <LinkTo
                                text={
                                    metadataResult.name
                                        ? `${metadataResult.name}  #${metadataResult.token_id}`
                                        : ""
                                }
                                address={`${getExplorer(chainId)}address/${nft.get("tokenAddress")}`}
                                type="external"
                            />
                        </span>
                    </div>,
                    <div
                        style={{
                            display: "grid",
                            alignItems: "center",
                            width: "100%",
                            height: "100%",
                        }}>
                        <LinkTo
                            text={getEllipsisTxt(nft.get("seller"), 4)}
                            address={`${getExplorer(chainId)}address/${nft.get("seller")}`}
                            type="external"
                        />
                    </div>,
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            width: "100%",
                            height: "100%",
                        }}>
                        <Image
                            width={25}
                            height={25}
                            src={
                                tokenResult[0].logo ||
                                "https://ropsten.etherscan.io/images/main/empty-token.png"
                            }
                            alt={""}
                        />
                        <span
                            style={{
                                color: "#041836",
                                textAlign: "center",
                                fontSize: "16px",
                            }}>{`${Moralis.Units.FromWei(
                            nft.get("currency"),
                            Number(tokenResult[0].decimals)
                        )} ${tokenResult[0].symbol}`}</span>
                    </div>,
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            height: "100%",
                        }}>
                        <Button isFullWidth text={"Buy"} theme={"outline"} onClick={() => {}} />
                        {account.toLowerCase() === nft.get("seller").toLowerCase() && (
                            <Button
                                icon={iconTypes.bin}
                                iconLayout={"icon-only"}
                                theme={"outline"}
                                onClick={() => unlist(nft)}
                            />
                        )}
                    </div>,
                ];
                setTableData((prevState) => (prevState.length === 0 ? [row] : [...prevState, row]));
                if (index === nftList.length - 1) {
                    setDataLoading(false);
                }
            })
            .catch((e) => {
                console.log(e);
                return;
            });
    };

    return (
        <Flex maxWidth="900px" width="100%">
            <p style={{ fontSize: "24px", fontWeight: "600", alignItems: "start" }}>
                {ownListings ? "Your Listings" : "Explore Market"}
            </p>
            <p style={{ marginBottom: "30px" }}>{`${
                dataLoading
                    ? "loading ..."
                    : `${tableData.length} item${tableData.length > 1 ? "s" : ""} listed`
            }`}</p>
            <Table
                columnsConfig="50px 80px 2fr 0.75fr 1fr 1fr"
                data={tableData}
                header={[
                    <div style={{ ...columnNameStyle, marginLeft: "20px" }}>
                        <span>#</span>
                    </div>,
                    <div style={columnNameStyle}>
                        <span>Image</span>
                    </div>,
                    <div style={columnNameStyle}>
                        <span>Name</span>
                    </div>,
                    <div style={columnNameStyle}>
                        <span>Seller</span>
                    </div>,
                    <div style={columnNameStyle}>
                        <span>Price</span>
                    </div>,
                    <div style={columnNameStyle}>
                        <span>Actions</span>
                    </div>,
                ]}
                maxPages={3}
                onPageNumberChanged={function noRefCheck() {}}
                pageSize={5}
                customNoDataComponent={
                    dataLoading ? (
                        <div>
                            <Illustration logo={"servers"} />
                            <p>Loading ...</p>
                        </div>
                    ) : (
                        <div>
                            <Illustration logo={"lazyNft"} />
                            <p>No NFTs listed</p>
                        </div>
                    )
                }
            />
        </Flex>
    );
}

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

export default Marketplace;
