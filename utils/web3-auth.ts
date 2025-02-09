import { CHAIN_NAMESPACES, IProvider, UX_MODE, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from "@web3auth/base";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const clientId =
  "BIDKZ3f2QOYeATbQ-6K3z9MT836zvCzLf0mh35ZB930bQpzcl4w6KJ--okRFMr7vxL5XBxK38I6nsyVIFrri3P8";

  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "656476", // hex of 137, polygon mainnet
    rpcTarget: "https://rpc.open-campus-codex.gelato.digital",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Open Campus Codex Testnet",
    blockExplorerUrl: "https://edu-chain-testnet.blockscout.com/",
    ticker: "EDU",
    tickerName: "Edu Chain Open Campus",
  };

  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig: chainConfig },
  });

  export const web3auth = new Web3Auth({
    // Get it from Web3Auth Dashboard
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
    privateKeyProvider,
  });





