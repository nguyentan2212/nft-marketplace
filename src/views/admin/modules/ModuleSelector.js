import React from "react";
import { Card, Illustration, Tooltip } from "web3uikit";
import { useNavigate, useLocation } from "react-router-dom";
import { Row, Col } from "antd";
import Typography from "../../../uikit/Typography";
import { collectionModule, bundleModule, dropModule } from "./moduleTypes";

function ModuleSelector() {
    const nftModules = [collectionModule, bundleModule, dropModule];
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const isComingSoon = (module) => {
        return module === "bundleModule" || module === "lazyMintModule" || module === "packModule";
    };

    const pushToHistory = (target) => {
        navigate(`${pathname}/${target}`);
    };

    const printCard = (module) => {
        return (
            <Card
                title={module.title}
                tooltipText={module.desc}
                children={[
                    <div
                        key={module.title}
                        style={{
                            display: "grid",
                            placeItems: "center",
                        }}>
                        <Illustration width="130px" height="200px" logo={module.logo} />
                    </div>,
                ]}
                // @ts-ignore
                isDisabled={isComingSoon(module.key)}
                key={module.key}
            />
        );
    };

    return (
        <>
            <Typography variant="h4" style={{ marginBottom: 10 }}>
                NFT Modules
            </Typography>
            <Row justify="space-between">
                {nftModules.map((module) => {
                    return (
                        <Col
                            span={7}
                            key={module.title}
                            onClick={() => {
                                if (isComingSoon(module.key)) return;
                                pushToHistory(module.key);
                            }}
                            style={{ cursor: isComingSoon(module.key) ? "not-allowed" : "pointer" }}>
                            {!isComingSoon(module.key) ? (
                                printCard(module)
                            ) : (
                                <Tooltip
                                    position={"bottom"}
                                    text={"Coming Soon 👀"}
                                    children={printCard(module)}
                                />
                            )}
                        </Col>
                    );
                })}
            </Row>
        </>
    );
}

export default ModuleSelector;
