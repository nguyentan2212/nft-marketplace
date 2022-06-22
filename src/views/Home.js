import React from "react";
import { Row } from "web3uikit";
import NFTCard from "../components/NFTCard";

const { Col } = Row;

function Home() {
    const chain = process.env.REACT_APP_CHAIN;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Row lg={24} md={24} sm={12} xs={8}>
                <Col
                    breakpointsConfig={{
                        lg: 6,
                        md: 6,
                        sm: 4,
                        xs: 4,
                    }}
                    span={6}>
                    <NFTCard
                        chain={chain}
                        address="0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"
                        tokenId="3368"
                    />
                </Col>
                <Col
                    breakpointsConfig={{
                        lg: 6,
                        md: 6,
                        sm: 4,
                        xs: 4,
                    }}
                    span={6}>
                    <NFTCard
                        chain={chain}
                        address="0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"
                        tokenId="3369"
                    />
                </Col>
                <Col
                    breakpointsConfig={{
                        lg: 6,
                        md: 6,
                        sm: 4,
                        xs: 4,
                    }}
                    span={6}>
                    <NFTCard
                        chain={chain}
                        address="0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"
                        tokenId="3370"
                    />
                </Col>
                <Col
                    breakpointsConfig={{
                        lg: 6,
                        md: 6,
                        sm: 4,
                        xs: 4,
                    }}
                    span={6}>
                    <NFTCard
                        chain={chain}
                        address="0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"
                        tokenId="3371"
                    />
                </Col>
            </Row>
        </div>
    );
}

export default Home;
