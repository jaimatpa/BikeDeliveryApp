const express = require("express");
const router = express.Router();
const status = require("http-status");
const { Op } = require("sequelize");
const { sendNotification } = require("../../functions/notifications")

const models = require("./../../../models");
const DeliveryOrderQuery = require("../../../translation/DeliveryOrderQuery");
const colorLocksQuery = require("../../../translation/colorLocksQuery");

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

        // const deliveryOrder = await models.DeliveryOrders.findOne(
        //     {
        //         where:
        //         {
        //             orderid: orderid,
        //             swapOrder: swapOrder
        //         }
        //     });

        const whereConditions = {
            and: {
                orderid: orderid
            },
        }
        const query = DeliveryOrderQuery.translateDeliveryOrder(whereConditions);
        const dbRows = await models.sequelize.query(query, {
            type: models.sequelize.QueryTypes.SELECT
        });
            
        if(!dbRows || !dbRows[0]) {
            return res.send('Cannot find order ID in deliveries.')
        }

        const dbRow = dbRows[0];
    
        if( data.delivered ) {
            
            const trip = await models.Trip.findOne(
                {
                    where:
                    {
                        id: dbRow.tripID1
                    }
                });

            if(trip != null) {
            
                trip.complete = true;
                trip.save();
                console.log('trip was saved');
            }
        }

        var tripPriority1 = dbRow.tripPriority1;
        var tripPriority2 = dbRow.tripPriority1;
        var assignedSort = dbRow.assignedSort;

        if(data.tripPriority1 !== 'undefined') tripPriority1 = data.tripPriority1;
        if(data.tripPriority2 !== 'undefined') tripPriority2 = data.tripPriority2;
        if(data.assignedSort !== 'undefined') assignedSort = data.assignedSort;
        
        const deliveryOrder = {};

        deliveryOrder.id = dbRow.id;
        deliveryOrder.date = data.date?data.date:dbRow.date;
        deliveryOrder.name = data.name?data.name:dbRow.name;
        deliveryOrder.location = data.location?data.location:dbRow.location;
        deliveryOrder.color = data.color?data.color:dbRow.color;
        deliveryOrder.combination = data.combination?data.combination:dbRow.combination;
        deliveryOrder.mobileNo = data.mobileNo?data.mobileNo:dbRow.mobileNo;
        deliveryOrder.barcode = data.barcode?data.barcode:dbRow.barcode;
        deliveryOrder.lock = data.lock?data.lock:dbRow.lock;
        deliveryOrder.status = status ? status : dbRow.status;
        deliveryOrder.note = data.note ? data.note : dbRow.note;
        //deliveryOrder.unableToDeliverItems = unableToDeliverItems ? unableToDeliverItems : dbRow.unableToDeliverItems;
        deliveryOrder.extrasPickedUp = data.extrasPickedUp ? data.extrasPickedUp : dbRow.extrasPickedUp;
        deliveryOrder.extrasDelivered = data.extrasDelivered ? data.extrasDelivered : dbRow.extrasDelivered;
        deliveryOrder.extrasPickedUpReason = data.extrasPickedUpReason ? data.extrasPickedUpReason : dbRow.extrasPickedUpReason;
        deliveryOrder.extrasDeliveredReason = data.extrasDeliveredReason ? data.extrasDeliveredReason : dbRow.extrasDeliveredReason;
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
        deliveryOrder.PickedUp = data.pickedUp ? data.pickedUp : dbRow.PickedUp;

        if(data.combination){
            const colorWhereConditions = {
                and: {
                    combination: data.combination
                },
            }
            const colorQuery = colorLocksQuery.translateColorLocks(colorWhereConditions);
            console.log("colorQuery", colorQuery);
            let lock = await models.sequelize.query(colorQuery, {
                type: models.sequelize.QueryTypes.SELECT
            });

            if(lock && lock[0]){
                lock = lock[0];
                deliveryOrder.color_id = lock.id
            }
        }

        // await deliveryOrder.save();
        const updateQuery = DeliveryOrderQuery.updateDeliveryOrderByTranslation(deliveryOrder);
        result = await models.sequelize.query(updateQuery, {
            type: models.sequelize.QueryTypes.UPDATE
        });

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
