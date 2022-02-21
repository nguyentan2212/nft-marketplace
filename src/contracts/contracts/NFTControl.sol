// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./NFT721.sol";

contract NFTControl {
    NFT721 private immutable _implementation;

    struct NFTs {
        // E.g. if `lastestNFT == 2`, there are 2 `NFT` contracts deployed.
        uint256 numOfContracts; 
        // Mapping from index => nft contract address, start from 1
        mapping(uint256 => address) NFTAddresses;
    }

    /// @dev Mapping from app deployer => index and app addresses.
    mapping(address => NFTs) private _nfts;

    event DeployedContract(address indexed _deployer, address indexed contractAddress);
    constructor() {
        _implementation = new NFT721();
    }

    function deployNFT(string memory name, string memory symbol,string memory uri, uint96 royalty) 
    external 
    returns (address contractAddress) {
        address deployer = msg.sender;
        uint256 nonce = getNextIndex(deployer);
        bytes32 salt = keccak256(abi.encodePacked(deployer, nonce));
        contractAddress = Clones.cloneDeterministic(address(_implementation), salt);
        NFT721(contractAddress).initialize(name, symbol, uri, deployer, royalty);

        emit DeployedContract(deployer, contractAddress);
    }

    function getAllContractOfUser(address user) external view returns (address[] memory contracts) {
        uint256 numOfContracts = _nfts[user].numOfContracts;
        contracts = new address[](numOfContracts);

        for (uint256 i = 1; i <= numOfContracts; i++) {
            contracts[i-1] =  _nfts[user].NFTAddresses[i];
        }
    }

    function getNextIndex(address deployer) internal returns (uint256) {
        // Increment index
        _nfts[deployer].numOfContracts += 1;

        return _nfts[deployer].numOfContracts;
    }
}