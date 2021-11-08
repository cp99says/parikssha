const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://sd2001:sddb@cluster0.ck7q8.mongodb.net/Hacksummit_DB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log(`connected to mongoDB atlas`);
  }
);

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send({
    success: true,
    _msg: "successfully running",
  });
});

const api = require("./controllers/uploader");
const routes = require("./routes/routes");
app.use("/api", routes);
app.use("/upload", api);
const PORT = 4500;
app.listen(PORT, () => {
  console.log(`server started at PORT ${PORT}`);
});
