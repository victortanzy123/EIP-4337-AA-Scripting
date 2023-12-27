import { IBundler } from "@biconomy/bundler";
import { ChainId } from "@biconomy/core-types";
import { IPaymaster } from "@biconomy/paymaster";
import { Wallet, providers } from "ethers";

export interface ChainBaseConfig {
  bundlerUrl: string;
  rpcUrl: string;
  chainId: ChainId;
}

export interface ChainFullConfig extends ChainBaseConfig {
  entryPointAddress: string;
  bundler: IBundler;
  paymaster: IPaymaster;
  provider: providers.JsonRpcProvider;
  wallet: Wallet;
}
