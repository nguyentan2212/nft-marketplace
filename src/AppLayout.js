import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import HeaderMenu from "./components/HeaderMenu";
const { Footer } = Layout;

const styles = {
    content: {
        display: "flex",
        justifyContent: "center",
        fontFamily: "Roboto, sans-serif",
        color: "#041836",
        marginTop: "130px",
        padding: "10px",
    },
};

function AppLayout({ isAdmin }) {
    return (
        <Layout style={{ height: "100vh", overflow: "auto" }}>
            <HeaderMenu isAdmin={isAdmin} />
            <div style={styles.content}>
                <Outlet />
            </div>
            <Footer style={{ display: "grid", placeItems: "center" }}>Powered By Moralis</Footer>
        </Layout>
    );
}

export default AppLayout;
