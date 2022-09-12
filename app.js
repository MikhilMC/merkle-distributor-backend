var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
// const createMerkleTreeRouter = require("./routes/merkle-tree/createMerkleTree");
const getMerkleProofRouter = require("./routes/merkle-tree/getMerkleProof");

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
// app.use("/create-merkle-tree", createMerkleTreeRouter);
app.use("/get-merkle-proof", getMerkleProofRouter);

module.exports = app;
