const express = require("express");
const cors = require('cors');
const router = express.Router();
router.use(cors());
const { Op } = require("sequelize");
const models = require("../../../models");
const multer = require('multer');
const path = require('path');
const _ = require("lodash");
const { async } = require("crypto-random-string");

const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        console.log('111');
        console.log(req.body);
        const orderid = req.query.orderid;
        cb(null, `${orderid}${path.extname(file.originalname)}`);
        // cb(null, file.fieldname + '-' + orderid + '-' + Date.now() + path.extname(file.originalname));
    }
});
router.post("/", async (req, res) => {
    let upload = multer({ storage: storage, fileFilter: imageFilter }).single('file');

    upload(req, res, async function (err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
        const orderid = req.query.orderid;
        try {
            if (orderid) {
                await models.Files.build({ orderid: orderid, filepath: req.file.path }).save();
            }
        } catch (error) {
            console.log("ERROR BUILDING FILE");
         }

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        // Display uploaded image for user validation
        res.header("Access-Control-Allow-Origin", "*");
        res.send({ success: true, body: `You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>` });
    });
});

router.get("/", async (req, res) => {
    const data = await models.Files.findAll({ where: { orderid: req.query.orderid } });

    let sendData = [];
    _.forEach(data, val => {

        let uploadLocalFilePath;
        if (val.filepath.startsWith("public/")) uploadLocalFilePath = val.filepath.replace(`public/`, '');
        else uploadLocalFilePath = val.filepath.replace(`public\\`, '');

        let tempData = {
            id: val.id,
            orderid: val.orderid,
            filepath: process.env.BASE_URL + "/" + uploadLocalFilePath,
            createdAt: val.createdAt,
            updatedAt: val.updatedAt
        }

        sendData.push(tempData)
    })
    res.header("Access-Control-Allow-Origin", "*");
    return res.send(sendData);
});


module.exports = router;
