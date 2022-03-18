import { useState, useEffect } from "react";
import { useMoralis, useNewMoralisObject } from "react-moralis";
import Web3 from "web3";

const Contract = require("@truffle/contract");
const MarketplaceAbi = require("../contracts/abi/Marketplace.json");
const TokenAbi = require("../contracts/abi/ERC20.json");

function useMarketplace() {
    const { provider, Moralis, account } = useMoralis();
    const { save } = useNewMoralisObject("Marketplace");
    const [marketplace, setMarketplace] = useState(null);
    const [web3, setWeb3] = useState(false);
    const [marketplaceAddress, setMarketplaceAddress] = useState(null);
    const [isListing, setIsListing] = useState(false);
    const [loadingListings, setLoadingListings] = useState(false);
    const zeroAddress = "0x0000000000000000000000000000000000000000";

    useEffect(() => {
        const init = async () => {
            if (provider) {
                const contract = Contract(MarketplaceAbi);
                contract.setProvider(provider);
                const instance = await contract.deployed();
                setMarketplace(instance);
                setMarketplaceAddress(instance.address);
                const tempWeb3 = new Web3(provider);
                setWeb3(tempWeb3);
            }
        };
        init();
    }, [provider]);

    const listNFT = async (tokenAddress, tokenId, currency, price) => {
        setIsListing(true);

        // convert price units
        let finalPrice = 0;
        if (currency === zeroAddress) {
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
        const { logs } = result;
        const { args } = logs[0];

        await save({
            listingIndex: args.itemIndex,
            tokenAddress,
            tokenId,
            seller: account,
            currency,
            price: finalPrice,
            saleStart: start,
            saleEnd: end,
            transaction: result.tx,
            status: "listing",
            isOnMarketplace: true
        });
        setIsListing(false);
    };

    const listingIndex = async (tokenAddress, tokenId) => {
        if (web3 && marketplace) {
            const hash = await web3.utils.soliditySha3(tokenAddress, tokenId);
            const index = await marketplace.listings(hash);
            return index;
        }
        return 0;
    };

    const unlisting = async (item) => {
        if (marketplace) {
            const result = await marketplace.unlistNft(item.get("listingIndex"), { from: account });

            item.set("isOnMarketplace", false);
            await item.save();

            await save({
                listingIndex: item.get("listingIndex"),
                tokenAddress: item.get("tokenAddress"),
                tokenId: item.get("tokenId"),
                seller: item.get("seller"),
                currency: item.get("currency"),
                price: item.get("price"),
                saleStart: item.get("saleStart"),
                saleEnd: item.get("saleEnd"),
                transaction: result.tx,
                status: "unlisted",
                isOnMarketplace: false
            });
        }
    };

    const allListings = async () => {
        if (marketplace) {
            const result = await marketplace.getAllItems();
            return result;
        }
        return null;
    };

    const allListingByUser = async () => {};
    return {
        marketplace,
        marketplaceAddress,
        listNFT,
        zeroAddress,
        isListing,
        allListings,
        unlisting,
        listingIndex,
        loadingListings,
        setLoadingListings,
    };
}

export default useMarketplace;
