import { encodeFunctionData, erc20Abi, maxUint256 } from "viem";
import { dcaReceiverAbi, dcaReceiverAddress } from "./abi";
import { AbiFunction, type Address, Value } from 'ox'

export const tokenAddress = "0xb2F63284AAfAB9f8E422eae4edD5069CcDE435e9";

type Call = {
  to: `0x${string}`;
  data: `0x${string}`;
};

// 1. Approve ERC20 to DCA Savings contract
const approveCall: Call = {
  to: tokenAddress,
  data: AbiFunction.encodeData(AbiFunction.fromAbi(erc20Abi, 'approve'), [dcaReceiverAddress, Value.fromEther('1')])
};

// 2. Transfer call to DCA Savings contract
const transferCall: Call = {
  to: dcaReceiverAddress,
  data: AbiFunction.encodeData(AbiFunction.fromAbi(dcaReceiverAbi, 'deposit'), [tokenAddress, Value.fromEther('1')])
};

export const calls = <const>[approveCall, transferCall]
