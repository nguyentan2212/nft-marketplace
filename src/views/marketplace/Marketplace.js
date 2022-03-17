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
    const { data, error, isLoading } = useMoralisQuery("Marketplace", (query) =>
        query.contains("status", "listing").descending("listingIndex")
    );
    const { token } = useMoralisWeb3Api();
    const { chainId, Moralis, account } = useMoralis();
    const { allListings, loadingListings, setLoadingListings, zeroAddress, unlisting } = useMarketplace();
    useEffect(() => {
        if (data) {
            console.log(data);
        }
        const fecth = async () => {
            setLoadingListings(true);
            const result = await allListings();
            console.log(result);

            if (result) {
                result.forEach((nft, index) => {
                    onForEach(result, nft, index);
                });
            }

            setLoadingListings(false);
        };
        fecth();
    }, [data]);

    const onForEach = (nftList, nft, index) => {
        if (nft[2] === zeroAddress) {
            return null;
        }
        token
            .getTokenIdMetadata({
                chain: chainId,
                address: nft[2],
                token_id: nft[3],
            })
            .then(async (metadataResult) => {
                console.log(metadataResult);
                var tokenResult;
                if (nft[4] === zeroAddress) {
                    tokenResult = [
                        {
                            decimals: 18,
                            symbol: "ETH",
                        },
                    ];
                } else {
                    tokenResult = await token.getTokenMetadata({
                        addresses: [nft[4]],
                        ["chain"]: chainId,
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
                        <span style={{ color: "#041836", fontSize: "16px" }}>{nft[3]}</span>
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
                        <Image src={metadataResult.image ? metadataResult.image : "https://i.ibb.co/FzDBLqk/Image.png"} width={80} height={80} alt={""} />
                    </div>,
                    <div
                        style={{
                            display: "grid",
                            alignItems: "center",
                            width: "100%",
                            height: "100%",
                        }}>
                        <span style={{ color: "#041836", fontSize: "16px" }}>
                            {metadataResult.name ? `${metadataResult.name}  #${metadataResult.token_id}` : ""}
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
                            text={getEllipsisTxt(nft[2], 4)}
                            address={`${getExplorer(chainId)}address/${nft[2]}`}
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
                            }}>{`${Moralis.Units.FromWei(nft[5], Number(tokenResult[0].decimals))} ${
                            tokenResult[0].symbol
                        }`}</span>
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
                        {account.toLowerCase() === nft[1].toLowerCase() && (
                            <Button
                                icon={iconTypes.bin}
                                iconLayout={"icon-only"}
                                theme={"outline"}
                                onClick={() => unlisting(nft[2], nft[3])}
                            />
                        )}
                    </div>,
                ];
                setTableData((prevState) => (prevState.length === 0 ? [row] : [...prevState, row]));
                if (index === nftList.length - 1) {
                    setLoadingListings(false);
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
                loadingListings
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
                    loadingListings ? (
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
