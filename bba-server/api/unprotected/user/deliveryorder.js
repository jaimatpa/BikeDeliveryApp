const express = require("express");
const router = express.Router();
const { Op, literal, where } = require("sequelize");
const moment = require("moment");
const iterate = require("../../../libs/iterate");
const { sendNotification } = require("../../functions/notifications")

const models = require("./../../../models");
const { RecordingSettingsContext } = require("twilio/lib/rest/video/v1/recordingSettings");
// const DeliveryOrderQuery = require("../../../translation/DeliveryOrderQuery");
const DeliveryOrderQuery = require("../../../translation/DeliveryOrderQuery");

router.post("/", async (req, res) => {

    try {
        await models.Logs.build({ json: JSON.stringify(req.body) }).save();
    } catch (error) {
        // console.log(error)
    }

    try {
        const data = JSON.parse(JSON.stringify(req.body)).data;
        const keys = await models.WebhookMaps.findAll();
        let d = data;
        for (let k = 0; k < keys.length; k++) {
            const json_key = keys[k].json_key;
            const table_key = keys[k].table_key;
            const temp = iterate(d, json_key);
            if (json_key !== table_key && temp !== 'undefined') {
                d[table_key] = temp
            }
            await models.DeliveryOrders.build(d).save();
        }
    } catch (error) {
        //console.log(error)
    }

    //received the json here req.body
    res.send(req.body);
});

router.post("/createEquipmentSwapOrder", async (req, res) => {

    try {
        await models.Logs.build({ json: JSON.stringify(req.body) }).save();
    } catch (error) {
        // console.log(error)
    }

    try {
        const data = JSON.parse(JSON.stringify(req.body));

        data.id = null;
        data.swapOrder = true;
        data.swapOrderDeliveryId = req.body.id;

        if(data.location){
            data.manual_address = data.location;
            data.use_manual = 1;
        }

        if(data.subtotal) delete data.subtotal;
        if(data.tax_rate) delete data.tax_rate;
        if(data.tax_amount) delete data.tax_amount;
        if(data.total_price) delete data.total_price;
        if(data.paid) delete data.paid;
        if(data.price_table_id) delete data.price_table_id;
        if(data.textSent) delete data.textSent;
        if(data.discount_amount) delete data.discount_amount;

        data.status = 0;

        // Create a new swapOrder
        // const order = await models.DeliveryOrders.build(data).save();

        const whereConditions = {
            and:{
                orderid:{
                    like: `%${data.orderid}%`
                }
            }
        }
        const query = DeliveryOrderQuery.translateDeliveryOrder(whereConditions);

        let deliveryOrders = await models.sequelize.query(query, {
            type: models.sequelize.QueryTypes.SELECT
        });
        if(deliveryOrders.length > 0){
            data.orderid = `${data.orderid}-SWAP-${deliveryOrders.length}`;
        }else{
            res.send('No delivery order found');
        }

        const insertQuery = DeliveryOrderQuery.inseretDeliveryOrderByTranslation(data);
        console.log("-------- createEquipmentSwapOrder ---------", insertQuery);
        const [newId] = await models.sequelize.query(insertQuery, {
            type: models.sequelize.QueryTypes.INSERT
        });
        data.id = newId;

        res.send(data);
    } catch (error) {
        res.send(error);
        console.log(error)
    }

    //received the json here req.body
    //res.send(req.body);
});

