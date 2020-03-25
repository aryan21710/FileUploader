const express = require("express");
require("dotenv").config();

const app = express();
const path = require("path");
const port = process.env.PORT || 4444;
console.log('process.env.PORT',process.env.PORT);
const publicPath = path.join(__dirname, "..", "public/build");
// eslint-disable-next-line no-console
console.log("publicpath", publicPath);
app.use(express.static(publicPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`SERVER IS LISTENING ON PORT ${port}`);
});
