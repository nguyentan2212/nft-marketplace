import React, { useState, useEffect } from "react";
import { useChain, useMoralis } from "react-moralis";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Web3 from "web3";
import "./style.css";
import useApp from "./hooks/useApp";
import { Admin, Marketplace, NFTBalance, UserDashboard } from "./views";
import { Adder, Dashboard, ModuleSelector, NFTCollection, CollectionList } from "./views/admin";
import MarketplaceRoute from "./components/MarketplaceRoute";
import AppLayout from "./AppLayout";

const App = () => {
    const { account, provider } = useMoralis();
    const { chainId } = useChain();
    const { marketplaceAddress, hasMarketplace, AdminAddress } = useApp();
    const [web3, setWeb3] = useState();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // return account && isAuthenticated && AdminAddress && AdminAddress.toUpperCase() === account.toUpperCase();
        setIsAdmin(true);
    }, []);

    useEffect(() => {
        if (provider) {
            let web = new Web3(provider);
            setWeb3(web);
        }
    }, [provider]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<AppLayout isAdmin={isAdmin} />}>
                    <Route path="admin" element={<Admin />}>
                        <Route index element={<Dashboard />} />
                        <Route path="addModule" element={<Adder />}>
                            <Route index element={<ModuleSelector />} />
                            <Route path="erc721module" element={<NFTCollection />} />
                        </Route>
                        <Route path="nft-collection/:address" element={<CollectionList />} />
                    </Route>
                    {hasMarketplace && (
                        <Route
                            path="NFTBalance"
                            element={
                                <NFTBalance
                                    web3={web3}
                                    address={account}
                                    chain={chainId}
                                    admin={AdminAddress}
                                    marketplaceAddress={marketplaceAddress}
                                />
                            }
                        />
                    )}
                    {hasMarketplace && (
                        <Route
                            path="user"
                            element={
                                <UserDashboard
                                    address={account}
                                    admin={AdminAddress}
                                    marketplace={marketplaceAddress}
                                />
                            }
                        />
                    )}
                    <Route
                        index={!isAdmin}
                        path="NFTMarketPlace"
                        element={
                            <MarketplaceRoute web3={web3}>
                                <Marketplace />
                            </MarketplaceRoute>
                        }
                    />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
