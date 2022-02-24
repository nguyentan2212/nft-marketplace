/*global artifacts, contract, before, assert*/

const Marketplace = artifacts.require("Marketplace");
const NFTControl = artifacts.require("NFTControl");
const NFT = artifacts.require("NFT721");
const ERC20 = artifacts.require("MyToken");

contract("Marketplace", (accounts) => {
    var marketplace;
    var control;
    var nft;
    var erc20;

    before(async () => {
        marketplace = await Marketplace.deployed();
        erc20 = await ERC20.deployed();
        await erc20.mint(accounts[2], 1000000, { from: accounts[0] });
        control = await NFTControl.deployed();
        const { logs } = await control.deployNFT("Test NFT", "TNFT", "https://testnft.com/", 500, {
            from: accounts[0],
        });
        const { contractAddress } = logs[0].args;
        nft = await NFT.at(contractAddress);
        await nft.safeMint(accounts[1], "https://testnft.com/0", { from: accounts[0] });
    });

    it("Address(0) in payment whitelist is available", async () => {
        const zeroAddress = "0x0000000000000000000000000000000000000000";
        const isAvailable = await marketplace.isAvailable(zeroAddress, { from: accounts[0] });

        assert.equal(isAvailable, true, "Address(0) (native token) is not available");
    });

    it("Add new currency to whitelist", async () => {
        await marketplace.addWhitelist(erc20.address);
        const isAvailable = await marketplace.isAvailable(erc20.address, { from: accounts[0] });

        assert.equal(isAvailable, true, "Test token is not available");
    });

    it("Update currency in whitelist", async () => {
        await marketplace.updateWhitelist(1, false);
        const isAvailable = await marketplace.isAvailable(erc20.address, { from: accounts[0] });

        assert.equal(isAvailable, false, "Test token is available");
    });

    it("Listing NFT to marketplace", async () => {
        await marketplace.updateWhitelist(1, true);
        await nft.approve(marketplace.address, 0, { from: accounts[1] });
        const startDate = Math.floor(new Date("2022.02.21").getTime() / 1000);
        const endDate = Math.floor(new Date("2022.03.21").getTime() / 1000);
        const { logs } = await marketplace.listNft(nft.address, 0, erc20.address, 10000, startDate, endDate, {
            from: accounts[1],
            gas: 4000000,
        });
        const { assetContract, tokenId } = logs[0].args;

        assert.equal(assetContract, nft.address, "Asset contract is incorrect");
        assert.equal(tokenId, 0, "Token id is incorrect");
    });

    it("Unlisting nft from marketplace", async () => {
        await marketplace.unlistNft(1, { from: accounts[1] });
        const tokenOwner = await nft.ownerOf(0);

        assert.equal(tokenOwner, accounts[1], "Nft was not returned to seller");
    });

    it("Re-list nft and buy it", async () => {
        await nft.approve(marketplace.address, 0, { from: accounts[1] });
        await erc20.approve(marketplace.address, 1000000, { from: accounts[2]})

        const startDate = Math.floor(new Date("2022.02.21").getTime() / 1000);
        const endDate = Math.floor(new Date("2022.03.21").getTime() / 1000);
        const { logs } = await marketplace.listNft(nft.address, 0, erc20.address, 10000, startDate, endDate, {
            from: accounts[1],
            gas: 4000000,
        });
        const { itemIndex } = logs[0].args;

        marketplace.buy(itemIndex, { from: accounts[2]});
        const creatorBalance = erc20.balanceOf(accounts[0]);
        const sellerBalance = erc20.balanceOf(accounts[1]);

        assert(creatorBalance, 500, "Creator's balance is incorrect");
        assert(sellerBalance, 9500, "Seller's balance is incorrect")
    });
});
