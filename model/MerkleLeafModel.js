const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MerkleLeafSchema = new Schema({
  index: { type: Number },
  accountAddress: { type: String },
  amount: { type: String },
  hexBuffer: { type: String },
  hexRoot: { type: String },
});

module.exports = mongoose.model("merkleLeaf", MerkleLeafSchema, "merkleLeaf");
