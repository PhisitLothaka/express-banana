require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const authRoute = require("./router/auth-rout");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/auth", authRoute);

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log("server on port", PORT);
});