router.get("/", async (req, res) => {
    try {
        console.log('searching delivery orders');
    
        let data = [];
        const search = req.query.search;
        const type = req.query.type;
        const barcodeid = req.query.barcodeid;
        if (search) {
            try {
                const whereConditions = {
                    or: {
                        name: {
                            like: `%${search}%`
                        },
                        location: {
                            like: `%${search}%`
                        },
                        orderid: {
                            like: `%${search}%`
                        },
                        rack: {
                            like: `%${search}%`
                        },
                        color: {
                            like: `%${search}%`
                        },
                        combination: {
                            like: `%${search}%`
                        },
                        lock: {
                            like: `%${search}%`
                        },
                        mobileNo: {
                            like: `%${search}%`
                        },
                        barcode: {
                            like: `%${search}%`
                        }
                    },
                }
                const query = DeliveryOrderQuery.translateDeliveryOrder(whereConditions);

                data = await models.sequelize.query(query, {
                    type: models.sequelize.QueryTypes.SELECT
                });
                
                if (type === "DeliveryOrders") {
                    data = data.filter((record => {
                        var d = moment(record.date).add(4, 'hours').startOf('day');
                        var today = moment().endOf('day');
                        if (d >= today && record.status == 0) {
                            return true;
                        } else {
                            return false;
                        }
                    }));
                }
                else if (type === "Locking") {
                    data = data.filter((record => {
                        var d = moment(record.date).add(4, 'hours').format('LL');
                        var today = moment().format('LL');
                        if (d >= today) {
                            return true;
                        } else {
                            return false;
                        }
                    }));
                } else if (type === "SearchHistory") {
                    
                    console.log("SEARCH HISTORY, W CRITERIA 1");
                    data = data.filter((record => {
                        return record.swapOrder == 0 || record.swapOrder == null
                    }));
                } else if (type === "Dashboard") {
                    data = data.filter( ( record => {
                        record.swapOrder == 0
                    }));
                    // console.log(data);
                    data = data.filter((record => {
                        var d = moment(record.date).add(4, 'hours').format('LL');
                        var today = moment().format('LL');
                        if (d == today) {
                            return true;
                        } else {
                            return false;
                        }
                    }));
                } else if (type === "Resend") {
                    data = data.filter((record => {
                        var d = moment(record.date).add(4, 'hours').format('LL');
                        var today = moment().format('LL');
                        if (d > today && record.status == 1) {
                            return true;
                        } else {
                            return false;
                        }
                    }));
                } else if (type === "Logistics") {
                    data = data.filter((record => {
                        var d = moment(record.date).add(4, 'hours').format('LL');
                        var today = moment().format('LL');
                        if (d >= today && record.status == 0) {
                            return true;
                        } else {
                            return false;
                        }
                    }));
                } else if (type === "Pickup") {
                    data = data.filter((record => {
                        if (record.status == 1 && record.PickedUp == 0  && record.swapOrder == 0) {
                            return true;
                        } else {
                            return false;
                        }
                    }));
                }
                else if (type === "SwapOrder") {
                    console.log('swap order filter');
                    data = data.filter((record => {
                        if (record.status == 0 && record.swapOrder == 1) {
                            return true;
                        } else {
                            return false;
                        }
                    }));
                }

            } catch (error) {
                console.log(error)
            }
        }
        else if (barcodeid) {
            if (barcodeid) {
                try {
                    const whereConditions = {
                        and:{
                            status: 0,
                            barcode: {
                                like: `%${barcodeid}%`
                            }
                        }
                    }
                    const query = DeliveryOrderQuery.translateDeliveryOrder(whereConditions);
    
                    data = await models.sequelize.query(query, {
                        type: models.sequelize.QueryTypes.SELECT
                    });
                    // data = await models.DeliveryOrders.findAll({
                    //     where: {
                    //         status: 0,
                    //         barcode: {
                    //             [Op.like]: `%${barcodeid}%`
                    //         }
                    //     }
                    // });
                } catch (error) {
                    return Promise.reject();
                }
            }
        }
        else {
            const query = DeliveryOrderQuery.translateDeliveryOrder();
            data = await models.sequelize.query(query, {
                type: models.sequelize.QueryTypes.SELECT
            });
            // console.log(data);

            if (type === "DeliveryOrders") {
                data = data.filter((record => {
                    var d = moment(record.date).add(4, 'hours').startOf('day');
                    // var today = moment().endOf('day');
                    var today = moment().startOf('day');
                    // console.log(d, today);
                    if (d >= today && record.status == 0) {
                        return true;
                    } else {
                        return false;
                    }
                }));
            } else if (type === "EquipmentSwap") {
                data = data.filter((record => {
                    if (record.status < 2 && record.swapOrder == true) {
                        return true;
                    } else {
                        return false;
                    }
                }));
            }
            else if (type === "Locking") {
                data = data.filter((record => {
                    var d = moment(record.date).add(4, 'hours').startOf('day').format('LL');
                    var today = moment().format('LL');
                    if (d >= today) {
                        return true;
                    } else {
                        return false;
                    }
                }));
            } else if (type === "SearchHistory") {
                data = data.filter((record => {
                    console.log("SEARCH HISTORY, NO CRITERIA");
                    record.swapOrder == 0
                }));
            } else if (type === "Dashboard") { 
                console.log("******************************************************************");
                // data = data.filter( ( record => {
                //     return record.swapOrder == 0
                // }));
                // console.log(data);
                data = data.filter((record => {
                    var d = moment(record.date).add(4, 'hours').format("LL");
                    var today = moment().format("LL");
                    if (d == today) {
                        return true;
                    } else {
                        return false;
                    }
                }));
            } else if (type === "Resend") {
                data = data.filter((record => {
                    var d = moment(record.date).add(4, 'hours').startOf('LL');
                    var today = moment().format('LL');
                    if (d > today && record.status == 1) {
                        return true;
                    } else {
                        return false;
                    }
                }));
            } else if (type === "Logistics") {
                data = data.filter((record => {
                    var d = moment(record.date).add(4, 'hours').startOf('day');
                    var today = moment().endOf('day');
                    if (d >= today && record.status == 0) {
                        return true;
                    } else {
                        return false;
                    }
                }));
            } else if (type === "Pickup") {
                data = data.filter((record => {
                    var d = moment(record.date).add(4, 'hours').format('LL');
                    var today = moment().format('LL');
                    if (record.status == 1 && record.PickedUp == 0 && record.swapOrder == 0) {
                        return true;
                    } else {
                        return false;
                    }
                }));
            }
        }
        return res.send(data);
    } catch (e) {
        console.log(e);
        // return res.send([]);
    }

});

