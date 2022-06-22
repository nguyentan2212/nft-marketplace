import React, { useRef } from "react";
import { Card, Illustration } from "web3uikit";

function UploadContentStep({ content, setContent }) {
    const hiddenFileInput = useRef(null);

    const handleClick = (event) => {
        hiddenFileInput.current.click();
    };

    const handleChange = (event) => {
        setContent(event.target.files[0]);
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                marginTop: "24px",
                marginBottom: "24px",
            }}>
            <div
                style={{
                    width: "300px",
                }}>
                <Card
                    onClick={handleClick}
                    title="Upload image or video"
                    description="Upload file to preview your brand new NFT">
                    {content ? (
                        <img
                            src={URL.createObjectURL(content)}
                            style={{ borderRadius: "20px" }}
                            height="250px"
                            width="100%"
                            alt="nft"
                        />
                    ) : (
                        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
                            <Illustration logo="servers" height="250px" width="100%" />
                        </div>
                    )}
                </Card>
            </div>
            <input type="file" ref={hiddenFileInput} onChange={handleChange} style={{ display: "none" }} />
        </div>
    );
}

export default UploadContentStep;
