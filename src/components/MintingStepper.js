import React, { useState, useEffect } from "react";
import { Stepper, Typography } from "web3uikit";
import AddInfoStep from "./AddInfoStep";
import ChooseNftTypeStep from "./ChooseNftTypeStep";
import UploadContentStep from "./UploadContentStep";

function MintingStepper() {
    const [step, setStep] = useState(1);
    const [nftType, setNftType] = useState("Collection");
    const [content, setContent] = useState(null);

    return (
        <Stepper
            hasNavButtons={true}
            step={step}
            completeTitle={<Typography variant="subtitle1">Minting Time!</Typography>}
            completeMessage={<Typography variant="body16">{`Everything is ready, press the "Done" button to minting`}</Typography>}
            stepData={[
                {
                    content: <ChooseNftTypeStep nftType={nftType} setNftType={setNftType} />,
                    title: "Choose NFT Type",
                },
                {
                    content: <UploadContentStep content={content} setContent={setContent} />,
                    title: "Upload Content",
                },
                {
                    content: <AddInfoStep nftType={nftType} />,
                    title: "Add More Info",
                },
            ]}
        />
    );
}

export default MintingStepper;
