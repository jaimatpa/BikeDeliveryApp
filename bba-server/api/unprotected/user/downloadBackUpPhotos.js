const express = require("express");
const router = express.Router();
const AdmZip = require('adm-zip');
const { readdirSync } = require("fs");

router.get("/", (req, res) => {
  try {
    let zip = new AdmZip();
    readdirSync("./public").map((file) => zip.addLocalFile('./public/' + file));
    zip.writeZip("./public/files.zip");

    const data = zip.toBuffer();

    return res.send(data);
  } catch (error) {
    console.log('error', error)
  }
});


module.exports = router;