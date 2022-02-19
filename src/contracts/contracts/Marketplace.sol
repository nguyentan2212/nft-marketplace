// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./NFT721.sol";

contract Marketplace is ReentrancyGuard, ERC721Holder {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    ///@dev item index, start from 1
    CountersUpgradeable.Counter private _itemIdCounter;

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

    function listNft(
        address assetContract,
        uint256 tokenId,
        address currency,
        uint256 price,
        uint256 saleStart,
        uint256 saleEnd
    ) external nonReentrant {
        require(price > 0, "Marketplace: Price must greater than 0");
        require(saleStart > saleEnd, "Marketplace: Sale start must grater than sale end");

        bytes32 itemHash = keccak256(abi.encodePacked(assetContract, tokenId));
        require(listings[itemHash] == 0, "Marketplace: Item have already listed on marketplace");

        NFT721 nft = NFT721(assetContract);
        address owner = nft.ownerOf(tokenId);
        address accountApproved = nft.getApproved(tokenId);
        require(msg.sender == owner || msg.sender == accountApproved, "Marketplace: Caller is not owner nor approved for all");

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

        nft.safeTransferFrom(owner, address(this), tokenId);

        emit ListedNFT(itemIndex, assetContract, tokenId);
    }

    function unlistNft(uint256 itemIndex) external {
        require(itemIndex > _itemIdCounter.current(), "Marketplace: Item does not exit");
        
        MarketItem memory item = marketItems[itemIndex];
        require(block.timestamp > item.saleEnd, "Marketplace: Item has expired");
        bytes32 itemHash = keccak256(abi.encodePacked(item.assetContract, item.tokenId));
        require(listings[itemHash] != 0, "Marketplace: Item is not listed yet nor sold");
        require(msg.sender == item.seller, "Marketplace: Caller is not seller");

        NFT721 nft = NFT721(item.assetContract);
        nft.safeTransferFrom(address(this), item.seller, item.tokenId);

        emit UnlistedNFT(item.itemIndex, item.assetContract, item.tokenId);
    }

    function buy(uint256 itemIndex) external nonReentrant {
        require(itemIndex > _itemIdCounter.current(), "Marketplace: Item does not exit");
        
        MarketItem memory item = marketItems[itemIndex];
        require(block.timestamp > item.saleEnd, "Marketplace: Item has expired");
        bytes32 itemHash = keccak256(abi.encodePacked(item.assetContract, item.tokenId));
        require(listings[itemHash] != 0, "Marketplace: Item is not listed yet nor sold");

        // payment with native token
        if (item.currency == address(0)){
            address payable to = payable(item.seller);
            (bool success, ) = to.call{ value: item.price }("");
            require(success, "Marketplace: Native token transfer failed");
        }
        // payment with erc20 token
        else {
            IERC20 paymentToken = IERC20(item.currency);
            require(paymentToken.approve(address(this), item.price), "Marketplace: Caller is not approved for marketplace");
            paymentToken.transferFrom(msg.sender, item.seller, item.price);
        }
        NFT721 nft = NFT721(item.assetContract);
        nft.safeTransferFrom(address(this), msg.sender, item.tokenId);

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
