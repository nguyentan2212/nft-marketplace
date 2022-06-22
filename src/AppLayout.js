import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useMoralis } from "react-moralis";
import { ConnectButton, Button } from "web3uikit";

function AppLayout() {
    const { isAuthenticated } = useMoralis();
    const navigate = useNavigate();
    return (
        <div
            style={{
                maxWidth: "1200px",
                display: "flex",
                flexDirection: "column",
                padding: "24px",
                marginLeft: "auto",
                marginRight: "auto",
            }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: "36px", marginBottom: "24px" }}>
                    <Button
                        onClick={() => navigate("/")}
                        text="Home"
                        theme="text"
                        type="button"
                        size="large"
                    />
                    {isAuthenticated && (
                        <Button
                            onClick={() => navigate("/create")}
                            text="Create"
                            theme="text"
                            type="button"
                            size="large"
                        />
                    )}
                    {isAuthenticated && (
                        <Button
                            onClick={() => navigate("/balance")}
                            text="Balance"
                            theme="text"
                            type="button"
                            size="large"
                        />
                    )}
                </div>
                <div style={{ display: "flex" }}>
                    <ConnectButton />
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default AppLayout;
