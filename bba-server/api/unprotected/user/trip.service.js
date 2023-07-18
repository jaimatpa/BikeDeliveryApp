const { Op, Transaction } = require("sequelize");
const { Trip, DeliveryOrders, Truck, Notification, User } = require("./../../../models");
const { sendNotification } = require("../../functions/notifications")

/**
 * Get all trip
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function getAllTrips(req, res) {
    const { date } = req.query;

    const selectedDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);
    const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 2);
    
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



async function releaseTrip(req, res) 
{
    const data = JSON.parse(JSON.stringify(req.body));
    const tripId = data.tripId; // Trip Object
    const tripNumber = data.tripNumber; // Trip Object
    const truckName = data.truckName;
    const truck = data.truckId; // Truck object
    const enableYardManager = data.enableYardManager; // Truck object

    try {
        const trip = await Trip.findOne({
            where: {
                id: tripId
            }
        });

        const _truck = await Truck.findOne({
            where: {
                Id: truck
            }
        });

        if(trip != null && _truck != null) {
            trip.update({
                driverId: data.driverId,
                released: true,
                complete: false,
                notifyYardMAnager: enableYardManager
            });

            // Send notification to Admins
            sendNotification( `Trip ${tripId} for ${truck.truckName} is ready to load.`, 0, 0, tripId, 1, 0);
            
            // Send notification to the driver
            sendNotification( `Trip ${tripId} for ${truck.truckName} is ready to load.`, 0, 0, tripId, 3, data.driverId);

            if(enableYardManager) 
            {
                sendNotification( `Trip ${tripId} for ${truck.truckName} is ready to load.`, 0, 0, tripId, 5, 0 );
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
    const { date } = req.query;
    const data = JSON.parse(JSON.stringify(req.body));
    const tripNumber = data.tripNumber; // Trip Object
    const truck = data.truckId; // Truck object



    console.log('trip = ' + tripNumber);

    truck.trips.forEach(async trip => {
        console.log('truck = ' + truck.id);
        console.log('trip = ' + truck.id);

        // Delete previous trip details.
        
        const orders = trip.deliveryOrders;
        if(orders.length > 0) 
        { 
            console.log('writing orders' + orders[0].date);
            var date = date != null ? date : orders[0].date;
            const selectedDate = date ? new Date(date) : new Date();
            const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);
            const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 2);
            
            console.log('creating new trip for: ' + date)
            // Trip.destroy({
            //     where: { 
            //         tripNumber: tripNumber,
            //         truckID: truck.id,
            //         date: {
            //             [Op.gte]: startOfDay,
            //             [Op.lt]: endOfDay
            //         },
            //     }
            // });

            // const existingTrip = await Trip.create({
            //     date: selectedDate,
            //     truckId: truck.id,
            //     tripNumber: tripNumber,
            //     // release: data.tripNumber.released ? data.tripNumber.released : false,
            //     // complete: data.tripNumber.complete,
            //     // notifyYardManager: data.tripNumber.notifyYardManager ? data.tripNumber.notifyYardManager : false
            // });

            var trip = await Trip.findOne({
                where: {
                    truckId: truck.id,
                    tripNumber: tripNumber,
            }});

            if(trip == null) {
                console.log('creating new trip');
                trip = await Trip.create({
                    date: new Date(),
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
                    x.forEach( _order => {
                        console.log(_order.orderid, _order.id);
                        _order.update({
                            id: order.id,
                            truckID: truck.id,
                            tripID1: trip.id
                        });
                    });
                });
            });
            
        }
    });

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
    

    return res.send(data);
}



module.exports = {
    newTrip,
    getAllTrips,
    releaseTrip
};  