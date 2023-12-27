import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import { BICONOMY_PAYMASTER_URL } from "./constants";
import { ChainId } from "@biconomy/core-types";

export function getPaymaster(chainId: ChainId): IPaymaster {
  const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl: BICONOMY_PAYMASTER_URL(chainId),
  });
  return paymaster;
}
