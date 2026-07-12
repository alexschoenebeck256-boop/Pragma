// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Test} from "forge-std/Test.sol";
import {PragmaFeeDistributor} from "../src/PragmaFeeDistributor.sol";

contract PragmaFeeDistributorTest is Test {
    PragmaFeeDistributor public feeDistributor;

    address public admin = address(0x1);
    address public feeCollector = address(0x2);
    address public treasury = address(0x3);

    bytes32 public constant FEE_COLLECTOR_ROLE = keccak256("FEE_COLLECTOR_ROLE");

    function setUp() public {
        feeDistributor = new PragmaFeeDistributor(admin, treasury);

        vm.prank(admin);
        feeDistributor.grantRole(FEE_COLLECTOR_ROLE, feeCollector);

        vm.prank(admin);
        feeDistributor.setFeeRates(100, 25, 50, 0);
    }

    function test_InitialState() public view {
        assertEq(feeDistributor.treasury(), treasury);
        assertEq(feeDistributor.totalFeesCollected(), 0);
    }

    function test_CollectIssuanceFee() public {
        // Give feeCollector ETH, then prank as them
        vm.deal(feeCollector, 1 ether);
        vm.startPrank(feeCollector);
        feeDistributor.collectIssuanceFee{value: 1 ether}(1, 100 ether);
        vm.stopPrank();

        assertEq(feeDistributor.totalFeesCollected(), 1 ether);
        assertEq(feeDistributor.feesPerAsset(1), 1 ether);
    }

    function test_CollectTradingFee() public {
        vm.deal(feeCollector, 0.25 ether);
        vm.startPrank(feeCollector);
        feeDistributor.collectTradingFee{value: 0.25 ether}(1, 1, 100 ether);
        vm.stopPrank();

        assertEq(feeDistributor.totalFeesCollected(), 0.25 ether);
        assertEq(feeDistributor.feesPerAsset(1), 0.25 ether);
    }

    function test_DistributeToTreasury() public {
        vm.deal(feeCollector, 1 ether);
        vm.startPrank(feeCollector);
        feeDistributor.collectIssuanceFee{value: 1 ether}(1, 100 ether);
        vm.stopPrank();

        uint256 treasuryBefore = address(treasury).balance;
        feeDistributor.distributeToTreasury();

        uint256 treasuryAfter = address(treasury).balance;
        assertEq(treasuryAfter - treasuryBefore, 1 ether);
        assertEq(address(feeDistributor).balance, 0);
    }

    function test_DistributeAssetFees() public {
        vm.deal(feeCollector, 0.5 ether);
        vm.startPrank(feeCollector);
        feeDistributor.collectIssuanceFee{value: 0.5 ether}(1, 50 ether);
        vm.stopPrank();

        uint256 treasuryBefore = address(treasury).balance;

        vm.prank(admin);
        feeDistributor.distributeAssetFees(1);

        uint256 treasuryAfter = address(treasury).balance;
        assertEq(treasuryAfter - treasuryBefore, 0.5 ether);
        assertEq(feeDistributor.feesPerAsset(1), 0);
    }

    function test_SetFeeRates() public {
        vm.prank(admin);
        feeDistributor.setFeeRates(50, 10, 20, 0);

        (uint256 issuanceBps,,,) = feeDistributor.feeRates();
        assertEq(issuanceBps, 50);
    }

    function test_SetFeeRatesTooHigh() public {
        vm.prank(admin);
        vm.expectRevert("Issuance too high");
        feeDistributor.setFeeRates(2000, 25, 50, 0);
    }

    function test_SetTreasury() public {
        address newTreasury = address(0x999);

        vm.prank(admin);
        feeDistributor.setTreasury(newTreasury);

        assertEq(feeDistributor.treasury(), newTreasury);
    }

    function test_NonFeeCollectorCannotCollect() public {
        vm.deal(treasury, 0.1 ether);
        vm.startPrank(treasury);
        vm.expectRevert();
        feeDistributor.collectIssuanceFee{value: 0.1 ether}(1, 10 ether);
        vm.stopPrank();
    }
}