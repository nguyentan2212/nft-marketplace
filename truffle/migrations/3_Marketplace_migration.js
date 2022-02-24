/*global artifacts*/

const Marketplace = artifacts.require("Marketplace");
const MyToken = artifacts.require("MyToken");

module.exports = async function (deployer, network, accounts) {
  deployer.deploy(Marketplace);
  await deployer.deploy(MyToken);
  const token = await MyToken.deployed();
  
  await token.mint(accounts[0], 1000000, { from: accounts[0]});
  await token.mint(accounts[1], 1000000, { from: accounts[0]});
  await token.mint(accounts[2], 1000000, { from: accounts[0]});
};
