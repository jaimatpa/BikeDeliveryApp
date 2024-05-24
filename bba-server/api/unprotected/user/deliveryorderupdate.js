const express = require("express");
const router = express.Router();
const status = require("http-status");
const { Op } = require("sequelize");
const { sendNotification } = require("../../functions/notifications")

const models = require("./../../../models");

router.post("/", async (req,res) => {
    const data = JSON.parse(JSON.stringify(req.body));

    console.log("IN ROUTER POST");
    console.log(req.params);
    console.log(data);

    const orderid = data.orderid ?? req.params.orderid;
    const swapOrder = data.swapOrder ? data.swapOrder : 0;
    
    const status = data.status;
    const textSent = data.textSent;
    const picturesSent = data.picturesSent;
    const reason = data.reason;
    
    if(!orderid) {
        return res.send('You must provide an orderID: ' + req.params['orderid'] + ' - ' + data.orderid);
    }

    try
    {

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
    
        if( data.delivered ) {
            
            const trip = await models.Trip.findOne(
                {
                    where:
                    {
                        id: deliveryOrder.tripID1
                    }
                });

            if(trip != null) {
            
                trip.complete = true;
                trip.save();
                console.log('trip was saved');
            }
        }

        var tripPriority1 = deliveryOrder.tripPriority1;
        var tripPriority2 = deliveryOrder.tripPriority1;
        var assignedSort = deliveryOrder.assignedSort;

        if(data.tripPriority1 !== 'undefined') tripPriority1 = data.tripPriority1;
        if(data.tripPriority2 !== 'undefined') tripPriority2 = data.tripPriority2;
        if(data.assignedSort !== 'undefined') assignedSort = data.assignedSort;
    
        deliveryOrder.date = data.date?data.date:deliveryOrder.date;
        deliveryOrder.name = data.name?data.name:deliveryOrder.name;
        deliveryOrder.location = data.location?data.location:deliveryOrder.location;
        deliveryOrder.color = data.color?data.color:deliveryOrder.color;
        deliveryOrder.combination = data.combination?data.combination:deliveryOrder.combination;
        deliveryOrder.mobileNo = data.mobileNo?data.mobileNo:deliveryOrder.mobileNo;
        deliveryOrder.barcode = data.barcode?data.barcode:deliveryOrder.barcode;
        deliveryOrder.lock = data.lock?data.lock:deliveryOrder.lock;
        deliveryOrder.status = status ? status : deliveryOrder.status;
        deliveryOrder.note = data.note ? data.note : deliveryOrder.note;
        //deliveryOrder.unableToDeliverItems = unableToDeliverItems ? unableToDeliverItems : deliveryOrder.unableToDeliverItems;
        deliveryOrder.extrasPickedUp = data.extrasPickedUp ? data.extrasPickedUp : deliveryOrder.extrasPickedUp;
        deliveryOrder.extrasDelivered = data.extrasDelivered ? data.extrasDelivered : deliveryOrder.extrasDelivered;
        deliveryOrder.extrasPickedUpReason = data.extrasPickedUpReason ? data.extrasPickedUpReason : deliveryOrder.extrasPickedUpReason;
        deliveryOrder.extrasDeliveredReason = data.extrasDeliveredReason ? data.extrasDeliveredReason : deliveryOrder.extrasDeliveredReason;
        if(data.tripID1 !=='undefined') deliveryOrder.tripID1 = data.tripID1 == 0 ? null : data.tripID1;
        if(data.tripID2 !=='undefined') deliveryOrder.tripID2 = data.tripID2 == 0 ? null : data.tripID2;
        if(data.truckID !=='undefined') deliveryOrder.truckID = data.truckID == 0 ? null: data.truckID;
        if(data.TruckId1 !=='undefined') deliveryOrder.TruckId1 = data.TruckId1 == 0 ? null : data.TruckId1;

        console.log(data.TruckId1);
        
        deliveryOrder.tripPriority1 = tripPriority1;
        deliveryOrder.tripPriority2 = tripPriority2;
        deliveryOrder.assignedSort = assignedSort;
        
        console.log('priority set?', deliveryOrder.truckId1, deliveryOrder.orderid, deliveryOrder.assignedSort );
        deliveryOrder.textSent = textSent;
        deliveryOrder.picturesSent = picturesSent;
        // deliveryOrder.PickupNotes = reason;
        deliveryOrder.PickedUp = data.pickedUp ? data.pickedUp : deliveryOrder.PickedUp;

        await deliveryOrder.save();

        if(deliveryOrder.unableToDeliverItems)
        {
            // Sent to all administrators when unable to deliver extra items.
            sendNotification( `Items were missing from ${orderid}`, 0, orderid, 0, 1, 0);
        }

        console.log('saved?');
        return res.send(deliveryOrder)

    }
    catch(error)
    {
        console.log('Error updating Delivery Order', error);
        return res.send(error)
    }
});

module.exports = router;
