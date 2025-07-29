"use client";

import React from "react";
import { InputForm } from "./ui/InputField";

function AirdropForm() {
  const [tokenAddress, setTokenAddress] = React.useState("");
  return (
    <div>
      <InputForm
        label="Token Address"
        placeholder="0x"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />
    </div>
  );
}

export default AirdropForm;
