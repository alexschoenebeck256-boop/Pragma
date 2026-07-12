// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Test} from "forge-std/Test.sol";
import {PragmaAssetToken} from "../src/PragmaAssetToken.sol";
import {PragmaComplianceRegistry} from "../src/PragmaComplianceRegistry.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract PragmaAssetTokenTest is Test {
    PragmaAssetToken public token;
    PragmaComplianceRegistry public compliance;

    address public admin = address(0x1);
    address public minter = address(0x2);
    address public burner = address(0x3);
    address public investor = address(0x4);
    address public pauser = address(0x5);

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    function setUp() public {
        // Deploy compliance first
        compliance = new PragmaComplianceRegistry(admin);

        // Deploy token implementation
        PragmaAssetToken impl = new PragmaAssetToken();

        // Deploy proxy pointing to implementation, then initialize through proxy
        bytes memory initData = abi.encodeWithSelector(
            PragmaAssetToken.initialize.selector,
            admin,
            address(compliance),
            "https://pragma.xyz/metadata/"
        );
        ERC1967Proxy proxy = new ERC1967Proxy(address(impl), initData);
        token = PragmaAssetToken(address(proxy));

        // Grant roles
        vm.prank(admin);
        token.grantRole(MINTER_ROLE, minter);
        vm.prank(admin);
        token.grantRole(BURNER_ROLE, burner);
        vm.prank(admin);
        token.grantRole(PAUSER_ROLE, pauser);

        // Add investor to compliance
        vm.prank(admin);
        compliance.addInvestor(investor, bytes32("US"), PragmaComplianceRegistry.InvestorTier.Accredited, type(uint256).max);
    }

    function test_InitialState() public view {
        assertEq(address(token.complianceRegistry()), address(compliance));
        assertTrue(token.hasRole(0x00, admin));
        assertTrue(token.hasRole(MINTER_ROLE, minter));
    }

    function test_MintTokens() public {
        vm.prank(minter);
        token.mint(investor, 1, 100, "");

        assertEq(token.balanceOf(investor, 1), 100);
    }

    function test_MintWithoutRole() public {
        vm.prank(investor);
        vm.expectRevert();
        token.mint(investor, 1, 100, "");
    }

    function test_BurnTokens() public {
        vm.prank(minter);
        token.mint(investor, 1, 100, "");

        vm.prank(burner);
        token.burn(investor, 1, 30);

        assertEq(token.balanceOf(investor, 1), 70);
    }

    function test_BurnWithoutRole() public {
        vm.prank(minter);
        token.mint(investor, 1, 100, "");

        vm.prank(investor);
        vm.expectRevert();
        token.burn(investor, 1, 30);
    }

    function test_Pause() public {
        vm.prank(pauser);
        token.pause();

        vm.prank(minter);
        vm.expectRevert();
        token.mint(investor, 1, 100, "");
    }

    function test_Unpause() public {
        vm.prank(pauser);
        token.pause();

        vm.prank(pauser);
        token.unpause();

        vm.prank(minter);
        token.mint(investor, 1, 100, "");
        assertEq(token.balanceOf(investor, 1), 100);
    }

    function test_ComplianceBlocksTransferToNonInvestor() public {
        address nonInvestor = address(0x999);

        vm.prank(minter);
        token.mint(investor, 1, 100, "");

        vm.prank(investor);
        vm.expectRevert("Transfer blocked by compliance: Receiver not KYC approved");
        token.safeTransferFrom(investor, nonInvestor, 1, 10, "");
    }

    function test_TokenURI() public {
        vm.prank(admin);
        token.setTokenURI(1, "https://pragma.xyz/asset/1");

        assertEq(token.uri(1), "https://pragma.xyz/asset/1");
    }

    function test_SupportsInterface() public view {
        assertTrue(token.supportsInterface(0xd9b67a26)); // ERC-1155
        assertTrue(token.supportsInterface(0x7965db0b)); // AccessControl
    }
}