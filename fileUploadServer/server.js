const express = require("express");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");

const app = express();
const path = require("path");
const cors = require("cors");
const port = 9001;
const publicPath = path.join(__dirname, "..", "client", "public");
// eslint-disable-next-line no-console
console.log("publicpath", publicPath);
app.use(cors());
app.use(fileUpload());
app.use(morgan("dev"));

app.post("/uploads", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "NO FILE UPLOADED" });
  }



  const filename = [],
    filepath = [];
  if (Object.keys(req.files.file).includes("name")) {
    const file = req.files.file;
    filename.push(file.name);
    filepath.push(`/uploads/${file.name}`);
    file.mv(`${publicPath}/uploads/${file.name}`, err => {
      if (err) {
        console.log("err while moving the file to different directory", err);
        return res.status(500).send(err);
      }
    });
  } else {
    for (let i in req.files.file) {
      const file = req.files.file[i];
      filename.push(file.name);
      filepath.push(`/uploads/${file.name}`);
      console.log("INSIDE UPLOADS", file.name);
      file.mv(`${publicPath}/uploads/${file.name}`, err => {
        if (err) {
          console.log("err while moving the file to different directory", err);
          return res.status(500).send(err);
        }
      });
    }
  }

  console.log(filename, "::::", filepath);

  res.json({ fileName: `${[filename]}`, filePath: `${filepath}` });
});
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`SERVER IS LISTENING ON PORT ${port}`);
});
