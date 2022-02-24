/*global artifacts*/

const NFTControl = artifacts.require("NFTControl");

module.exports = function (deployer) {
  deployer.deploy(NFTControl);
};
