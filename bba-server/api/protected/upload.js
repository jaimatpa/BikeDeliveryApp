const express = require("express");
const router = express.Router();
const models = require("./../../models");
const multer = require("multer");
const consola = require("consola");
const fs = require("fs");
const path = require("path");

const maxUploadSize = parseInt(process.env.MAX_UPLOAD_FILE_SIZE) || 0;

const fileFilter = require("./../extensions/fileFilter");

const accept = process.env.UPLOAD_ACCEPT || undefined;

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const filename =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      path.extname(file.originalname);

    req.on("aborted", () => {
      fs.unlink(`uploads/${filename}`, () => {});
    });
    cb(null, filename);
  },
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
});

const upload = multer({
  //dest: './uploads',
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (fileFilter.isValid(file, accept)) cb(null, true);
    // accept file
    else {
      console.log("Upload: File rejected.");
      cb(null, false); // reject
      //cb(new Error('File type not permitted.'))
    }
  },
});

router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    console.log("returning error");
    return res
      .status(400)
      .json({ type: "file", message: "File type not permitted." });
  } else {
    let path = req.file.path.replace(/\\/g, "/");
    let newFile = {
      filename: path.substring(path.lastIndexOf("/") + 1),
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      encoding: req.file.encoding,
    };
    
    const fileModel = models.Upload.build(newFile);
    try {
      const savedFile = await fileModel.save();
      consola.success("Upload: Saved file " + newFile.filename);
      res.json({ success: true, file: null });
    } catch (err) {
      consola.error(
        "Upload: Error saving file to the database.  Details: " + err
      );
      // TODO: Remove the file
      return res.status(500).send({ type: "unknown", message: err });
    }
  }
});

module.exports = router;
