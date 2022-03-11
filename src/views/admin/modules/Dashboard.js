import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Button, iconTypes, TabList } from "web3uikit";
import Flex from "../../../uikit/Flex";
import Typography from "../../../uikit/Typography";
import Overview from "./Overview";

const { Tab } = TabList;
const HeaderStyled = styled.div`
    margin-bottom: 25px;
    position: relative;
`;

function Dashboard() {
    const navigate = useNavigate();

    return (
        <Flex maxWidth="900px" width="100%">
            <HeaderStyled>
                <Typography variant="h1">Admin</Typography>
                <Typography variant="span">Create, manage, explore</Typography>
            </HeaderStyled>
            <div style={{ position: "absolute", right: 0 }}>
                <Button
                    onClick={() => navigate("/admin/addModule")}
                    text={"Add Module"}
                    theme={"primary"}
                    icon={iconTypes.plus}
                    iconLayout={"leading"}
                />
            </div>
            <TabList defaultActiveKey={2} tabStyle={"bulbSeperate"}>
                <Tab tabKey={2} tabName={"Overview"}>
                    <Overview />
                </Tab>
                <Tab tabKey={4} tabName={"Panel"}>
                    <div>ERC-20 Tab Content</div>
                </Tab>
                <Tab tabKey={3} tabName={"Own Listing"} isDisabled={true}>
                    <div>Permissions comming soon ...</div>
                </Tab>
            </TabList>
        </Flex>
    );
}

export default Dashboard;
