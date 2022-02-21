/*global artifacts, contract, before, assert*/

const NFTControl = artifacts.require("NFTControl");
const NFT = artifacts.require("NFT721");

contract("NFTControl", (accounts) => {
    var control = null;
    before(async () => {
        control = await NFTControl.deployed();
    });

    it("Deploy contract", async () => {
        const zeroAddress = "0x0000000000000000000000000000000000000000";
        const { logs } = await control.deployNFT("Test NFT", "TNFT", "https://testnft.com/", 500, { from: accounts[0]});
        const { contractAddress } = logs[0].args;
        const nft = await NFT.at(contractAddress);
        const owner = await nft.owner();

        assert.notEqual(contractAddress, zeroAddress, "Contract's address is 0");
        assert.equal(owner, accounts[0], "Deployer is not owner");
    });

    it("Get all contracts of user", async () => {
        // one more nft contract
        await control.deployNFT("Test NFT 2", "TNFT2", "https://testnft2.com/", 1000, { from: accounts[0]});
        const contracts = await control.getAllContractOfUser(accounts[0], {from: accounts[0]});

        assert.equal(contracts.length, 2, `Number of contracts is not equal 2: ${contracts.length}`)
    })
});
