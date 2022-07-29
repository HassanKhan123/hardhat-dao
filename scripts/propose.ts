//@ts-ignore
import { ethers, network } from "hardhat";
import * as fs from "fs";
import {
  developmentChains,
  FUNC,
  NEW_STORE_VALUE,
  proposalsFile,
  PROPOSAL_DESCRIPTION,
  VOTING_DELAY,
} from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-blocks";

export const propse = async (
  args: any[],
  functionToCall: string,
  proposalDescription: string
) => {
  const governor = await ethers.getContract("GovernorContract");
  const box = await ethers.getContract("Box");

  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  );

  console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`);
  console.log(`Proposal Description: \n ${proposalDescription}`);
  const propseTx = await governor.propose(
    [box.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  );
  const propseReceipt = await propseTx.wait();

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1);
  }

  const proposalId = propseReceipt.events[0].args.proposalId;
  let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  if (proposals[network.config.chainId!.toString()]) {
    proposals[network.config.chainId!.toString()].push(proposalId.toString());
  } else {
    proposals[network.config.chainId!.toString()] = [proposalId.toString()];
  }
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals));
};

propse([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
