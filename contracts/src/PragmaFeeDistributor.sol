// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title PragmaFeeDistributor
/// @notice Collects and distributes protocol fees from tokenization activities.
/// Supports issuance, trading, management, and custody fee types.
contract PragmaFeeDistributor is AccessControl, ReentrancyGuard {
    // --- Roles ---
    bytes32 public constant FEE_COLLECTOR_ROLE = keccak256("FEE_COLLECTOR_ROLE");

    /// @notice Fee structure in basis points (1 bp = 0.01%)
    struct FeeRates {
        uint256 issuanceBps;   // Fee on token minting
        uint256 tradingBps;    // Fee on secondary trades
        uint256 managementBps; // Annual fee on AUT (accrued)
        uint256 custodyBps;    // Fee for physical asset storage
    }

    FeeRates public feeRates;

    /// @notice Treasury address that receives collected fees
    address public treasury;

    /// @notice Total fees collected (lifetime)
    uint256 public totalFeesCollected;

    /// @notice Fee accumulated per asset
    mapping(uint256 => uint256) public feesPerAsset;

    // --- Events ---
    event FeesCollected(uint256 indexed assetId, uint256 amount, uint256 issuanceFee, uint256 tradingFee);
    event FeesDistributed(uint256 indexed assetId, uint256 amount);
    event FeeRatesUpdated(uint256 issuanceBps, uint256 tradingBps, uint256 managementBps, uint256 custodyBps);
    event TreasuryUpdated(address indexed treasury);

    constructor(address admin, address treasury_) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(FEE_COLLECTOR_ROLE, admin);
        treasury = treasury_;
    }

    /// @notice Collect issuance fee when minting new tokens
    function collectIssuanceFee(uint256 assetId, uint256 amount) external payable onlyRole(FEE_COLLECTOR_ROLE) nonReentrant {
        uint256 fee = (amount * feeRates.issuanceBps) / 10000;
        require(msg.value >= fee, "Insufficient fee payment");

        totalFeesCollected += fee;
        feesPerAsset[assetId] += fee;

        emit FeesCollected(assetId, fee, fee, 0);
    }

    /// @notice Collect trading fee on secondary market swaps
    function collectTradingFee(
        uint256 assetId,
        uint256 tradeAmount,
        uint256 price
    ) external payable onlyRole(FEE_COLLECTOR_ROLE) nonReentrant {
        uint256 fee = (price * feeRates.tradingBps) / 10000;
        require(msg.value >= fee, "Insufficient fee payment");

        totalFeesCollected += fee;
        feesPerAsset[assetId] += fee;

        emit FeesCollected(assetId, fee, 0, fee);
    }

    /// @notice Distribute accumulated fees to the treasury
    function distributeToTreasury() external nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to distribute");
        require(treasury != address(0), "Treasury not set");

        (bool sent,) = payable(treasury).call{value: balance}("");
        require(sent, "Distribution failed");

        emit FeesDistributed(0, balance);
    }

    /// @notice Distribute fees for a specific asset to treasury
    function distributeAssetFees(uint256 assetId) external nonReentrant {
        uint256 amount = feesPerAsset[assetId];
        require(amount > 0, "No fees for this asset");
        require(treasury != address(0), "Treasury not set");

        feesPerAsset[assetId] = 0;

        (bool sent,) = payable(treasury).call{value: amount}("");
        require(sent, "Distribution failed");

        emit FeesDistributed(assetId, amount);
    }

    // --- Admin ---

    /// @notice Update all fee rates at once
    function setFeeRates(
        uint256 issuanceBps,
        uint256 tradingBps,
        uint256 managementBps,
        uint256 custodyBps
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(issuanceBps <= 1000, "Issuance too high");    // max 10%
        require(tradingBps <= 500, "Trading fee too high");   // max 5%
        require(managementBps <= 500, "Management fee too high"); // max 5%
        require(custodyBps <= 1000, "Custody fee too high");  // max 10%

        feeRates = FeeRates({
            issuanceBps: issuanceBps,
            tradingBps: tradingBps,
            managementBps: managementBps,
            custodyBps: custodyBps
        });

        emit FeeRatesUpdated(issuanceBps, tradingBps, managementBps, custodyBps);
    }

    /// @notice Update the treasury address
    function setTreasury(address treasury_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(treasury_ != address(0), "Invalid treasury");
        treasury = treasury_;
        emit TreasuryUpdated(treasury_);
    }

    /// @notice Fallback to receive ETH
    receive() external payable {}

    // --- ERC-165 ---

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
