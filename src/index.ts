import { ethers } from "ethers";
import { ChainId } from "@biconomy/core-types";
// Account Creation Module
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules";
import { BiconomySmartAccountV2 } from "@biconomy/account";
import { getChainFullConfig } from "./utils/helper";
import {
  IHybridPaymaster,
  PaymasterMode,
  SponsorUserOperationDto,
} from "@biconomy/paymaster";

async function createAccount(chainId: ChainId) {
  const { wallet, bundler, paymaster, entryPointAddress } =
    getChainFullConfig(chainId);
  const module = await ECDSAOwnershipValidationModule.create({
    signer: wallet,
    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
  });

  let biconomySmartAccount = await BiconomySmartAccountV2.create({
    chainId: ChainId.POLYGON_MUMBAI,
    bundler,
    paymaster,
    entryPointAddress,
    defaultValidationModule: module,
    activeValidationModule: module,
  });
  console.log(
    "Account Created @address: ",
    await biconomySmartAccount.getAccountAddress()
  );
  return biconomySmartAccount;
}

async function getSmartAccount(
  chainId: ChainId
): Promise<BiconomySmartAccountV2> {
  const { wallet, bundler, paymaster, entryPointAddress } =
    getChainFullConfig(chainId);

  const ownerShipModule = await ECDSAOwnershipValidationModule.create({
    signer: wallet,
    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
  });
  return await BiconomySmartAccountV2.create({
    chainId: ChainId.POLYGON_MUMBAI, //or any chain of your choice
    bundler, // instance of bundler
    paymaster, // instance of paymaster
    entryPointAddress, //entry point address for chain
    defaultValidationModule: ownerShipModule, // either ECDSA or Multi chain to start
    activeValidationModule: ownerShipModule, // either ECDSA or Multi chain to start
  });
}

// Test Transaction Creation without Paymaster:
async function createTransaction() {
  const smartAccount = await createAccount(ChainId.POLYGON_MUMBAI);
  try {
    const transaction = {
      to: "0x322Af0da66D00be980C7aa006377FCaaEee3BDFD",
      data: "0x",
      value: ethers.utils.parseEther("0.01"),
    };

    const userOp = await smartAccount.buildUserOp([transaction]);
    userOp.paymasterAndData = "0x";

    const userOpResponse = await smartAccount.sendUserOp(userOp);

    const transactionDetail = await userOpResponse.wait();

    console.log("transaction detail below");
    console.log(
      `https://mumbai.polygonscan.com/tx/${transactionDetail.receipt.transactionHash}`
    );
  } catch (error) {
    console.log(error);
  }
}

// Sponsored Transaction Creation
async function createSponsoredTransaction() {
  const smartAccount = await createAccount(ChainId.POLYGON_MUMBAI);
  const address = await smartAccount.getAccountAddress();
  const nftInterface = new ethers.utils.Interface([
    "function safeMint(address _to)",
  ]);

  const data = nftInterface.encodeFunctionData("safeMint", [address]);

  const nftAddress = "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e";

  const transaction = {
    to: nftAddress,
    data: data,
  };

  const partialUserOps = await smartAccount.buildUserOp([transaction], {
    paymasterServiceData: {
      mode: PaymasterMode.SPONSORED,
    },
  });
  const biconomyPaymaster =
    smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;

  try {
    const userOpResponse = await smartAccount.sendUserOp(partialUserOps);
    const transactionDetail = await userOpResponse.wait();

    console.log("transaction detail below");
    console.log(
      `https://mumbai.polygonscan.com/tx/${transactionDetail.receipt.transactionHash}`
    );
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  console.log("Creating userOps Transaction on Polygon Mumbai Testnet...");
  try {
    await createSponsoredTransaction();
  } catch (error) {
    console.log("ERROR:", error);
  }
}

main();
