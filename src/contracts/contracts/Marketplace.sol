// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./NFT721.sol";
import "./TransferExecutor.sol";

contract Marketplace is ReentrancyGuard, ERC721Holder, TransferExecutor {
    using Counters for Counters.Counter;
    ///@dev item index, start from 1
    Counters.Counter private _itemIdCounter;
    struct MarketItem {
        uint256 itemIndex;
        address seller;
        address assetContract;
        uint256 tokenId;
        address currency; // if currency == 0x..0, it is native token
        uint256 price;
        uint256 saleStart;
        uint256 saleEnd;
    }

    ///@dev itemIndex => item item
    mapping(uint256 => MarketItem) public marketItems;

    ///@dev hash(assetContract, tokenId) => listingIndex;
    mapping(bytes32 => uint256) public listings;

    event ListedNFT(uint256 indexed itemIndex, address indexed assetContract, uint256 indexed tokenId);
    event UnlistedNFT(uint256 indexed itemIndex, address indexed assetContract, uint256 indexed tokenId);
    event BoughtNFT(address indexed buyer, uint256 indexed itemIndex);

    constructor() {}

    function listNft(
        address assetContract,
        uint256 tokenId,
        address currency,
        uint256 price,
        uint256 saleStart,
        uint256 saleEnd
    ) external nonReentrant {
        require(price > 0, "Marketplace: Price must greater than 0");
        require(saleStart < saleEnd, "Marketplace: Sale start must smaller than sale end");

        bytes32 itemHash = keccak256(abi.encodePacked(assetContract, tokenId));
        require(listings[itemHash] == 0, "Marketplace: Item have already listed on marketplace");

        require(isAvailable(currency) == true, "Marketplace: Currency is not in whitelist");

        NFT721 nft = NFT721(assetContract);
        address tokenOwner = nft.ownerOf(tokenId);
        address accountApproved = nft.getApproved(tokenId);
        require(msg.sender == tokenOwner || msg.sender == accountApproved, "Marketplace: Caller is not owner nor approved for all");
        
        _itemIdCounter.increment();
        uint256 itemIndex = _itemIdCounter.current();
        marketItems[itemIndex] = MarketItem(
            itemIndex, 
            msg.sender, 
            assetContract, 
            tokenId, 
            currency, 
            price, 
            saleStart, 
            saleEnd
        );
        listings[itemHash] = itemIndex;

        nft.safeTransferFrom(tokenOwner, address(this), tokenId);

        emit ListedNFT(itemIndex, assetContract, tokenId);
    }

    function unlistNft(uint256 itemIndex) external {
        require(itemIndex <= _itemIdCounter.current(), "Marketplace: Item does not exit");
        
        MarketItem memory item = marketItems[itemIndex];
        bytes32 itemHash = keccak256(abi.encodePacked(item.assetContract, item.tokenId));
        require(listings[itemHash] != 0, "Marketplace: Item is not listed yet or was sold");
        require(msg.sender == item.seller, "Marketplace: Caller is not seller");

        NFT721 nft = NFT721(item.assetContract);
        nft.safeTransferFrom(address(this), item.seller, item.tokenId);
        listings[itemHash] = 0;

        emit UnlistedNFT(item.itemIndex, item.assetContract, item.tokenId);
    }

    function buy(uint256 itemIndex) external nonReentrant {
        require(itemIndex <= _itemIdCounter.current(), "Marketplace: Item does not exit");
        
        MarketItem memory item = marketItems[itemIndex];
        require(block.timestamp < item.saleEnd, "Marketplace: Item has expired");
        bytes32 itemHash = keccak256(abi.encodePacked(item.assetContract, item.tokenId));
        require(listings[itemHash] != 0, "Marketplace: Item is not listed yet or was sold");

        NFT721 nft = NFT721(item.assetContract);
        nft.safeTransferFrom(address(this), msg.sender, item.tokenId);

        (address receiver, uint256 royalty) = nft.royaltyInfo(item.tokenId, item.price);

        ///@dev pay royalty for creator
        _executePayment(item.currency, royalty, msg.sender, receiver);

        ///@dev pay for seller
        _executePayment(item.currency, item.price - royalty, msg.sender, item.seller);

        listings[itemHash] = 0;

        emit BoughtNFT(msg.sender, itemIndex);
    }

    ///@dev get all available items
    function getAllItems() external view returns(MarketItem[] memory items) {
        uint256 numOfItems = _itemIdCounter.current();
        uint256 numOfAvailableItems = 0;

        for(uint256 i = 1; i <= numOfItems; i++){
            MarketItem memory item = marketItems[i];
            bytes32 itemHash = keccak256(abi.encodePacked(item.assetContract, item.tokenId));
           if (item.saleEnd > block.timestamp || item.itemIndex == listings[itemHash]){
               numOfAvailableItems += 1;
           }
        }

        items = new MarketItem[](numOfAvailableItems);
        uint256 counter = 0;
        for(uint256 i = 1; i <= numOfItems; i++){
            MarketItem memory item = marketItems[i];
            bytes32 itemHash = keccak256(abi.encodePacked(item.assetContract, item.tokenId));
           if (item.saleEnd > block.timestamp && item.itemIndex == listings[itemHash]){
               items[counter] = marketItems[i];
               counter += 1;
           }
        }
    }

    ///@dev get all available items of `seller`
    function getItemsBySeller(address seller) external view returns(MarketItem[] memory items){
        uint256 numOfItems = _itemIdCounter.current();
        uint256 numOfAvailableItems = 0;

        for(uint256 i = 1; i <= numOfItems; i++){
            MarketItem memory item = marketItems[i];
            bytes32 itemHash = keccak256(abi.encodePacked(item.assetContract, item.tokenId));
           if (item.saleEnd > block.timestamp && item.itemIndex == listings[itemHash] && item.seller == seller){
               numOfAvailableItems += 1;
           }
        }

        items = new MarketItem[](numOfAvailableItems);
        uint256 counter = 0;
        for(uint256 i = 1; i <= numOfItems; i++){
            MarketItem memory item = marketItems[i];
            bytes32 itemHash = keccak256(abi.encodePacked(item.assetContract, item.tokenId));
           if (item.saleEnd > block.timestamp && item.itemIndex == listings[itemHash] && item.seller == seller){
               items[counter] = marketItems[i];
               counter += 1;
           }
        }
    }
}
