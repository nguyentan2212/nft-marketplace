import React from "react";
import { useMoralis } from "react-moralis";
import { useLocation, Navigate } from "react-router-dom";
import { Loading } from "web3uikit";
import useApp from "../hooks/useApp";

function AdminRoute({ children }) {
    const { account } = useMoralis();
    const location = useLocation();
    const { AdminAddress, hasMarketplace } = useApp();

    if (!account) {
        return (
            <div style={{ marginTop: "150px" }}>
                <Loading size={50} />
            </div>
        );
    }

    if (account?.toLowerCase() === AdminAddress?.toLowerCase() || !hasMarketplace) {
        return children;
    }

    return <Navigate to="/NFTMarketPlace" state={{ from: location }} />;
}

export default AdminRoute;
