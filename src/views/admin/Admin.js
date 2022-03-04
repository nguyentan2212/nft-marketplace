import React from "react";
import { useLocation, Outlet, Navigate } from "react-router-dom";
import { useMoralis } from "react-moralis";
import { Loading } from "web3uikit";
import useApp from "../../hooks/useApp";

function Admin() {
    const location = useLocation();

    const { account } = useMoralis();
    const { AdminAddress, hasMarketplace } = useApp();

    if (!account) {
        return (
            <div style={{ marginTop: "150px" }}>
                <Loading size={50} />
            </div>
        );
    }

    if (account?.toLowerCase() === AdminAddress?.toLowerCase() || !hasMarketplace) {
        return <Outlet />;
    }

    return <Navigate to="/NFTMarketPlace" state={{ from: location }} />;
}

export default Admin;