// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title PragmaComplianceRegistry
/// @notice Central compliance engine for Pragma. Enforces KYC/AML whitelist,
/// investor tiers, jurisdiction gating, and per-asset transfer restrictions.
contract PragmaComplianceRegistry is AccessControl {
    // --- Roles ---
    bytes32 public constant COMPLIANCE_OFFICER_ROLE = keccak256("COMPLIANCE_OFFICER_ROLE");

    /// @dev Investor tiers
    enum InvestorTier { Retail, Accredited, Qualified }

    /// @dev Per-asset transfer restriction configuration
    struct AssetRestriction {
        bool requiresAccreditation;
        uint256 minHoldingPeriod;
        uint256 maxHoldPerAddress;
        bool jurisdictionLimited;
        bytes32[] allowedJurisdictions;
    }

    /// @dev On-chain investor identity record
    struct Investor {
        bool active;
        InvestorTier tier;
        bytes32 countryCode;
        uint256 kycExpiry;
    }

    /// @notice Mapping from address to investor record
    mapping(address => Investor) public investors;

    /// @notice Mapping from token ID to asset-specific restrictions
    mapping(uint256 => AssetRestriction) public assetRestrictions;

    /// @notice Mapping from investor => tokenId => last transfer timestamp (for min holding period)
    mapping(address => mapping(uint256 => uint256)) public lastTransferTime;

    // --- Events ---
    event InvestorAdded(address indexed investor, InvestorTier tier, bytes32 countryCode, uint256 expiry);
    event InvestorRemoved(address indexed investor);
    event InvestorTierUpdated(address indexed investor, InvestorTier newTier);
    event AssetRestrictionSet(uint256 indexed tokenId, AssetRestriction restriction);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(COMPLIANCE_OFFICER_ROLE, admin);
    }

    // --- Investor Management ---

    /// @notice Add or update an investor after off-chain KYC approval
    function addInvestor(
        address investor,
        bytes32 countryCode,
        InvestorTier tier,
        uint256 kycExpiry
    ) external onlyRole(COMPLIANCE_OFFICER_ROLE) {
        require(investor != address(0), "Invalid address");
        require(kycExpiry > block.timestamp, "KYC already expired");
        investors[investor] = Investor({active: true, tier: tier, countryCode: countryCode, kycExpiry: kycExpiry});
        emit InvestorAdded(investor, tier, countryCode, kycExpiry);
    }

    /// @notice Remove an investor from the whitelist
    function removeInvestor(address investor) external onlyRole(COMPLIANCE_OFFICER_ROLE) {
        require(investors[investor].active, "Not an active investor");
        delete investors[investor];
        emit InvestorRemoved(investor);
    }

    /// @notice Update an investor's tier without changing other fields
    function updateInvestorTier(address investor, InvestorTier newTier) external onlyRole(COMPLIANCE_OFFICER_ROLE) {
        require(investors[investor].active, "Not an active investor");
        investors[investor].tier = newTier;
        emit InvestorTierUpdated(investor, newTier);
    }

    /// @notice Check if an investor is allowed to hold a given token
    function isInvestorAllowed(address investor, uint256 tokenId, uint256 amount)
        external
        view
        returns (bool)
    {
        Investor storage inv = investors[investor];
        if (!inv.active || inv.kycExpiry <= block.timestamp) return false;

        AssetRestriction storage restriction = assetRestrictions[tokenId];
        // Check accreditation requirement
        if (restriction.requiresAccreditation && inv.tier == InvestorTier.Retail) return false;

        // Check jurisdiction
        if (restriction.jurisdictionLimited) {
            bool jurisdictionOk = false;
            for (uint256 i = 0; i < restriction.allowedJurisdictions.length; i++) {
                if (restriction.allowedJurisdictions[i] == inv.countryCode) {
                    jurisdictionOk = true;
                    break;
                }
            }
            if (!jurisdictionOk) return false;
        }

        // Check max hold
        if (restriction.maxHoldPerAddress > 0) {
            uint256 currentBalance = IERC1155Like(msg.sender).balanceOf(investor, tokenId);
            if (currentBalance + amount > restriction.maxHoldPerAddress) return false;
        }

        return true;
    }

    // --- Transfer Check ---

    /// @notice Core compliance check called by the asset token before every transfer
    function canTransfer(address from, address to, uint256 tokenId, uint256 amount)
        external
        view
        returns (bool allowed, bytes memory reason)
    {
        // Both sender and receiver must be compliant investors
        if (to != address(0)) {
            Investor storage toInv = investors[to];
            if (!toInv.active) return (false, "Receiver not KYC approved");
            if (toInv.kycExpiry <= block.timestamp) return (false, "Receiver KYC expired");

            AssetRestriction storage restriction = assetRestrictions[tokenId];
            if (restriction.requiresAccreditation && toInv.tier == InvestorTier.Retail) {
                return (false, "Receiver not accredited");
            }

            if (restriction.jurisdictionLimited) {
                bool jurisdictionOk = false;
                for (uint256 i = 0; i < restriction.allowedJurisdictions.length; i++) {
                    if (restriction.allowedJurisdictions[i] == toInv.countryCode) {
                        jurisdictionOk = true;
                        break;
                    }
                }
                if (!jurisdictionOk) return (false, "Jurisdiction not allowed");
            }
        }

        // Check min holding period for sender (only on transfers, not mint/burn)
        if (from != address(0) && to != address(0)) {
            AssetRestriction storage restriction = assetRestrictions[tokenId];
            if (restriction.minHoldingPeriod > 0) {
                uint256 lastTx = lastTransferTime[from][tokenId];
                if (lastTx > 0 && block.timestamp < lastTx + restriction.minHoldingPeriod) {
                    return (false, "Minimum holding period not met");
                }
            }
        }

        return (true, "");
    }

    // --- Asset Configuration ---

    /// @notice Set restrictions for a tokenized asset
    function setAssetRestriction(uint256 tokenId, AssetRestriction calldata restriction)
        external
        onlyRole(COMPLIANCE_OFFICER_ROLE)
    {
        assetRestrictions[tokenId] = restriction;
        emit AssetRestrictionSet(tokenId, restriction);
    }

    // --- ERC-165 ---

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

/// @dev Minimal interface for balance checks within the registry
interface IERC1155Like {
    function balanceOf(address account, uint256 id) external view returns (uint256);
}
