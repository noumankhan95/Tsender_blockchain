"use client";

import React from "react";
import { InputForm } from "./ui/InputField";
import { chainsToTSender, tsenderAbi, erc20Abi } from "../constants";
import { useAccount, useChainId } from "wagmi";
import { readContract } from "@wagmi/core";
import getDefaultConfig from "@/app/rainbowKitConfig";
function AirdropForm() {
  const [tokenAddress, setTokenAddress] = React.useState("");
  const [recepients, setrecepients] = React.useState("");
  const [amounts, setamounts] = React.useState("");
  const chainId = useChainId();
  const account = useAccount();
  const handleSubmit = async () => {
    const tsenderAddress = chainsToTSender[chainId]["tsender"];
    const approvedAmount = await getApprovedAmount(tsenderAddress);
    console.log(approvedAmount);
  };

  async function getApprovedAmount(
    tsenderAddress: string | null
  ): Promise<number> {
    if (!tsenderAddress) {
      alert("Please use valid chain");
      return 0;
    }
    const allowanceResult = await readContract(getDefaultConfig, {
      abi: erc20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: "allowance",
      args: [account.address, tsenderAddress as `0x${string}`],
    });
    return allowanceResult as number;
  }
  return (
    <div>
      <InputForm
        label="Token Address"
        placeholder="0x"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />
      <InputForm
        label="recepients"
        placeholder="0x123,0x456,..."
        value={recepients}
        onChange={(e) => setrecepients(e.target.value)}
        large
      />
      <InputForm
        label="amounts"
        placeholder="100,200,300..."
        value={amounts}
        onChange={(e) => setamounts(e.target.value)}
        large
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default AirdropForm;
