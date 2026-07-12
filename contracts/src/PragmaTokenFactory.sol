// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title PragmaTokenFactory
/// @notice Factory contract that deploys new PragmaAssetToken instances via ERC-1167 minimal proxies.
/// Standardizes deployment parameters and reduces gas costs for each new asset.
contract PragmaTokenFactory is AccessControl {
    using Clones for address;

    // --- Roles ---
    bytes32 public constant FACTORY_ADMIN_ROLE = keccak256("FACTORY_ADMIN_ROLE");

    /// @notice The implementation contract for asset tokens (ERC-1167 logic)
    address public assetTokenImplementation;

    /// @notice Default compliance registry for new tokens
    address public defaultComplianceRegistry;

    /// @notice Fee rate in basis points for issuance
    uint256 public issuanceFeeBps;

    /// @notice Treasury address that receives fees
    address public treasury;

    /// @notice Counter for asset IDs
    uint256 public assetCount;

    /// @dev Structure to track deployed assets
    struct AssetInfo {
        uint256 assetId;
        address tokenContract;
        address issuer;
    }

    /// @notice Mapping from asset ID to its info
    mapping(uint256 => AssetInfo) public assets;

    /// @notice Mapping from token contract to its asset ID
    mapping(address => uint256) public tokenToAssetId;

    // --- Events ---
    event AssetCreated(
        uint256 indexed assetId,
        address indexed tokenContract,
        address indexed issuer,
        address implementation,
        address complianceRegistry
    );

    event ImplementationUpdated(address indexed newImplementation);
    event DefaultComplianceUpdated(address indexed registry);
    event FeeRatesUpdated(uint256 issuanceFeeBps);
    event TreasuryUpdated(address indexed treasury);

    constructor(
        address admin,
        address implementation,
        address complianceRegistry_,
        address treasury_
    ) {
        require(implementation != address(0), "Invalid implementation");
        require(complianceRegistry_ != address(0), "Invalid compliance registry");

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(FACTORY_ADMIN_ROLE, admin);

        assetTokenImplementation = implementation;
        defaultComplianceRegistry = complianceRegistry_;
        treasury = treasury_;
    }

    /// @notice Deploy a new asset token contract via ERC-1167 clone
    /// @param salt Unique salt for deterministic address (use keccak256 of asset metadata)
    /// @return tokenContract Address of the cloned token contract
    function createAssetToken(bytes32 salt) external returns (address tokenContract) {
        require(defaultComplianceRegistry != address(0), "Default compliance not set");

        assetCount++;
        uint256 assetId = assetCount;

        // Deploy clone using CREATE2 for deterministic address
        tokenContract = assetTokenImplementation.cloneDeterministic(salt);

        // Store asset info
        assets[assetId] = AssetInfo({
            assetId: assetId,
            tokenContract: tokenContract,
            issuer: msg.sender
        });
        tokenToAssetId[tokenContract] = assetId;

        emit AssetCreated(assetId, tokenContract, msg.sender, assetTokenImplementation, defaultComplianceRegistry);
    }

    /// @notice Update the implementation contract used for future clones
    function setImplementation(address newImpl) external onlyRole(FACTORY_ADMIN_ROLE) {
        require(newImpl != address(0), "Invalid implementation");
        assetTokenImplementation = newImpl;
        emit ImplementationUpdated(newImpl);
    }

    /// @notice Set the default compliance registry for new tokens
    function setDefaultCompliance(address registry_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(registry_ != address(0), "Invalid registry");
        defaultComplianceRegistry = registry_;
        emit DefaultComplianceUpdated(registry_);
    }

    /// @notice Update issuance fee rate (in basis points)
    function setIssuanceFeeBps(uint256 bps) external onlyRole(FACTORY_ADMIN_ROLE) {
        require(bps <= 10000, "BPS exceeds max");
        issuanceFeeBps = bps;
        emit FeeRatesUpdated(bps);
    }

    /// @notice Update the treasury address
    function setTreasury(address treasury_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(treasury_ != address(0), "Invalid treasury");
        treasury = treasury_;
        emit TreasuryUpdated(treasury_);
    }

    /// @notice Predict the address of a clone before deployment
    function predictAddress(bytes32 salt) external view returns (address) {
        return assetTokenImplementation.predictDeterministicAddress(salt, address(this));
    }

    // --- ERC-165 ---

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
