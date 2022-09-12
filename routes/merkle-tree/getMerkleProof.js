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
        MerkleLeafData.find({ hexRoot: merkleLeaf.hexRoot }, (error, items) => {
          if (error) {
            res.status(401).json({
              status: false,
              message: "Database error",
              error: error,
            });
            return;
          }

          if (!items) {
            res.status(404).json({
              status: false,
              message: "Merkle Leaves not found",
            });
            return;
          } else {
            const leaves = items.map((item) => {
              return utils.solidityKeccak256(
                ["uint256", "address", "uint256"],
                [item.index, item.accountAddress, item.amount]
              );
            });
            const tree = new MerkleTree(leaves, keccak256);
            const hexBuffer = merkleLeaf.hexBuffer;
            const proof = tree.getProof(hexBuffer);
            const formattedProof = proof.map((proofItem) =>
              buf2Hex(proofItem.data)
            );
            res.status(200).json({
              status: true,
              message: "merkle leaf item found successfully",
              data: {
                index: merkleLeaf.index,
                accountAddress: req.query.accountAddress,
                amount: merkleLeaf.amount,
                hexBuffer,
                hexRoot: merkleLeaf.hexRoot,
                proof: formattedProof,
              },
            });
          }
        });
      }
    }
  );
});

module.exports = getMerkleProofRouter;
