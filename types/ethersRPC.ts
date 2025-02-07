/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { IProvider } from "@web3auth/base";

export default class PolkadotRPC {
  private provider: IProvider;

  constructor(provider: IProvider) {
    this.provider = provider;
  }

  makeClient = async (): Promise<any> => {
    // Rococo is a testnet in the Polkadot ecosystem
    console.log("Establishing connection to Rococo Relay Chain RPC...");
    const provider = new WsProvider("wss://rococo-rpc.polkadot.io"); // roccoco testnet relay chain
    // const provider = new WsProvider("wss://rpc.polkadot.io"); // Polkadot mainnet relay chain
    const api = await ApiPromise.create({ provider });
    const resp = await api.isReady;
    console.log("Polkadot RPC is ready", resp);
    return api;
  };

  getPolkadotKeyPair = async (): Promise<any> => {
    await cryptoWaitReady();
    const privateKey = (await this.provider.request({
      method: "private_key",
    })) as string;
    console.log("privateKey", `0x${privateKey}`);
    const keyring = new Keyring({ ss58Format: 42, type: "sr25519" });

    const keyPair = keyring.addFromUri(`0x${privateKey}`);
    console.log("keyPair", keyPair);
    return keyPair;
  };

  getAccounts = async (): Promise<any> => {
    const keyPair = await this.getPolkadotKeyPair();
    return keyPair.address;
  };

  getBalance = async (): Promise<any> => {
    const keyPair = await this.getPolkadotKeyPair();
    const api = await this.makeClient();
    const data = await api.query.system.account(keyPair.address);
    console.log(data);
    return data.toHuman();
  };

  signAndSendTransaction = async (): Promise<any> => {
    try {
      const keyPair = await this.getPolkadotKeyPair();
      const api = await this.makeClient();
      const txHash = await api.tx.balances.transferKeepAlive("5Gzhnn1MsDUjMi7S4cN41CfggEVzSyM58LkTYPFJY3wt7o3d", 12345).signAndSend(keyPair);
      console.log(txHash);
      return txHash.toHuman();
    } catch (err: any) {
      return err.toString();
    }
  };
}