const express = require("express");
const router = express.Router();
const status = require("http-status");
const { Op } = require("sequelize");

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
    let data = [];
    const orderid = req.query.orderid;
    const barcodeid = req.query.barcodeid;
    if(orderid){
        try{
            data = await models.DeliveryOrders.findAll({
                where:{
                    orderid: {
                        [Op.like]: `%${orderid}%`
                    }
                }
            });
            console.log(data)
        }catch(error){
            console.log(error)
        }
    }else if(barcodeid){
        if(barcodeid){
            try{
                data = await models.DeliveryOrders.findAll({
                    where:{
                        barcode: {
                            [Op.like]: `%${barcodeid}%`
                        }
                    }
                });
                console.log(data)
            }catch(error){
                console.log(error)
            }
        }
    }
    else{
        data = await models.DeliveryOrders.findAll();
    }
    return res.send(data);
});

module.exports = router;
