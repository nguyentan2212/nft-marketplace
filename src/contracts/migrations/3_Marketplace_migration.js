/*global artifacts*/

const Marketplace = artifacts.require("Marketplace");
const MyToken = artifacts.require("MyToken");

module.exports = function (deployer) {
  deployer.deploy(Marketplace);
  deployer.deploy(MyToken);
};
