import React from "react";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import App from "./App";
import "antd/dist/antd.css";
import "./index.css";

const APP_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;

const Application = () => {
    const isServerInfo = !!(APP_ID && SERVER_URL);
    if (isServerInfo)
        return (
            <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL} initializeOnMount={true}>
                <App />
            </MoralisProvider>
        );
    else {
        return (
            <div style={{ display: "flex", justifyContent: "center" }}>
                Rename .env.example to .env and inject server url and app id
            </div>
        );
    }
};

ReactDOM.render(
    <React.StrictMode>
        <Application />
    </React.StrictMode>,
    document.getElementById("root")
);
