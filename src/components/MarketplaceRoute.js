import React from "react";
import { useMoralis } from "react-moralis";
import { Navigate, useLocation } from "react-router-dom";
import useApp from "../hooks/useApp";

function MarketplaceRoute({ web3, children }) {
    const location = useLocation();
    const { provider, isAuthenticated } = useMoralis();
    const { marketplaceAddress, hasMarketplace, canSetProject, isFetching } = useApp();

    return (
        <>
            {!hasMarketplace && !canSetProject && web3 && isAuthenticated && (
                <div>
                    <p style={{ fontWeight: 600 }}>Marketplace coming soon ...</p>
                    <p style={{ fontWeight: 200 }}> If you are the owner switch your account in metamask</p>
                </div>
            )}
            {!isAuthenticated && !web3 && !provider && (
                <div>
                    <p style={{ fontWeight: 600 }}>This App needs web3 connectivity</p>
                    <p style={{ fontWeight: 200 }}>Connect your wallet</p>
                </div>
            )}
            {canSetProject && !isFetching && isAuthenticated && web3 && (
                <Navigate to="/admin" state={{ from: location }} />
            )}
            {hasMarketplace && marketplaceAddress && web3 && children}

        </>
    );
}

export default MarketplaceRoute;
