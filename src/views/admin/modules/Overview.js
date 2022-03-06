import React from "react";
import { useMoralisQuery, useMoralis } from "react-moralis";
import { Avatar, LinkTo, Table, Illustration, Button } from "web3uikit";
import { useNavigate } from "react-router-dom";
import { getEllipsisTxt } from "../../../helpers/formatters";
import { getExplorer } from "../../../helpers/networks";

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

const columns = [
    "",
    <div key={"col1"} style={columnNameStyle}>
        <span>Name</span>
    </div>,
    <div key={"col2"} style={columnNameStyle}>
        <span>Address</span>
    </div>,
];

function Overview() {
    const { data, isFetching } = useMoralisQuery("InstalledModules", (query) => query.limit(100), [], {
        live: true,
    });
    const { chainId } = useMoralis();
    const navigate = useNavigate();

    const manipulate = (data) => {
        if (!data) return;
        if (data.length === 0 && !isFetching) return [];
        return data.map((mod) => {
            let metadata = {
                name: "",
            };
            metadata.name = mod.get("name");

            return rowData(metadata, mod);
        });
    };
    const rowData = (metadata, mod) => [
    
            <Avatar isRounded={true} key={114} theme="letters" text={metadata.name} />,
            <span key={432} style={{ fontSize: "16px", color: "#041836" }}>
                {metadata.name}
            </span>,
            <LinkTo
                key={3}
                text={getEllipsisTxt(mod.get("module"), 4)}
                address={`${getExplorer(chainId)}address/${mod.get("module")}`}
                type={"external"}
            />,
            <div key={5} style={{ display: "grid", placeItems: "center" }}>
                <Button text="Manage" onClick={() => navigate(`nft-collection/${mod.get("module")}`)} />
            </div>,
        ""
    ];

    return (
        <>
            <Table
                columnsConfig="80px 3fr 2fr 2fr 80px"
                data={manipulate(data)}
                header={columns}
                maxPages={3}
                onPageNumberChanged={function noRefCheck() {}}
                pageSize={5}
                customNoDataComponent={
                    !isFetching ? (
                        <div
                            key={"21415rs"}
                            style={{
                                display: "grid",
                                placeItems: "center",
                                textAlign: "center",
                                gap: "25px",
                            }}>
                            <Illustration key={"21w415rs"} logo={"servers"} width={"150"} height={"150"} />
                            <span key={"2141sad5rs"}>No Modules Installed</span>
                        </div>
                    ) : (
                        <div key={"214153ya2rs"}>Loading Modules ...</div>
                    )
                }
            />
        </>
    );
}

export default Overview;
