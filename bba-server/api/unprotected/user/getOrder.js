const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const moment = require("moment");

const models = require("./../../../models");
const { RecordingSettingsContext } = require("twilio/lib/rest/video/v1/recordingSettings");
const DeliveryOrderQuery = require("../../../translation/DeliveryOrderQuery");

router.post("/", async (req, res) => {
    // const deliveryOrder = await models.DeliveryOrders.findOne(
    //     {
    //         where:
    //         {
    //             orderid:req.query.orderid
    //         }
    //     });

    const whereConditions = {
        and: {
            orderid:req.query.orderid
        },
    }
    const query = DeliveryOrderQuery.translateDeliveryOrder(whereConditions);
    let data = await models.sequelize.query(query, {
        type: models.sequelize.QueryTypes.SELECT,
    });
    let deliveryOrder = data[0];
    if (deliveryOrder) {
        return 1;
    } else {
        return 0;
    }
});

router.get("/", async (req, res) => {
    // const deliveryOrder = await models.DeliveryOrders.findOne(
    //     {
    //         where:
    //         {
    //             orderid:req.query.orderid
    //         }
    //     });
    const whereConditions = {
        and: {
            orderid:req.query.orderid
        },
    }
    const query = DeliveryOrderQuery.translateDeliveryOrder(whereConditions);
    let data = await models.sequelize.query(query, {
        type: models.sequelize.QueryTypes.SELECT
    });
    let deliveryOrder = data[0];
    if (deliveryOrder) {
        console.log("IN GET SUCCESS");
        return res.send(deliveryOrder);
    } else {
        console.log("IN GET FAILURE");
        return res.send(null);
    }
});

module.exports = router;
