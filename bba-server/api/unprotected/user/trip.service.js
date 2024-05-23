const { Op, Transaction } = require("sequelize");
const { Trip, DeliveryOrders, EquipmentType, DeliveryItem, Truck, Notification, User } = require("./../../../models");
const { sendNotification } = require("../../functions/notifications");
const translateDeliveryOrder = require("../../../translation/DeliveryOrderQuery");

/**
 * Get all trip
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function getAllTrips(req, res) {
    const { date } = req.query;

    const selectedDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);
    
    const data = await Trip.findAll({
        where: {
            date: {
                [Op.gte]: startOfDay,
                [Op.lt]: endOfDay
            },
        }
    });

    return res.send(data);
}

async function getAllOrders(tripId, truckId) {
    // const orders = await DeliveryOrders.findAll({
    //     where: {
    //         [Op.and]: [
    //             { truckId: truckId }, 
    //             { tripID1: tripId },   
    //         ],
    //         //status: 0
    //     }
    // });

    const whereConditions = {
        [Op.and]: [
            { truckId: truckId }, 
            { tripID1: tripId },   
        ],
    }
    const query = translateDeliveryOrder(whereConditions);

    const orders = await models.sequelize.query(query, {
        type: models.sequelize.QueryTypes.SELECT
    }) ;
 
    return orders;
}

async function getAllOrdersNoFilter(tripId, truckId) {
    // const orders = await DeliveryOrders.findAll({
    //     where: {   
    //         tripID1:  {  [Op.ne]: null },  
    //         // tripID2:  {  [Op.ne]: null },  
            
    //         //status: 1,
    //         // pickedup: 0
    //     }
    // });

    const whereConditions = {
        tripID1:  {  [Op.ne]: null },
    }
    const query = translateDeliveryOrder(whereConditions);

    const orders = await models.sequelize.query(query, {
        type: models.sequelize.QueryTypes.SELECT
    }) ;
 
    return orders;
}


async function getOrderItems(order) {
    const orderItems = await DeliveryItem.findAll({
        where: {
            DeliveryId: order.id,
            // checkedDelievery: 1,
            // checkPickup: 0,
            active: 1,
            //status: 1
        },
        order: [['id', 'ASC']],
    });

    return orderItems;

}



async function getEquipment(label) {
    if(label == null) return null;

    var equipment = await EquipmentType.findOne({
       where: {
           'id': label
       }
    });

    return equipment;
};


async function checkOrderStock(req, res) {
    const data = JSON.parse(JSON.stringify(req.body));
 

    var noStockOrders = [];

    const orders = await getAllOrdersNoFilter();
    
    if(orders.length == 0) {
        res.send({succes: true, outOfStock: noStockOrders.length > 0, orders: noStockOrders});
    }

    var count = 0;
    var count2 = 0;
    var sent = false;

    var totalOrderItems = 0;

    console.log('checkOrderStock order.length: ', orders.length);
    var requests = 0;

    orders.forEach( order => {

        getOrderItems(order)
        .then( items => {
            count++;

            totalOrderItems = totalOrderItems + items.length;

            items.forEach( item => {
                getEquipment(item.EquipmentTypeId).then( equipment => {
                    if(equipment !== null) {
                        noStockOrders.push({ 
                            test: 'hi',
                            pickup_date: order.endDate,
                            orderId: order.orderid, 
                            Label: equipment.Label,
                            equipmentTypeId: item.EquipmentTypeId,
                            barcode: equipment.BarcodePrefix,
                            SerialBarcode: item.serialbarcode,
                            qty: equipment.qty,
                            qtyAvailable: equipment.qtyAvailable,
                        });
                    }
                })
                .finally(() => {
                    requests++;
                    if( requests == totalOrderItems && count == orders.length ) {
                        console.log('Order Count', count, requests, totalOrderItems);
                    
                        res.send({success: true, orders: noStockOrders});
                    }
                });
            }) 
        }) 
    });
}

async function checkStock(req, res) {
    const data = JSON.parse(JSON.stringify(req.body));
    const tripNumber = data.tripNumber; // Trip Object
    
    const tripId = data.tripId;
    const truckId = data.truckId; // Truck object
    var outOfStockItems = [];
    var count = 0;
    var totalOrderItems = 0;
    var requests = 0;
    var noStockOrders = [];

    if(tripId == null)
    {
        console.log('Trip was not created yet, created trip and got ID');
    }

    const orders = await getAllOrders(tripId, truckId);
    
    console.log('Got orders', orders.length);
    if(orders.length == 0) {
        res.send({succes: true, outOfStock: noStockOrders.length > 0, orders: noStockOrders});
    }

    orders.forEach( order => {

        getOrderItems(order)
        .then( items => {
            count++;

            console.log('order', order.orderid);
            console.log('returning', items.length);

            totalOrderItems = totalOrderItems + items.length;

            items.forEach( item => {
                getEquipment(item.EquipmentTypeId).then( equipment => {
                    if(equipment != null && equipment.qtyAvailable == 0 ) { 
                        noStockOrders.push({ 
                            orderId: order.orderid, 
                            Label: equipment.Label,
                            equipmentTypeId: item.EquipmentTypeId,
                            test: 'test',
                            barcode: equipment.BarcodePrefix,
                            qty: equipment.qty,
                            qtyAvailable: equipment.qtyAvailable,
                        });
                    }
                    else {
                        console.log(item.EquipmentTypeId);
                    }
                })
                .finally(() => { 
                    requests++;
                    console.log('requests', requests);
                    if( requests == totalOrderItems && count == orders.length ) {
                        console.log('Order Count', count, requests, totalOrderItems);
                    
                        res.send({success: true, outOfStock: noStockOrders.length > 0, orders: noStockOrders});
                    }
                });
            }) 
        }) 
    });
}

async function createTrip(req, res) 
{
    const data = JSON.parse(JSON.stringify(req.body));
    const tripId = data.tripId; // Trip Object
    const tripNumber = data.tripNumber; // Trip Object
    const truckName = data.truckName;
    const truckId = data.truckId; // Truck object
    const enableYardManager = data.notifyYardMAnager; // Truck object
    const date = data.date; // Truck object

    try 
    {
        var trip = await Trip.findOne({
            where: {
                id: tripId
            }
        });

        if(trip == null) {
            const selectedDate = date ? new Date(date) : new Date();
            const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);

            trip = await Trip.findOne({
                where: {
                    truckId: truckId,
                    tripNumber: tripNumber,
                
                    date: {
                        [Op.gte]: startOfDay,
                        [Op.lt]: endOfDay
                    },
                    
            }});

            if(trip == null) {
                console.log('trip not found. creating one');

                trip = await Trip.create({
                    date: startOfDay,
                    truckId: truckId,
                    tripNumber: tripNumber,
                    released: true,
                    complete: false,
                    notifyYardMAnager: enableYardManager
                });
            } 
        }

        return res.send({success: true, trip: trip});

    }
    catch(e) {
        return res.send({success: false, message: "Trip could not be released.", error: e});
    }
}

async function releaseTrip(req, res) 
{
    const data = JSON.parse(JSON.stringify(req.body));
    const tripId = data.tripId; // Trip Object
    const tripNumber = data.tripNumber; // Trip Object
    const truckName = data.truckName;
    const truckId = data.truckId; // Truck object
    const enableYardManager = data.notifyYardMAnager; // Truck object
    const date = data.date; // Truck object

    try 
    {
        var trip = await Trip.findOne({
            where: {
                id: tripId
            }
        });

        if(trip == null) {
            const selectedDate = date ? new Date(date) : new Date();
            const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);

            trip = await Trip.findOne({
                where: {
                    truckId: truckId,
                    tripNumber: tripNumber,
                
                    date: {
                        [Op.gte]: startOfDay,
                        [Op.lt]: endOfDay
                    },
                    
            }});

            if(trip == null) {
                console.log('trip not found. creating one');

                trip = await Trip.create({
                    date: startOfDay,
                    truckId: truckId,
                    tripNumber: tripNumber,
                    released: true,
                    complete: false,
                    notifyYardMAnager: enableYardManager
                });
            } 
        }

        const _truck = await Truck.findOne({
            where: {
                id: truckId
            }
        });

        console.log('sending notification for truck', truckId, truckName);

        if(trip != null && _truck != null) {

            console.log('sending notification. trip ok truck ok');

            trip.update({
                driverId: data.driverId,
                released: true,
                complete: false,
                notifyYardMAnager: enableYardManager
            });

            // Send notification to Admins
//            sendNotification( `Trip ${tripId} for ${truck.truckName} is ready to load.`, 0, 0, tripId, 1, 0);

            const USER_TYPE_ADMINISTRATOR = 1;
            const USER_TYPE_DRIVER = 2;
            const USER_TYPE_YARD_MANAGER = 5;

            console.log('Notifying administrators');
            sendNotification( `Trip ${tripNumber} for ${truckName} is ready to load.`, 0, data.orderid, tripId, USER_TYPE_ADMINISTRATOR, 0);

            // Send notification to the driver
            console.log('Notifying the driver');
            sendNotification( `Trip ${tripNumber} for ${truckName} is ready to load.`, 0, data.orderid, tripId, USER_TYPE_DRIVER, data.driverId);

            if(enableYardManager) 
            {
                console.log('Yard Manager is enabled');
                
                console.log('Notifying Yard Manager');
                sendNotification( `Trip ${tripNumber} for ${truckName} is ready to load.`, 0, data.orderid, tripId, USER_TYPE_YARD_MANAGER, 0 );
            }
            else {
                console.log('Yard Manager is NOT enabled');
            }
        }

        return res.send({success: true, trip: trip});

    }
    catch(e) {
        return res.send({success: false, message: "Trip could not be released.", error: e});
    }
}


async function newTrip(req, res) 
{
    const data = JSON.parse(JSON.stringify(req.body));
    const tripNumber = data.tripNumber; // Trip Object
    const truck = data.truckId; // Truck object
    const date = data.date;
    const type = data.type;
    var trip;
    var tripid;
    var outOfStockItems = [];

    try
    {
       // truck.trips.forEach(async ttrip => {
        var ttrip = truck.trips[0];
            // Delete previous trip details.
            
            const orders = ttrip.deliveryOrders;
            if(orders.length > 0) 
            { 
                // var date = date != null ? date : orders[0].date;
                const selectedDate = date ? new Date(date) : new Date();
                const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
                const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);

                trip = await Trip.findOne({
                    where: {
                        truckId: truck.id,
                        tripNumber: tripNumber,
                    
                        date: {
                            [Op.gte]: startOfDay,
                            [Op.lt]: endOfDay
                        },
                        
                }});

                if(trip == null) {
                    console.log('trip not found. creating one');

                    trip = await Trip.create({
                        date: startOfDay,
                        truckId: truck.id,
                        tripNumber: tripNumber,
                        // release: data.tripNumber.released ? data.tripNumber.released : false,
                        // complete: data.tripNumber.complete,
                        // notifyYardManager: data.tripNumber.notifyYardManager ? data.tripNumber.notifyYardManager : false
                    });
                } 

                console.log('updating existing...: ' + trip.id);

                orders.forEach( async order => {
                    await DeliveryOrders.findAll({
                        where: [{
                            id: order.id
                        }]
                    }).then( x => {
                        x.forEach( async _order => {

                            if(type=='delivery') {
                                _order.update({
                                    id: order.id,
                                    truckID: truck.id,
                                    tripID1: trip.id
                                });
                            }
                            else if(type=='pickup') {
                                console.log('updating order truckid1 to ', order.id, truck.id);
                                _order.update({
                                    id: order.id,
                                    TruckId1: truck.id,
                                    tripID2: trip.id
                                }); 
                            }

                            
                        });
                    });
                });


            }

 
        //});

        // const selectedDate = date ? new Date(date) : new Date();
        // const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);
        // const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 2);
        
        // console.log('startOfDay', startOfDay);
        // console.log('endOfDay', endOfDay);

        // const data = await Trip.findAll({
        //     where: {
        //         date: {
        //             [Op.gte]: startOfDay,
        //             [Op.lt]: endOfDay
        //         },
        //     }
        // });

        //deliveryOrderId -- Update truckID on release?
        // const trip = await Trip.create({
        //     date: new Date(),
        //     truckId: data.truckId,
        //     tripNumber: data.tripNumber,
        //     // release: data.tripNumber.released ? data.tripNumber.released : false,
        //     // complete: data.tripNumber.complete,
        //     // notifyYardManager: data.tripNumber.notifyYardManager ? data.tripNumber.notifyYardManager : false
        // });
    }
    catch(e) {
        return res.send(e);
    }

    return res.send(trip);
}



module.exports = {
    newTrip,
    getAllTrips,
    releaseTrip,
    checkStock,
    createTrip,
    checkOrderStock
};  