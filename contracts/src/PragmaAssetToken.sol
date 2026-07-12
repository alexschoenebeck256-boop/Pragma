// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC1155Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

interface IComplianceRegistry {
    function canTransfer(address from, address to, uint256 tokenId, uint256 amount)
        external
        view
        returns (bool allowed, bytes memory reason);
}

/// @title PragmaAssetToken
/// @notice ERC-1155 token representing fractional ownership in tokenized real-world assets.
/// UUPS upgradeable, with AccessControl, pausing, and compliance hooks.
contract PragmaAssetToken is
    Initializable,
    ERC1155Upgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    // --- Roles ---
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /// @notice The compliance registry governing transfers
    IComplianceRegistry public complianceRegistry;

    /// @notice Per-token metadata URIs
    mapping(uint256 => string) private _tokenURIs;

    /// @notice Event emitted when compliance registry is updated
    event ComplianceRegistryUpdated(address indexed registry);

    /// @notice Event emitted when token URI is updated
    event TokenURIUpdated(uint256 indexed tokenId, string uri);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract (replaces constructor for UUPS)
    function initialize(
        address admin,
        address complianceRegistry_,
        string memory uri_
    ) public initializer {
        __ERC1155_init(uri_);
        __AccessControl_init();
        __Pausable_init();


        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        complianceRegistry = IComplianceRegistry(complianceRegistry_);
    }

    // --- Minting ---

    /// @notice Mint tokens to a specific address
    function mint(
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) external onlyRole(MINTER_ROLE) whenNotPaused {
        _mint(to, tokenId, amount, data);
    }

    /// @notice Batch mint multiple token types
    function mintBatch(
        address to,
        uint256[] calldata tokenIds,
        uint256[] calldata amounts,
        bytes memory data
    ) external onlyRole(MINTER_ROLE) whenNotPaused {
        _mintBatch(to, tokenIds, amounts, data);
    }

    // --- Burning ---

    /// @notice Burn tokens from a specific address
    function burn(
        address from,
        uint256 tokenId,
        uint256 amount
    ) external onlyRole(BURNER_ROLE) whenNotPaused {
        _burn(from, tokenId, amount);
    }

    // --- Token URI ---

    /// @notice Set the metadata URI for a token ID
    function setTokenURI(uint256 tokenId, string memory uri_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _tokenURIs[tokenId] = uri_;
        emit TokenURIUpdated(tokenId, uri_);
    }

    /// @notice Get the metadata URI for a token ID
    function uri(uint256 tokenId) public view override returns (string memory) {
        string memory custom = _tokenURIs[tokenId];
        if (bytes(custom).length > 0) {
            return custom;
        }
        return super.uri(tokenId);
    }

    // --- Compliance ---

    /// @notice Update the compliance registry
    function setComplianceRegistry(address registry_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        complianceRegistry = IComplianceRegistry(registry_);
        emit ComplianceRegistryUpdated(registry_);
    }

    // --- Pausing ---

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // --- Transfer hooks ---

    /// @notice Hook that enforces compliance before any transfer
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) internal virtual override whenNotPaused {
        // Skip checks for minting (from == address(0)) and burning (to == address(0))
        if (from != address(0) && to != address(0) && address(complianceRegistry) != address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                (bool allowed, bytes memory reason) = complianceRegistry.canTransfer(from, to, ids[i], amounts[i]);
                if (!allowed) {
                    revert(string.concat("Transfer blocked by compliance: ", string(reason)));
                }
            }
        }
        super._update(from, to, ids, amounts);
    }

    // --- UUPS ---

    /// @notice Required override: only admin can upgrade
    function _authorizeUpgrade(address newImplementation) internal virtual override onlyRole(DEFAULT_ADMIN_ROLE) {}

    // --- ERC-165 ---

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // --- Storage gap for upgrades ---

    uint256[49] private __gap;
}
