import { CHAIN_NAMESPACES, IProvider, UX_MODE, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from "@web3auth/base";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { useEffect, useState } from "react";

const clientId =
  "BIDKZ3f2QOYeATbQ-6K3z9MT836zvCzLf0mh35ZB930bQpzcl4w6KJ--okRFMr7vxL5XBxK38I6nsyVIFrri3P8";

  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.OTHER,
    chainId: "Polkadot",
    rpcTarget: "https://rpc.polkadot.io/",
    displayName: "Polkadot Mainnet",
    blockExplorerUrl: "https://explorer.polkascan.io/",
    ticker: "DOT",
    tickerName: "Polkadot",
    logo: ""
  };

const privateKeyProvider = new CommonPrivateKeyProvider({ config: { chainConfig } });

export const web3authInstance = new Web3AuthNoModal({
  clientId,
  privateKeyProvider,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
});

export const authAdapter = new AuthAdapter({
  adapterSettings: {
    uxMode: UX_MODE.REDIRECT,
  },
});

web3authInstance.configureAdapter(authAdapter);




