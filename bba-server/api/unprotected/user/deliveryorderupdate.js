const express = require("express");
const router = express.Router();
const status = require("http-status");
const { Op } = require("sequelize");
const { sendNotification } = require("../../functions/notifications")

const models = require("./../../../models");

router.post("/", async (req,res) => {
    const data = JSON.parse(JSON.stringify(req.body));

    console.log("IN ROUTER POST");
    const orderid = data.orderid;
    const swapOrder = data.swapOrder ? data.swapOrder : 0;
    
    const status =data.status;
    const textSent =data.textSent;
    const picturesSent =data.picturesSent;
    const reason =data.reason;
    const unableToDeliverItems = data.unableToDeliverItems;

    if(!orderid){
        return res.send('You must provide an orderID')
    }
    try{

        const deliveryOrder = await models.DeliveryOrders.findOne(
            {
                where:
                {
                    orderid: orderid,
                    swapOrder: swapOrder
                }
            });
            
        if(!deliveryOrder) {
            return res.send('Cannot find order ID in deliveries.')
        }
    
        deliveryOrder.date = data.date?data.date:deliveryOrder.date;
        deliveryOrder.name = data.name?data.name:deliveryOrder.name;
        deliveryOrder.location = data.location?data.location:deliveryOrder.location;
        deliveryOrder.color = data.color?data.color:deliveryOrder.color;
        deliveryOrder.combination = data.combination?data.combination:deliveryOrder.combination;
        deliveryOrder.mobileNo = data.mobileNo?data.mobileNo:deliveryOrder.mobileNo;
        deliveryOrder.barcode = data.barcode?data.barcode:deliveryOrder.barcode;
        deliveryOrder.lock = data.lock?data.lock:deliveryOrder.lock;
        deliveryOrder.status = status;
        deliveryOrder.textSent = textSent;
        deliveryOrder.picturesSent = picturesSent;
        deliveryOrder.note = data.note ? data.note : deliveryOrder.note;
        deliveryOrder.unableToDeliverItems = unableToDeliverItems ? unableToDeliverItems : deliveryOrder.unableToDeliverItems;
        // deliveryOrder.PickupNotes = reason;
        deliveryOrder.PickedUp = true;

        await deliveryOrder.save();

        if(deliveryOrder.unableToDeliverItems)
        {
            // Sent to all administrators when unable to deliver all items.
            sendNotification( `Items were missing from ${orderid}`, 0, orderid, 0, 1, 0);
        }

        return res.send(deliveryOrder)



    }catch(error){
        return res.send(error)
    }
    
    
    
});

module.exports = router;
