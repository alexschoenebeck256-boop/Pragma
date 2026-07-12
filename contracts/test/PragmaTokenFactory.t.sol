// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Test} from "forge-std/Test.sol";
import {PragmaTokenFactory} from "../src/PragmaTokenFactory.sol";
import {PragmaAssetToken} from "../src/PragmaAssetToken.sol";
import {PragmaComplianceRegistry} from "../src/PragmaComplianceRegistry.sol";

contract PragmaTokenFactoryTest is Test {
    PragmaTokenFactory public factory;
    PragmaComplianceRegistry public compliance;
    PragmaAssetToken public implementation;

    address public admin = address(0x1);
    address public factoryAdmin = address(0x2);
    address public treasury = address(0x4);

    bytes32 public constant FACTORY_ADMIN_ROLE = keccak256("FACTORY_ADMIN_ROLE");

    function setUp() public {
        compliance = new PragmaComplianceRegistry(admin);
        implementation = new PragmaAssetToken();

        factory = new PragmaTokenFactory(admin, address(implementation), address(compliance), treasury);

        vm.prank(admin);
        factory.grantRole(FACTORY_ADMIN_ROLE, factoryAdmin);
    }

    function test_InitialState() public view {
        assertEq(factory.assetTokenImplementation(), address(implementation));
        assertEq(factory.defaultComplianceRegistry(), address(compliance));
        assertEq(factory.assetCount(), 0);
    }

    function test_CreateAssetToken() public {
        bytes32 salt = keccak256("asset-1");

        address tokenContract = factory.createAssetToken(salt);

        assertEq(factory.assetCount(), 1);

        (uint256 assetId, address tokenAddr, address issuer) = factory.assets(1);
        assertEq(assetId, 1);
        assertEq(tokenAddr, tokenContract);
        assertEq(issuer, address(this));

        // Verify it's a deployed contract (has code)
        assertTrue(tokenContract.code.length > 0);
    }

    function test_CreateMultipleTokens() public {
        bytes32 salt1 = keccak256("asset-1");
        bytes32 salt2 = keccak256("asset-2");

        address token1 = factory.createAssetToken(salt1);
        address token2 = factory.createAssetToken(salt2);

        assertTrue(token1 != token2);
        assertEq(factory.assetCount(), 2);
    }

    function test_SetImplementation() public {
        PragmaAssetToken newImpl = new PragmaAssetToken();

        vm.prank(admin);
        factory.setImplementation(address(newImpl));

        assertEq(factory.assetTokenImplementation(), address(newImpl));
    }

    function test_SetImplementationNonAdmin() public {
        PragmaAssetToken newImpl = new PragmaAssetToken();

        vm.prank(address(0x999));
        vm.expectRevert();
        factory.setImplementation(address(newImpl));
    }

    function test_SetIssuanceFee() public {
        vm.prank(factoryAdmin);
        factory.setIssuanceFeeBps(100);

        assertEq(factory.issuanceFeeBps(), 100);
    }

    function test_SetDefaultCompliance() public {
        PragmaComplianceRegistry newCompliance = new PragmaComplianceRegistry(admin);

        vm.prank(admin);
        factory.setDefaultCompliance(address(newCompliance));

        assertEq(factory.defaultComplianceRegistry(), address(newCompliance));
    }
}