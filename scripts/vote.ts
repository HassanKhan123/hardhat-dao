import * as fs from "fs";
//@ts-ignore
import { network, ethers } from "hardhat";

import {
  developmentChains,
  proposalsFile,
  VOTING_DELAY,
  VOTING_PERIOD,
} from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-blocks";

const main = async (proposalIndex: number) => {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  const proposalId =
    proposals[network.config.chainId!.toString()][proposalIndex];

  const voteWay = 1;
  const governor = await ethers.getContract("GovernorContract");
  const voteTxResponse = await governor.castVoteWithReason(
    proposalId,
    voteWay,
    "I like this proposal"
  );
  await voteTxResponse.wait(1);
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
  console.log("Voted!!");
};

main(0)
  .then(() => process.exit(0))
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
