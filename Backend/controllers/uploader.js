const express = require("express");
const app = express();
const file_collection = require("./../models/file_uploader");
app.use(express.json());
var aws = require("aws-sdk");
var bodyParser = require("body-parser");
const multer = require("multer");
const moment = require("moment");
const multerS3 = require("multer-s3");
// require("dotenv/config");

aws.config.update({
  secretAccessKey: "KfdbC4/X1MgT2MWuMjyqFzVDuczcyOzp2h9hhMXm",
  accessKeyId: "AKIAXRCVM64D2RC7K6SQ",
  region: "ap-south-1",
});
var name;
var s3 = new aws.S3();
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "hacksummit",
    key: function (req, file, cb) {
      console.log(file);
      name = file.originalname;
      // console.log(name);
      cb(null, file.originalname);
    },
  }),
});

app.post("/file", upload.array("file", 1), async function (req, res, next) {
  //   console.log(file);

  try {
    name = name.replace(/ /g, "+");
    // console.log(file);
    var file_url = `https://hacksummit.s3.ap-south-1.amazonaws.com/${name}`;
    console.log(file_url);
    res.status(200).json({
      file_upload_status: "success",
      file_url,
    });
    console.log("sucees");
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

module.exports = app;
