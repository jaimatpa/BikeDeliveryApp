const { Op, Transaction } = require("sequelize");
const { Trip, DeliveryOrders } = require("./../../../models");

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
    
    console.log('startOfDay', startOfDay);
    console.log('endOfDay', endOfDay);

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

async function newTrip(req, res) {
    const { date } = req.query;
    const data = JSON.parse(JSON.stringify(req.body));
    const tripNumber = data.tripNumber; // Trip Object
    const truck = data.truckId; // Truck object

    console.log('trip = ' + tripNumber);

    truck.trips.forEach( trip => {
        console.log('truck = ' + truck.id);

        const orders = trip.deliveryOrders;
        orders.forEach( async order => {
            await DeliveryOrders.findAll({
                where: [{
                    id: order.id
                }]
            }).then( x => {
                x.forEach( _order => {
                    //_order.truckID = truck.id,
                    //_order.TripID1 = trip.tripNumber
                    console.log({
                        id: order.id,
                        truckID: truck.id,
                        tripID1: tripNumber
                    });
                    _order.update({
                        id: order.id,
                        truckID: truck.id,
                        tripID1: tripNumber
                    });
                });
            });

        });
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
    getAllTrips
};