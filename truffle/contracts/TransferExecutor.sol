// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TransferExecutor is Ownable {
    using Counters for Counters.Counter;
    ///@dev payment whitelist index, start from 0
    Counters.Counter private _paymentCurrencyCounter;

    struct PaymentCurrency {
        uint256 index;
        address currencyAddress;
        bool isAvailable;
    }

    ///@dev currency whitelist for payment on marketplace
    mapping(uint256 => PaymentCurrency) private _paymentWhitelist;

    event AddedWhitelist(uint256 indexed index, address indexed currency);
    event UpdatedWhitelist(uint256 indexed index, address indexed currency, bool isAvailable);

    
    ///@dev Convention that the address of native token is 0
    constructor() {
        _addWhitelist(address(0));
    }

    function addWhitelist(address currency) external onlyOwner {
        _addWhitelist(currency);
    }

    function _addWhitelist(address currency) internal {
        uint256 index = _paymentCurrencyCounter.current();
        _paymentWhitelist[index] = PaymentCurrency(index, currency, true);
        _paymentCurrencyCounter.increment();
        emit AddedWhitelist(index, currency);
    }

    function updateWhitelist(uint256 index, bool _isAvailable) external onlyOwner {
        _paymentWhitelist[index].isAvailable = _isAvailable;
        emit UpdatedWhitelist(index, _paymentWhitelist[index].currencyAddress, _paymentWhitelist[index].isAvailable);
    }

    function getWhitelist() external view returns (PaymentCurrency[] memory whitelist) {
        uint256 numOfPaymentCurrencies = _paymentCurrencyCounter.current();
        whitelist = new PaymentCurrency[](numOfPaymentCurrencies);

        for (uint256 i = 0; i < numOfPaymentCurrencies; i++) {
            whitelist[i] = _paymentWhitelist[i];
        }
    }

    function isAvailable(address currency) public view returns (bool) {
        uint256 numOfPaymentCurrencies = _paymentCurrencyCounter.current();

        for (uint256 i = 0; i < numOfPaymentCurrencies; i++) {
            if (_paymentWhitelist[i].currencyAddress == currency && _paymentWhitelist[i].isAvailable == true) {
                return true;
            }
        }
        return false;
    }

    function _executePayment(
        address currency,
        uint256 amount,
        address from,
        address to
    ) internal {
        if (currency == address(0)) {
            _transferEther(amount, payable(to));
        } else {
            IERC20 paymentToken = IERC20(currency);
            paymentToken.transferFrom(from, to, amount);
        }
    }

    function _transferEther(uint256 amount, address payable to) internal {
        (bool success, ) = to.call{value: amount}("");
        require(success, "TransferExecutor: Native token transfer failed");
    }
}
