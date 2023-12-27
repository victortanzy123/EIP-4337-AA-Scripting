import { ChainId } from "@biconomy/core-types";
import { getChainFullConfig } from "../utils/helper";
import { ChainFullConfig } from "../utils/types";

export const TESTNET_POLYGON_MUMBAI_CHAIN_CONFIG: ChainFullConfig =
  getChainFullConfig(ChainId.POLYGON_MUMBAI);

