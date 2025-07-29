import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaEthereum } from "react-icons/fa";

function Header() {
  return (
    <header className=" flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-500 to-indigo-900 text-orange shadow-lg">
      <div className="flex items-center gap-3 text-2xl font-bold tracking-tight">
        <FaEthereum className="text-indigo-300 drop-shadow-md" size={28} />
        <span className="hover:text-indigo-100 transition-colors duration-200">
          Web3 DApp
        </span>
      </div>
      <div className="flex items-center">
        <ConnectButton />
      </div>
    </header>
  );
}

export default Header;
