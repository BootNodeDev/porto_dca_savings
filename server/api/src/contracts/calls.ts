import { encodeFunctionData, erc20Abi, maxUint256 } from "viem";
import { dcaReceiverAbi, dcaReceiverAddress } from "./abi";

const tokenAddress = "0xb2F63284AAfAB9f8E422eae4edD5069CcDE435e9";

type Call = {
  to: `0x${string}`;
  data: `0x${string}`;
};

// 1. Approve ERC20 to DCA Savings contract
const approveCall: Call = {
  to: tokenAddress,
  data: encodeFunctionData({ abi: erc20Abi, functionName: 'approve', args: [dcaReceiverAddress, maxUint256] })
};

// 2. Transfer call to DCA Savings contract
const transferCall: Call = {
  to: dcaReceiverAddress,
  data: encodeFunctionData({ abi: dcaReceiverAbi, functionName: 'deposit', args: [tokenAddress, 1n] })
};

export const calls = <const>[approveCall, transferCall]
