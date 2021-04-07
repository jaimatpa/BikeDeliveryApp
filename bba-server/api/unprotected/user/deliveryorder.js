const express = require("express");
const router = express.Router();
const status = require("http-status");

const models = require("./../../../models");
const apiError = require("./../../../libs/apiError");
const constVariables = require("./../../../constants");
const apiMessage = require("./../../../language/en.json");


router.post("/", async (req, res) => {

    const data = JSON.parse(JSON.stringify(req.body));
    for(let i =0;i<data.length;i++){
        await models.DeliveryOrders.build(data[i]).save();
    }
    //received the json here req.body
    // console.log(req.body)
    res.send(req.body);
});

router.get("/", async (req, res) => {
    const data = await models.DeliveryOrders.findAll();
    console.log('inside get!!!')
    res.send(data);
});

module.exports = router;
