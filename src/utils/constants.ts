import { config } from "dotenv";
import { ChainFullConfig } from "./types";
import { ChainId } from "@biconomy/core-types";
import { ethers } from "ethers";
import { RPC_PROVIDER_URLS } from "@biconomy/common";
config();

export const PRIVATE_KEY = process.env.PRIVATE_KEY;
const BICONOMY_CODE = process.env.BICONOMY_CODE;
const BICONOMY_PAYMASTER_API_KEY = process.env.BICONOMY_PAYMASTER_API_KEY;

export const ZERO_ADDRESS: string =
  "0x0000000000000000000000000000000000000000";

export const BICONOMY_BUNDLER_URL = (chainId: ChainId): string => {
  return `https://bundler.biconomy.io/api/v2/${chainId}/${BICONOMY_CODE}`;
};

export const BICONOMY_PAYMASTER_URL = (chainId: ChainId): string => {
  return `https://paymaster.biconomy.io/api/v1/${chainId}/${BICONOMY_PAYMASTER_API_KEY}`;
};
