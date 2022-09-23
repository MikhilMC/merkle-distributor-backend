var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
// const createMerkleTreeRouterV1 = require("./routes/merkle-tree/createMerkleTreeV1");
// const createMerkleTreeRouterV2 = require("./routes/merkle-tree/createMerkleTreeV2");
// const createMerkleTreeRouterV3 = require("./routes/merkle-tree/createMerkleTreeV3");
const getMerkleProofRouterV1 = require("./routes/merkle-tree/getMerkleProofV1");
const getMerkleProofRouterV2 = require("./routes/merkle-tree/getMerkleProofV2");
const getMerkleProofRouterV3 = require("./routes/merkle-tree/getMerkleProofV3");

mongoose.connect(
  "mongodb+srv://merkle:KsxwuJ0TDD5MEXFb@cluster0.xhgbit9.mongodb.net/?retryWrites=true&w=majority",
  {},
  (error) => {
    if (error) {
      console.log(err);
    } else {
      console.log("Connected to MongoDB.");
    }
  }
);

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
// app.use("/create-merkle-tree-v1", createMerkleTreeRouterV1);
// app.use("/create-merkle-tree-v2", createMerkleTreeRouterV2);
// app.use("/create-merkle-tree-v3", createMerkleTreeRouterV3);
app.use("/get-merkle-proof-v1", getMerkleProofRouterV1);
app.use("/get-merkle-proof-v2", getMerkleProofRouterV2);
app.use("/get-merkle-proof-v3", getMerkleProofRouterV3);

module.exports = app;