/**
 * The algorithm follows --->
 * List of orders currently awaiting delivery on the selected date.
 * All orders displayed are sorted based on priority set on Area, Villa, and Street Address.
 * First, the orders are grouped by Area, which is matched up to values from Area records.
 * Under each Area grouping, orders are then sorted by plantation, which is matched up to Villa records.
 * Finally, under each Villa grouping, orders are sorted by lane, which is matched up to Street Address records.
 */

function customDeliveryOrderSort(deliveryOrders, areas, villas, streetAddresses) {

    // * Convert each array of records into an object, using the name as the key for faster lookup
    const areasByName = Object.fromEntries(areas.map(area => [area.name, area]));
    const villasByName = Object.fromEntries(villas.map(villa => [villa.name, villa]));
    const streetAddressesByName = Object.fromEntries(streetAddresses.map(streetAddress => [streetAddress.name, streetAddress]));

    // * Group the orders by area
    const ordersByArea = deliveryOrders.reduce((groups, order) => {
        const areaName = order.area;
        if (!groups[areaName]) {
            groups[areaName] = [];
        }
        groups[areaName].push(order);
        return groups;
    }, {});

    
    // * Sort the orders within each group by plantation and lane
    for (const areaName in ordersByArea) {
        ordersByArea[areaName].sort((a, b) => {
            const aVillaPriority = villasByName[a.plantation]?.priority || 0;
            const bVillaPriority = villasByName[b.plantation]?.priority || 0;
            
            const aStreetAddressPriority = streetAddressesByName[a.location]?.priority || 0;
            const bStreetAddressPriority = streetAddressesByName[b.location]?.priority || 0;
 
            // * Compare based on the priority, lower values first
            if (aVillaPriority !== bVillaPriority) {
                //console.log('villa priority: ' + villasByName[a.plantation]?.priority);
                return aVillaPriority - bVillaPriority;
            } else {
                //console.log('address priority', streetAddressesByName[0].priority);
                return aStreetAddressPriority - bStreetAddressPriority;
            }
        });
    }

    // * Sort the groups by area priority
    const areaNamesSorted = Object.keys(ordersByArea).sort((a, b) => {
        const aAreaPriority = areasByName[a]?.priority || 0;
        const bAreaPriority = areasByName[b]?.priority || 0;

        // * Compare based on the priority, lower values first
        return aAreaPriority - bAreaPriority;
    });

    // * Convert the sorted groups into an array
    return areaNamesSorted.flatMap(areaName => ordersByArea[areaName]);

}

