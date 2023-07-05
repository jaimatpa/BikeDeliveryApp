const express = require("express");
const router = express.Router();
const status = require("http-status");
const { Op } = require("sequelize");

const models = require("./../../../models");

router.post("/", async (req,res) => {
    console.log("IN ROUTER POST");
    const orderid = req.query.orderid;
    const swapOrder = req.query.swapOrder ? req.query.swapOrder : 0;
    
    const status = req.query.status;
    const textSent = req.query.textSent;
    const picturesSent = req.query.picturesSent;
    console.log(req.query.status);

    if(!orderid){
        return res.send('order id not found!!!')
    }
    try{

        const deliveryOrder = await models.DeliveryOrders.findOne(
            {
                where:
                {
                    orderid:orderid,
                    swapOrder: swapOrder
                }
            });
            
        if(!deliveryOrder){
            return res.send('order id not found!!!')
        }
    
        deliveryOrder.date = req.body.date?req.body.date:deliveryOrder.date;
        deliveryOrder.name = req.body.name?req.body.name:deliveryOrder.name;
        deliveryOrder.location = req.body.location?req.body.location:deliveryOrder.location;
        deliveryOrder.color = req.body.color?req.body.color:deliveryOrder.color;
        deliveryOrder.combination = req.body.combination?req.body.combination:deliveryOrder.combination;
        deliveryOrder.mobileNo = req.body.mobileNo?req.body.mobileNo:deliveryOrder.mobileNo;
        deliveryOrder.barcode = req.body.barcode?req.body.barcode:deliveryOrder.barcode;
        deliveryOrder.lock = req.body.lock?req.body.lock:deliveryOrder.lock;
        deliveryOrder.status = status;
        deliveryOrder.textSent = textSent;
        deliveryOrder.picturesSent = picturesSent;
        
        await deliveryOrder.save();
        return res.send(deliveryOrder)
    }catch(error){
        return res.send(error)
    }
    
    
    
});

module.exports = router;
