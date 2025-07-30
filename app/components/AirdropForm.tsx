"use client";

import React from "react";
import { InputForm } from "./ui/InputField";
import { chainsToTSender, tsenderAbi, erc20Abi } from "../constants";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import getDefaultConfig from "@/app/rainbowKitConfig";
import { calculateTotal } from "./util/calculateTotal";

function AirdropForm() {
  const [tokenAddress, setTokenAddress] = React.useState("");
  const [recepients, setrecepients] = React.useState("");
  const [amounts, setamounts] = React.useState("");
  const [loading, setLoading] = React.useState(false); 

  const total: number = React.useMemo(() => calculateTotal(amounts), [amounts]);

  const chainId = useChainId();
  const account = useAccount();
  const { writeContractAsync } = useWriteContract();

  const handleSubmit = async () => {
    setLoading(true); 

    try {
      const tsenderAddress = chainsToTSender[chainId]["tsender"];
      const approvedAmount = await getApprovedAmount(tsenderAddress);

      if (approvedAmount < total) {
        const approvalHash = await writeContractAsync({
          abi: erc20Abi,
          address: tokenAddress as `0x${string}`,
          functionName: "approve",
          args: [tsenderAddress as `0x${string}`, BigInt(total)],
        });

        await waitForTransactionReceipt(getDefaultConfig, {
          hash: approvalHash,
        });
      }

      await writeContractAsync({
        abi: tsenderAbi,
        address: tsenderAddress as `0x${string}`,
        functionName: "airdropERC20",
        args: [
          tokenAddress,
          recepients
            .split(/[,\n]+/)
            .map((addr) => addr.trim())
            .filter(Boolean),
          amounts
            .split(/[,\n]+/)
            .map((amt) => amt.trim())
            .filter(Boolean),
          BigInt(total),
        ],
      });
    } catch (err) {
      console.error("Transaction failed:", err);
    } finally {
      setLoading(false); // 🆕 stop spinner
    }
  };

  async function getApprovedAmount(
    tsenderAddress: string | null
  ): Promise<number> {
    if (!tsenderAddress) {
      alert("Please use a valid chain");
      return 0;
    }
    const allowanceResult = await readContract(getDefaultConfig, {
      abi: erc20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: "allowance",
      args: [account.address, tsenderAddress as `0x${string}`],
    });
    return Number(allowanceResult);
  }

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-gray-200">
      <h2 className="text-2xl font-semibold text-indigo-600 text-center">
        ERC20 Airdrop
      </h2>

      <InputForm
        label="Token Address"
        placeholder="0x..."
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />
      <InputForm
        label="Recipients"
        placeholder="0x123,0x456,..."
        value={recepients}
        onChange={(e) => setrecepients(e.target.value)}
        large
      />
      <InputForm
        label="Amounts"
        placeholder="100,200,300..."
        value={amounts}
        onChange={(e) => setamounts(e.target.value)}
        large
      />
      <div className="text-right text-gray-600">Total: {total}</div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full flex justify-center items-center gap-2 ${
          loading
            ? "bg-indigo-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        } text-white font-medium py-2 px-4 rounded-xl transition duration-300`}
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {loading ? "Processing..." : "Submit"}
      </button>
    </div>
  );
}

export default AirdropForm;
