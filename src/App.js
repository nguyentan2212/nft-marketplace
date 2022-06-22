import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import Home from "./views/Home";
import Create from "./views/Create";
import Balance from "./views/Balance";
import Collection from "./views/Collection";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<Home />} />
                    <Route path="create" element={<Create />} />
                    <Route path="balance" element={<Balance />} />
                    <Route path="collection/:chain/:address" element={<Collection />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