router.get("/query", async (req, res) => {
    const { order_type, date, type } = req.query;
    var { status } = req.query;

    // * Since there is not relation to actual entities in database between area, villas and stuff, cannot use the optimal way for query data and sorting it
    // * Will have match the strings to find the commonalities

    if (order_type === "delivery_order") {
        const selectedDate = new Date(date);
        console.log(selectedDate);
        const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);
        // Fetch all records from the three tables
        const whereConditions = {
            and:{
                date: {
                    ">=": startOfDay,
                    "<=": endOfDay
                },
                status: 1
            }
        }
        const query = DeliveryOrderQuery.translateDeliveryOrder(whereConditions);

        let deliveryOrders = await models.sequelize.query(query, {
            type: models.sequelize.QueryTypes.SELECT
        });

        let [areas, villas, streetAddresses] = await Promise.all([
            // models.DeliveryOrders.findAll({
            //     where: {
            //         date: {
            //             [Op.gte]: startOfDay,
            //             [Op.lt]: endOfDay
            //         },
            //         status: 1 // considering 1 as true
            //     }
            // }),
            models.Area.findAll(),
            models.Villa.findAll(),
            models.StreetAddress.findAll()
        ]);

        const sortedOrders = customDeliveryOrderSort(deliveryOrders, areas, villas, streetAddresses);

        return res.json(sortedOrders);
    }
    else if (order_type === "scheduler") {

        if(status == null) status = 0;

        var selectedDate;
        var startOfDay;
        var endOfDay;

        var where = {};

        if(date != null && date != '') 
        {
            selectedDate = new Date(date);
            startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);
            where = {
                date: {
                    [Op.gte]: startOfDay,
                    [Op.lt]: endOfDay
                },
                //status: 0 // considering 1 as true
                //status 0 and pickup 0
            }

            console.log('deliveries', date, startOfDay, endOfDay);

        }
        else {
            where = {
                //status: 1,
                //pickedup: 0
            }
        }
        
        if(type == '' || type=='deliveries')
        {
            const query = DeliveryOrderQuery.translateDeliveryOrder();

            let [deliveryOrders, areas, villas, streetAddresses] = await Promise.all([
                // models.DeliveryOrders.findAll({
                //     where,
                //     order: [
                //         ['tripPriority1', 'ASC'],
                        
                //     ]
                // }),
                models.sequelize.query(query, {
                    type: models.sequelize.QueryTypes.SELECT
                }),
                models.Area.findAll(),
                models.Villa.findAll(),
                models.StreetAddress.findAll()
            ]); 

            const sortedOrders = customDeliveryOrderSort(deliveryOrders, areas, villas, streetAddresses);

            return res.json(sortedOrders);
        } 
        else if(type=='pickups')   
        {
            if(date != null && date != '')  {
//                console.log('pickups', startOfDay, endOfDay);
                const whereConditions = {
                    endDate: {
                        [Op.ne]: null,
                        [Op.gte]: startOfDay,
                        [Op.lt]: endOfDay
                    }, 
                }

                const query = DeliveryOrderQuery.translateDeliveryOrder(whereConditions);

                let [deliveryOrders, areas, villas, streetAddresses] = await Promise.all([
                    // models.DeliveryOrders.findAll({
                    //     where: {
                    //         endDate: {
                    //             [Op.ne]: null,
                    //             [Op.gte]: startOfDay,
                    //             [Op.lt]: endOfDay
                    //         }, 
                    //     },
                    //     order: [
                    //         ['tripPriority2', 'ASC'],
                            
                    //     ]
                    // }),
                    models.sequelize.query(query, {
                        type: models.sequelize.QueryTypes.SELECT
                    }),
                    models.Area.findAll(),
                    models.Villa.findAll(),
                    models.StreetAddress.findAll()
                ]);
        
                const sortedOrders = customDeliveryOrderSort(deliveryOrders, areas, villas, streetAddresses);

                return res.json(sortedOrders);
            }
            else {
                const whereConditions = {
                    endDate: {
                        [Op.ne]: null,
                    }, 
                }
                const query = DeliveryOrderQuery.translateDeliveryOrder(whereConditions);

                let [deliveryOrders, areas, villas, streetAddresses] = await Promise.all([
                    models.sequelize.query(query, {
                        type: models.sequelize.QueryTypes.SELECT
                    }),
                    models.Area.findAll(),
                    models.Villa.findAll(),
                    models.StreetAddress.findAll()
                ]);
                const sortedOrders = customDeliveryOrderSort(deliveryOrders, areas, villas, streetAddresses);

                return res.json(sortedOrders);
    
            }
        
        }

    }

    return res.send(req.query);
});

