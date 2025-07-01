// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25 <0.9.0;

import { Script } from "forge-std/Script.sol";
import { console2 } from "forge-std/console2.sol";

import { DcaReceiver } from "../src/DcaReceiver.sol";

/// @dev See the Solidity Scripting tutorial: https://book.getfoundry.sh/tutorials/solidity-scripting
contract DeployReceiver is Script {

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PK");

        vm.startBroadcast(deployerPrivateKey);

        DcaReceiver receiver = new DcaReceiver();

        vm.stopBroadcast();

        // solhint-disable-next-line no-console
        console2.log("DcaReceiver:", address(receiver));
    }
}
