import { ChainId } from "@biconomy/core-types";
import { RPC_PROVIDER_URLS } from "@biconomy/common";
import { ethers } from "ethers";
import { BICONOMY_BUNDLER_URL, PRIVATE_KEY } from "./constants";
import { ChainFullConfig } from "./types";
import { Bundler, IBundler } from "@biconomy/bundler";
import { IPaymaster } from "@biconomy/paymaster";
import { DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";
import { getPaymaster } from "./paymaster";

// Chain Configs
export const getChainFullConfig = (
  chainId: ChainId,
  entryPointAddress = DEFAULT_ENTRYPOINT_ADDRESS
): ChainFullConfig => {
  const rpcUrl = RPC_PROVIDER_URLS[ChainId.POLYGON_MUMBAI]!;
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const bundler: IBundler = new Bundler({
    bundlerUrl: BICONOMY_BUNDLER_URL(chainId),
    chainId,
    entryPointAddress,
  });
  const paymaster: IPaymaster = getPaymaster(ChainId.POLYGON_MUMBAI);
  return {
    bundler,
    paymaster,
    bundlerUrl: BICONOMY_BUNDLER_URL(ChainId.POLYGON_MUMBAI),
    rpcUrl,
    entryPointAddress,
    chainId: ChainId.POLYGON_MUMBAI,
    provider,
    wallet: new ethers.Wallet(PRIVATE_KEY || "", provider),
  };
};
