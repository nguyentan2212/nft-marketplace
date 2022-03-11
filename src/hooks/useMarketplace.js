import { useState, useEffect } from "react";
import { useMoralis, useNewMoralisObject } from "react-moralis";

const Contract = require("@truffle/contract");
const MarketplaceAbi = require("../contracts/abi/Marketplace.json");
const TokenAbi = require("../contracts/abi/ERC20.json");

function useMarketplace() {
    const { provider, Moralis, account } = useMoralis();
    const { save } = useNewMoralisObject("Marketplace");
    const [marketplace, setMarketplace] = useState(null);
    const [marketplaceAddress, setMarketplaceAddress] = useState(null);
    const [isListing, setIsListing] = useState(false);
    const zeroAddress = "0x0000000000000000000000000000000000000000";

    useEffect(() => {
        const init = async () => {
            if (provider) {
                const contract = Contract(MarketplaceAbi);
                contract.setProvider(provider);
                const instance = await contract.deployed();
                setMarketplace(instance);
                setMarketplaceAddress(instance.address);
            }
        };
        init();
    }, [provider]);

    const listNFT = async (tokenAddress, tokenId, currency, price) => {
        setIsListing(true);

        // convert price units
        let finalPrice = 0;
        if (currency == zeroAddress) {
            finalPrice = Moralis.Units.ETH(price);
        } else {
            console.log("token");
            const tokenContract = Contract(TokenAbi);
            tokenContract.setProvider(provider);
            const token = await tokenContract.at(currency);
            const decimals = await token.decimals();
            finalPrice = Moralis.Units.Token(price, decimals);
        }
        // set timestamp
        const start = 0;
        const end = new Date(3000, 1, 1).getTime() / 1000;

        const result = await marketplace.listNft(tokenAddress, tokenId, currency, finalPrice, start, end, {
            from: account,
        });
        await save({
            tokenAddress,
            tokenId,
            currency,
            price: finalPrice,
            saleStart: start,
            saleEnd: end,
            transaction: result.tx,
        });
        setIsListing(false);
    };
    return { marketplace, marketplaceAddress, listNFT, zeroAddress, isListing };
}

export default useMarketplace;
