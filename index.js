const express = require("express");
const app = express();
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const mongoose = require("mongoose");
const cors = require("cors");
var cron = require("node-cron");

const port = 8000;

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(__dirname + "/Routes");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(connectLivereload());
app.use(cors());

mongoose
  // .connect("mongodb://localhost/my_database", {
  .connect(
    "mongodb+srv://cyberstar:Fighting@cluster0.ox1nvmy.mongodb.net/rbetrage",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const rootRouter = require("./routes");
const { getScrappingProducts } = require("./controllers/product/scrappingController");

app.use("/api", rootRouter);

cron.schedule("0 */12 * * * *", getScrappingProducts);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
