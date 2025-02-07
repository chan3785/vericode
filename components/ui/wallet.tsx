"use client";

import {
  CHAIN_NAMESPACES,
  IProvider,
  UX_MODE,
  WALLET_ADAPTERS,
  WEB3AUTH_NETWORK,
} from "@web3auth/base";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { ellipsisAddress } from "@/utils/strings";
import RPC from "../../types/polkadotRPC";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { AuthAdapter } from "@web3auth/auth-adapter";

export const Wallet: React.FC = () => {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();
  const clientId =
    "BNq8a519TbPEoqb9ZzRf60YangjoXuSjfpez0VBDrfgVWXLuzM68AsWhm_VGhtBfoXciLTFw4BfE7_ocOKYPprI";

  useEffect(() => {
    const init = async () => {
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.OTHER,
          chainId: "420420421",
          rpcTarget: "https://westend-asset-hub-eth-rpc.polkadot.io",
          displayName: "Polkadot Testnet",
          blockExplorerUrl: "https://explorer.polkascan.io/",
          ticker: "WND",
          tickerName: "Polkadot",
          logo: "",
        };

        const privateKeyProvider = new CommonPrivateKeyProvider({
          config: { chainConfig },
        });

        const web3authInstance = new Web3AuthNoModal({
          clientId,
          privateKeyProvider,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
        });

        const authAdapter = new AuthAdapter({
          adapterSettings: {
            uxMode: UX_MODE.REDIRECT,
          },
        });
        web3authInstance.configureAdapter(authAdapter);

        setWeb3auth(web3authInstance);

        await web3authInstance.init();

        setProvider(web3authInstance.provider);
        if (web3authInstance.connectedAdapterName) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "google",
    });
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log(user);
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  useEffect(() => {
    const getAccounts = async () => {
      if (!provider) {
        console.log("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider);
      const address = await rpc.getAccounts();
      console.log(address);
      setAccount(address);

      const Balance = await rpc.getBalance();
      setBalance(Balance.data.free);
      console.log(Balance.data.free);
    };
    if (loggedIn) {
      getAccounts();
    }
  }, [loggedIn]);

  return (
    <>
      {loggedIn && account ? (
        <Button
          onClick={() => {
            logout();
          }}
        >
          {ellipsisAddress(account)} ( {balance} EDU )
        </Button>
      ) : (
        <Button
          onClick={() => {
            login();
          }}
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
};
