const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

const models = require("../../../models");
const AWS = require("aws-sdk");
const { resolve } = require("@sentry/utils");

AWS.config.update({
    accessKeyId: process.env.AWSAccessKey,
    secretAccessKey: process.env.AWSSecretAccessKey,
});
AWS.config.region = process.env.AWSRegion;

router.get("/", async (req, res) => {
    let data = [];
    const search = req.query.search;
    const barcodeid = req.query.barcodeid;
    if (search) {
        console.log(search);
        try {
            data = await models.DeliveryOrders.findAll({
                where: {
                    [Op.or]: {
                        name: {
                            [Op.like]: `%${search}%`,
                        },
                        location: {
                            [Op.like]: `%${search}%`,
                        },
                        orderid: {
                            [Op.like]: `%${search}%`,
                        },
                        rack: {
                            [Op.like]: `%${search}%`,
                        },
                        color: {
                            [Op.like]: `%${search}%`,
                        },
                        combination: {
                            [Op.like]: `%${search}%`,
                        },
                        lock: {
                            [Op.like]: `%${search}%`,
                        },
                        mobileNo: {
                            [Op.like]: `%${search}%`,
                        },
                        barcode: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                },
            });
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    } else if (barcodeid) {
        if (barcodeid) {
            try {
                data = await models.DeliveryOrders.findAll({
                    where: {
                        barcode: {
                            [Op.like]: `%${barcodeid}%`,
                        },
                    },
                });
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }
    } else {
        console.log(req.body);
        data = await models.DeliveryOrders.findAll();
    }
    return res.send(data);
});

router.get("/images", async (req, res) => {
    // console.log("IN IMAGES ENDPOINT");
    let id = req.query.orderID;
    // console.log(id);
    let images = {};
    let deliveryImages = await getImages("D", id).catch(err => {
    });
    let pickupImages = await getImages("P", id).catch(err => {
        
    });

    images["D"] = deliveryImages;
    images["P"] = pickupImages;

    // console.log("IMAGE ARRAY", images);
    return res.send(images);
});


async function getImages(prefix, orderID) {
    return new Promise((resolve, reject) => {
        let imageArray = [];
        let s3 = new AWS.S3({ params: { Bucket: 'bike-app-storage', Prefix: `${prefix}-${orderID}/`, Delimiter: '/' } });
        s3.listObjectsV2(function (err, data) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                //   console.log(data);
                data.Contents.forEach(imageObject => {
                    let key = imageObject.Key;
                    let splitKey = key.split('/');
                    //console.log(splitKey);
                    imageArray.push(splitKey[1]);
                });
                //console.log(imageArray);
                resolve(imageArray);
            }
        });
    })
}

module.exports = router;