router.get("/location_reconciliation", async (req, res) => {
    //  Get delivery orders with a location that does not match any Street Address in the system.
    const all = req.query.all === "true";
    const { date } = req.query;

    if(date != '') {
        const selectedDate = new Date(date);
        const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);
        const deliveryOrders = all
            ? await models.sequelize.query(DeliveryOrderQuery.translateDeliveryOrder(), {
                type: models.sequelize.QueryTypes.SELECT
            })
            : await models.DeliveryOrders.findAll({
                where: {
                    date: {
                        [Op.gte]: startOfDay,
                        [Op.lt]: endOfDay
                    },
                    location: {
                        [Op.notIn]: models.sequelize.literal(
                            `(SELECT name FROM StreetAddress)`
                        ),
                    },
                },
            });
        return res.send(deliveryOrders);
    }
    else 
    {
        const deliveryOrders = all
            ? await models.sequelize.query(DeliveryOrderQuery.translateDeliveryOrder(), {
                type: models.sequelize.QueryTypes.SELECT
            })
            : await models.DeliveryOrders.findAll({
                where: {
                    location: {
                        [Op.notIn]: models.sequelize.literal(
                            `(SELECT name FROM StreetAddress)`
                        ),
                    },
                },
            });
        return res.send(deliveryOrders);
    }    
});

router.patch("/location_reconciliation", async (req, res) => {
    // Database should have foreign keys but to do that have to changes schema
    // Will be suboptimal to match the strings that will be used in scheduler
    const { areaId, villaId, streetAddressId, deliveryOrderId } = req.body;

    const area = await models.Area.findOne({
        where: {
            id: areaId
        }
    });

    const villa = await models.Villa.findOne({
        where: {
            id: villaId
        }
    });

    const streetAddress = await models.StreetAddress.findOne({
        where: {
            id: streetAddressId
        }
    });

    const deliveryOrder = await models.DeliveryOrders.update({
        location: streetAddress.name,
        area: area.name,
        plantation: villa.name
    }, {
        where: {
            id: deliveryOrderId
        }
    });

    return res.send(deliveryOrder);
});

router.put("/", async (req, res) => {
    try {
        const updateDO = await models.DeliveryOrders.update({
            truckID: req.body.truckID
        },
            {
                where: {
                    id: req.body.id
                }
            });
        return res.send(updateDO);
    } catch (error) {
        //(error);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deliveryOrder = await models.DeliveryOrders.findByPk(req.params.id);

        if (!deliveryOrder) {
            return res.status(404).json({ error: "Delivery order not found" });
        }

        await deliveryOrder.destroy();

        res.status(200).json({ message: "Delivery order deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while deleting the delivery order" });
    }
});

module.exports = router;
