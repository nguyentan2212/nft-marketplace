// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721RoyaltyUpgradeable.sol";

contract NFT721 is
    Initializable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    ERC721BurnableUpgradeable,
    OwnableUpgradeable,
    ERC721RoyaltyUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;

    string private _contractURI;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    ///@dev royalty: 0..10_000 -> 0%..100%
    function initialize(
        string memory _name,
        string memory _symbol,
        string memory _uri,
        address deployer,
        uint96 royalty
    ) public initializer {
        __ERC721_init(_name, _symbol);
        __ERC721URIStorage_init();
        __ERC721Burnable_init();
        __Ownable_init();
        __ERC721Royalty_init();
        
        _contractURI = _uri;
        _setDefaultRoyalty(deployer, royalty);
        _transferOwnership(deployer);
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable, ERC721RoyaltyUpgradeable)
    {
        super._burn(tokenId);
    }

    function _baseURI() internal view override returns (string memory)
    {
        return _contractURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721Upgradeable, ERC721RoyaltyUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
