import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";
import { MIN_DELAY } from "../helper-hardhat-config";

const deployTimeLock: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("Deploying TimeLock");
  const timeLock = await deploy("TimeLock", {
    from: deployer,
    log: true,
    args: [MIN_DELAY, [], []],
    waitConfirmations: 1,
  });
  log(`TimeLock deployed at address: ${timeLock.address}`);
};

export default deployTimeLock;
