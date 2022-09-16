const express = require("express");
const createMerkleRouter = express.Router();
const { utils } = require("ethers");
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");

const MerkleLeafData = require("../../model/MerkleLeafModel");
const ACCOUNTS_DATA = require("./accountsData");

const buf2Hex = (x) => "0x" + x.toString("hex");

createMerkleRouter.post("/", (req, res) => {
  let leavesArray = [];
  const leaves = ACCOUNTS_DATA.map((account, index) => {
    leavesArray.push({
      index,
      accountAddress: account,
      amount: "50000000000000000000",
      hexBuffer: utils.solidityKeccak256(
        ["uint256", "address", "uint256"],
        [index, account, "50000000000000000000"]
      ),
    });
    return utils.solidityKeccak256(
      ["uint256", "address", "uint256"],
      [index, account, "50000000000000000000"]
    );
  });
  // console.log(leavesArray);
  // console.log(leaves);
  const tree = new MerkleTree(leaves, keccak256);
  const hexRoot = buf2Hex(tree.getRoot());
  leavesArray = leavesArray.map((leaf) => {
    let hexProof = tree
      .getProof(leaf.hexBuffer)
      .map((item) => buf2Hex(item.data));
    return { ...leaf, hexRoot, proof: hexProof };
  });
  // console.log(leavesArray);
  MerkleLeafData.insertMany(leavesArray, (error, docs) => {
    if (error) {
      res.status(401).json({
        status: false,
        message: "Inserting error",
        error: error,
      });
      return;
    }
    res.status(200).json({
      status: true,
      message: "Inserting successful",
      docs: docs,
    });
  });
});

module.exports = createMerkleRouter;
