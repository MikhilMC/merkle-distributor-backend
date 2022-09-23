const express = require("express");
const getMerkleProofRouterV1 = express.Router();

const MerkleLeafDataV1 = require("../../model/MerkleLeafModelV1");

getMerkleProofRouterV1.get("/", (req, res) => {
  MerkleLeafDataV1.findOne(
    { accountAddress: req.query.accountAddress, hexRoot: req.query.hexRoot },
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

module.exports = getMerkleProofRouterV1;
