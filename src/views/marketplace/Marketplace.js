import React, { useState } from "react";
import { Button, iconTypes, Illustration, LinkTo, Table } from "web3uikit";
import useMarketplace from "../../hooks/useMarketplace";
import { Image } from "antd";
import Flex from "../../uikit/Flex";

function Marketplace({ ownListings }) {
    const { marketplaceAddress } = useMarketplace();
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);

    return (
        <Flex maxWidth="900px" width="100%">
            <p style={{ fontSize: "24px", fontWeight: "600", alignItems: "start" }}>
                {ownListings ? "Your Listings" : "Explore Market"}
            </p>
            <p style={{ marginBottom: "30px" }}>{`${
                loading ? "loading ..." : `${tableData.length} item${tableData.length > 1 ? "s" : ""} listed`
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
                    loading ? (
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
