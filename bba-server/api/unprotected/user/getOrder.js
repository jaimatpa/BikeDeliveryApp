const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const moment = require("moment");

const models = require("./../../../models");
const { RecordingSettingsContext } = require("twilio/lib/rest/video/v1/recordingSettings");

router.post("/", async (req, res) => {
    const deliveryOrder = await models.DeliveryOrders.findOne(
        {
            where:
            {
                orderid:req.query.orderid
            }
        });
        if (deliveryOrder) {
            return 1;
        } else {
            return 0;
        }
});

router.get("/", async (req, res) => {
    const deliveryOrder = await models.DeliveryOrders.findOne(
        {
            where:
            {
                orderid:req.query.orderid
            }
        });
        console.log(deliveryOrder);
        if (deliveryOrder) {
            console.log("IN GET SUCCESS");
            return res.send('1');
        } else {
            console.log("IN GET FAILURE");
            return res.send('0');
        }
});

module.exports = router;
