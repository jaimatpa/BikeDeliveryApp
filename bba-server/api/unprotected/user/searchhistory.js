const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const path = require('path');
const fs = require('fs');
const models = require("../../../models");
const AWS = require("aws-sdk");
const { resolve } = require("@sentry/utils");
const DeliveryOrderQuery = require("../../../translation/DeliveryOrderQuery");

AWS.config.update({
    accessKeyId: process.env.AWSAccessKey,
    secretAccessKey: process.env.AWSSecretAccessKey,
});
AWS.config.region = process.env.AWSRegion;

router.get("/", async (req, res) => {
    let data = [];
    const search = req.query.search;
    const type = req.query.type;
    
    const barcodeid = req.query.barcodeid;
    var swapOrder = type == 'swap' ? 1 : 0;
    if (search) {
        console.log(search);
        try {
            const whereConditions = {
                or: {
                    name: {
                        like: `%${search}%`,
                    },
                    location: {
                        like: `%${search}%`,
                    },
                    orderid: {
                        like: `%${search}%`,
                    },
                    rack: {
                        like: `%${search}%`,
                    },
                    color: {
                        like: `%${search}%`,
                    },
                    combination: {
                        like: `%${search}%`,
                    },
                    lock: {
                        like: `%${search}%`,
                    },
                    mobileNo: {
                        like: `%${search}%`,
                    },
                    barcode: {
                        like: `%${search}%`,
                    },
                },
                swapOrder: swapOrder
            }
            const query = DeliveryOrderQuery.translateDeliveryOrder(whereConditions);
            console.log(query);
            data = await models.sequelize.query(query, {
                type: models.sequelize.QueryTypes.SELECT
            }) ;
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    } else if (barcodeid) {
        if (barcodeid) {
            try {
                // data = await models.DeliveryOrders.findAll({
                //     where: {
                //         barcode: {
                //             [Op.like]: `%${barcodeid}%`,
                //         },
                //     },
                // });
                const whereConditions = {
                    and:{
                        barcode: {
                            like: `%${barcodeid}%`,
                        },
                    }
                }
                const query = DeliveryOrderQuery.translateDeliveryOrder(whereConditions);
                console.log("**************************************query");
                console.log(query);

                data = await models.sequelize.query(query, {
                    type: models.sequelize.QueryTypes.SELECT
                }) ;
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }
    } else {
        console.log('wtf ??');
        // data = await models.DeliveryOrders.findAll({where: { swapOrder: false }});
        const whereConditions = {
            or: {
                swapOrder: false,
                swapOrder: null,
            }
        }
        const query = DeliveryOrderQuery.translateDeliveryOrder(whereConditions);

        data = await models.sequelize.query(query, {
            type: models.sequelize.QueryTypes.SELECT
        });
    }
    return res.send(data);
});

router.get("/images", async (req, res) => {
    console.log("IN IMAGES ENDPOINT");
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
    const directoryPath = path.join(__dirname, 'public');
    let imageArray = [];
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 

        files.forEach(function (file) {
            // Do whatever you want to do with the file
            console.log(file); 
        });
    });
    return imageArray;

    // return new Promise((resolve, reject) => {
    //     let imageArray = [];
    //     let s3 = new AWS.S3({ params: { Bucket: 'bike-app-storage', Prefix: `${prefix}-${orderID}/`, Delimiter: '/' } });
    //     s3.listObjectsV2(function (err, data) {
    //         if (err) {
    //             console.log(err);
    //             reject(err);
    //         } else {
    //             //   console.log(data);
    //             data.Contents.forEach(imageObject => {
    //                 let key = imageObject.Key;
    //                 let splitKey = key.split('/');
    //                 //console.log(splitKey);
    //                 imageArray.push(splitKey[1]);
    //             });
    //             //console.log(imageArray);
    //             resolve(imageArray);
    //         }
    //     });
    // })
}

module.exports = router;
