// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./NFT721.sol";

contract NFTControl is AccessControl {

    bytes32 public constant REGISTRY_ROLE = keccak256("REGISTRY_ROLE");
    NFT721 private immutable _implementation;

    struct NFTs {
        // E.g. if `lastestNFT == 2`, there are 2 `NFT` contracts deployed.
        uint256 numOfContracts; 
        // Mapping from index => nft contract address.
        mapping(uint256 => address) NFTAddress;
    }

    /// @dev Mapping from app deployer => index and app addresses.
    mapping(address => NFTs) private _nfts;

    event DeployedContract(address indexed _deployer, address indexed contractAddress);
    constructor() {
        _implementation = new NFT721();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function deployNFT(string memory name, string memory symbol,string memory uri) 
    external 
    returns (address contractAddress) {
        address deployer = _msgSender();
        uint256 nonce = getNextIndex(deployer);
        bytes32 salt = keccak256(abi.encodePacked(deployer, nonce));
        contractAddress = Clones.cloneDeterministic(address(_implementation), salt);
        NFT721(contractAddress).initialize(name, symbol, uri, deployer);

        emit DeployedContract(deployer, contractAddress);
    }

    function getNextIndex(address deployer) internal returns (uint256) {
        // Increment index
        _nfts[deployer].numOfContracts += 1;

        return _nfts[deployer].numOfContracts;
    }
}