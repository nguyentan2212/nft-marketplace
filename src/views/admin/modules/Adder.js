import React, { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import Web3 from "web3";
import { Breadcrumbs } from "web3uikit";
import { Row, Col } from "antd";
import { Outlet, useLocation } from "react-router-dom";

function Adder() {
    const [web3, setWeb3] = useState();
    const [deployConfirmed, setDeployConfirmed] = useState(false);
    const { provider } = useMoralis();
    const { pathname } = useLocation();
    const [route, setRoute] = useState();

    useEffect(() => {
        if (provider) {
            let web = new Web3(provider);
            setWeb3(web);
        }
    }, [provider]);

    useEffect(() => {
        if (deployConfirmed) {
            setTimeout(() => {
                setDeployConfirmed(false);
            }, 5000);
        }
    }, [deployConfirmed]);

    useEffect(() => {
        console.log(pathname);
    }, [pathname]);

    const renderBreadCrumbs = (route) => (
        <Breadcrumbs
            routes={[
                {
                    breadcrumb: "Admin Panel",
                    path: "/admin",
                },
                {
                    breadcrumb: "Add Module",
                    path: "/admin/addModule",
                },
                { ...route },
            ]}
            currentLocation={pathname}
            style={{ marginBottom: "24px" }}
        />
    );

    return (
        <div style={{ width: "100%", maxWidth: "900px" }}>
            <Row>
                {pathname === "/admin/addModule/erc721module" && (
                    <Col span={24}>
                        {renderBreadCrumbs({
                            breadcrumb: "NFT Collection",
                            path: "/admin/addModule/erc721module",
                        })}{" "}
                    </Col>
                )}
                {pathname === "/admin/addModule" && <Col span={24}>{renderBreadCrumbs()}</Col>}
            </Row>
            <Row>
                <Col span={24}>
                    <Outlet />
                </Col>
            </Row>
        </div>
    );
}

export default Adder;
