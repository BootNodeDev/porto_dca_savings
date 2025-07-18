import { Call, erc20Abi } from "viem";
import { dcaReceiverAbi, dcaReceiverAddress } from "./abi";
import { AbiFunction, Value } from 'ox'
import { TOKEN_ADDRESS } from "../contracts/permissions";

// 1. Approve ERC20 to DCA Savings contract
const approveCall: Call = {
  to: TOKEN_ADDRESS,
  data: AbiFunction.encodeData(AbiFunction.fromAbi(erc20Abi, 'approve'), [dcaReceiverAddress, Value.fromEther('1')])
};

// 2. Transfer call to DCA Savings contract
const transferCall: Call = {
  to: dcaReceiverAddress,
  data: AbiFunction.encodeData(AbiFunction.fromAbi(dcaReceiverAbi, 'deposit'), [TOKEN_ADDRESS, Value.fromEther('1')])
};

export const calls = <const>[approveCall, transferCall]
