const express = require("express");
const getMerkleProofRouter = express.Router();
const { utils } = require("ethers");
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");

const MerkleLeafData = require("../../model/MerkleLeafModel");

const buf2Hex = (x) => "0x" + x.toString("hex");

getMerkleProofRouter.get("/", (req, res) => {
  MerkleLeafData.findOne(
    { accountAddress: req.query.accountAddress },
    (error, merkleLeaf) => {
      if (error) {
        res.status(401).json({
          status: false,
          message: "Database error",
          error: error,
        });
        return;
      }

      if (!merkleLeaf) {
        res.status(404).json({
          status: false,
          message: "Account not available for airdrop",
        });
        return;
      } else {
        res.status(200).json({
          status: true,
          message: "merkle leaf item found successfully",
          data: {
            index: merkleLeaf.index,
            accountAddress: req.query.accountAddress,
            amount: merkleLeaf.amount,
            hexBuffer: merkleLeaf.hexBuffer,
            hexRoot: merkleLeaf.hexRoot,
            proof: merkleLeaf.proof,
          },
        });
      }
    }
  );
});

module.exports = getMerkleProofRouter;
