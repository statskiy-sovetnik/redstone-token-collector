// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { MainDemoConsumerBase } from "@redstone-finance/evm-connector/contracts/data-services/MainDemoConsumerBase.sol";


contract RedstoneProviderMock is MainDemoConsumerBase {
    function parsePrice(bytes32 feedId) external view returns (uint256) {
        try this.getPrice(feedId) returns(uint256 value) {
            return value;
        }
        catch {
            return 0;
        }
    } 

    function getPrice(bytes32 feedId) external view returns(uint256) {
        require(msg.sender == address(this), "Unauthorized call");
        return getOracleNumericValueFromTxMsg(feedId);
    }

    function getPriceFromManualPayload(
        bytes32 feedId,
        bytes calldata data
    ) external view returns(uint256) {
        require(msg.sender == address(this), "Unauthorized call");
        return getOracleNumericValueFromTxMsg(feedId);
    }

    function parsePriceWithManualPayload(
        bytes32 feedId,
        bytes calldata data
    ) external view returns(uint256) {
        try this.getPriceFromManualPayload(feedId, data) returns(uint256 value) {
            return value;
        }
        catch {
            return 0;
        }
    }
}